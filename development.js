const Application = require('thinkjs');
const babel = require('think-babel');
const watcher = require('think-watcher');
const notifier = require('node-notifier');
const path = require('path');

const instance = new Application({
  ROOT_PATH: __dirname,
  watcher: watcher,
  transpiler: [babel, {
    presets: ['think-node']
  }],
  notifier: notifier.notify.bind(notifier),
  env: 'development',
  RESOURCE_PATH: path.join(__dirname, 'www'),
  UPLOAD_PATH: path.join(__dirname, 'www/static/upload'),
  UPLOAD_BASE_URL: '/static/upload'
});

instance.run();
