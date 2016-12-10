# exiftool-sample-images

Download and extract [ExifTool sample images][exiftool-sample-images] to the target dir

## Install
 
```
npm install exiftool-sample-images
```

## Usage

### Module

```js
const { download } = require('exiftool-sample-images');
const targetDir = path.join(process.cwd(), 'sample-images');

download(targetDir, () => {
    console.log('Done!');
});
```

### CLI

**package.json**

```json
{
  "name": "module-name",
  "scripts": {
    "download-sample-images": "exiftool-sample-images ./sample-images"
  }
}
```

```sh
$ npm run download-sample-images
```

**Terminal**

```sh
$ node_modules/.bin/exiftool-sample-images ./sample-images
```

[exiftool-sample-images]: http://owl.phy.queensu.ca/~phil/exiftool/sample_images.html