const path = require('path');

module.exports = {
  RESOURCE_PATH: path.join(think.ROOT_PATH, 'www'),
  UPLOAD_PATH: path.join(think.ROOT_PATH, 'www/static/upload'),
  UPLOAD_BASE_URL: '/static/upload'
};
