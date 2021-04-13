/**
 * 生产version文件到dist
 */
const fs = require('fs');
const path = require('path');
const { version, name } = require('../package.json');

const versionObj = {
  release: `${name}_${version}`,
};

fs.writeFile(path.join(__dirname, '..', 'dist/version.json'), JSON.stringify(versionObj), () => {
  console.log('write version.json success !');
});
