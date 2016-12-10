const { request } = require('http');
const { resolve } = require('url');
const { extract } = require('tar-fs');
const { createGunzip } = require('zlib');
const path = require('path');
const async = require('async');
const ora = require('ora');

exports.SAMPLES_URL = 'http://owl.phy.queensu.ca/~phil/exiftool/sample_images.html';

function loadUrls(cb) {
    request(exports.SAMPLES_URL, (res) => {
        if (res.statusCode !== 200) return cb(new Error(`HTTP ${res.statusCode}`));
        res.setEncoding('utf8');
        const rawData = [];
        res.on('data', chunk => rawData.push(chunk));
        res.on('end', () => {
            const html = rawData.join('');
            const archives = [];
            const regex = /href='(.+\.tar\.gz)'/g;
            let m;
            while ((m = regex.exec(html)) !== null) {
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }
                archives.push(m[1]);
            }
            if (!archives.length) {
                cb(new Error(`Archives not found, check: ${exports.SAMPLES_URL}`));
            } else {
                cb(null, archives.map(a => resolve(exports.SAMPLES_URL, a)));
            }
        });
    }).on('error', cb).end();
}

function download(targetDir, callback) {
    process.stdout.write('\n');
    const spinner = ora('Loading list of archives').start();
    async.waterfall([
        loadUrls,
        (urls, cb) => cb(null, urls.slice(0, 1)),
        (urls, cb) => async.eachSeries(urls, (url, next) => {
            const filename = path.basename(url);
            spinner.text = `Downloading and extracting ${filename}`;
            request(url, res => res
                .pipe(createGunzip())
                .pipe(extract(targetDir, { readable: true }))
                .on('finish', next),
            ).on('error', cb).end();
        }, cb),
    ], (err) => {
        if (err) return console.error(err);
        spinner.text = `Done! See extracted files in ${targetDir}\n`;
        spinner.succeed();
        callback && callback();
    });
}

exports.loadUrls = loadUrls;
exports.download = download;
