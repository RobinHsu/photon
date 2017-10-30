const Application = require('thinkjs');
const path = require('path');

const instance = new Application({
  ROOT_PATH: __dirname,
  proxy: true, // use proxy
  env: 'production',
  RESOURCE_PATH: path.join(__dirname, 'www'),
  UPLOAD_PATH: path.join(__dirname, 'www/static/upload'),
  UPLOAD_BASE_URL: '/static/upload'
});

instance.run();
