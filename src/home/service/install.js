'use strict';

import fs from 'fs';
import path from 'path';
import semver from 'semver';
import mysql from 'think-model-mysql';

const startPost = ``;

class InstallService extends think.Service {
  constructor(ip) {
    super();
    this.ip = ip;

    const dbConfig = think.config('model');
    if (think.isObject(dbConfig[dbConfig.type])) {
      this.dbConfig = dbConfig[dbConfig.type];
    }
  }

  getModel(name, module) {
    let dbConfig;
    if (name === true) {
      dbConfig = think.extend({}, this.dbConfig);
      dbConfig.database = '';
      name = '';
    } else {
      dbConfig = this.dbConfig;
    }

    return this.model(name || 'user', {
      type: 'mysql',
      mysql: think.extend({
        handle: mysql,
        dataStrings: true
      }, dbConfig)
    }, module);
  }

  checkDbInfo() {
    const dbInstance = this.getModel(true);
    return dbInstance.query('SELECT VERSION()').catch(() => {
      return Promise.reject('数据库信息有误');
    }).then(data => {
      let version;
      try {
        version = data[0]['VERSION()'].match(/^[\d.]/);
        if (think.isArray(version)) {
          version = data[0]['VERSION()'];
        } else {
          version = version[0];
        }

        this.dbConfig.encoding = semver.gt(version, '5.5.3') ? 'utf8mb4' : 'utf8';
      } catch (e) {
        this.dbConfig.encoding = 'utf8';
      }
      return version;
    });
  }

  async insertData(title, site_url) {
    let model = this.getModel(true);
    const dbExist = await model.query(
      'SELECT `TABLE_NAME` FROM `INFORMATION_SCHEMA`.`TABLES` WHERE `TABLE_SCHEMA`= \'' + this.dbConfig.database + '\''
    );

    if (think.isEmpty(dbExist)) {
      await model.query('CREATE DATABASE `' + this.dbConfig.database + '`').catch(() => {});
    }

    const dbFile = think.ROOT_PATH + path.sep + 'photon.sql';
    if (!think.isFile(dbFile)) {
      return Promise.reject('数据库文件（photon.sql）不存在，请联系重新下载');
    }

    let content = fs.readFileSync(dbFile, 'utf8');
    content = content.split('\n').filter(item => {
      item = item.trim();
      const ignoreList = ['#', 'LOCK', 'UNLOCK'];
      for (const it of ignoreList) {
        if (item.indexOf(it) === 0) {
          return false;
        }
      }
      return true;
    }).join(' ');
    content = content.replace(/\/\*.*?\*\//g, '').replace(/fk_/g, this.dbConfig.prefix || '');

    model = this.getModel();
    content = content.split(';');
    try {
      for (let item of content) {
        item = item.trim();
        if (item) {
          think.logger.debug(item);
          await model.query(item);
        }
      }
    } catch (e) {
      think.logger.debug(e);
      return Promise.reject('数据库导入失败，请在控制台下查看具体的错误信息');
    }

    const optionsModel = this.getModel('options');
    await optionsModel.where('1=1').update({value: ''});
    const salt = think.uuid(10) + '!@#$%^&*';
    this.password_salt = salt;

    await optionsModel.updateOptions('title', title);
    await optionsModel.updateOptions('site_url', site_url);
    await optionsModel.updateOptions('navigation', JSON.stringify([
      {'label': '首页', 'url': '/', 'option': 'home'},
      {'label': '归档', 'url': '/archives/', 'option': 'archive'},
      {'label': '标签', 'url': '/tags', 'option': 'tags'},
      {'label': '关于', 'url': '/about', 'option': 'user'},
      {'label': '友链', 'url': '/links', 'option': 'link'}
    ]));
    await optionsModel.updateOptions('password_salt', salt);
    await optionsModel.updateOptions('logo_url', '/static/img/logo.png');
    await optionsModel.updateOptions('theme', 'photon');
  }

  updateConfig() {
    const {database, prefix, encoding, host, port, user, password} = this.dbConfig;
    const data = {
      database,
      prefix,
      encoding,
      host,
      port,
      user,
      password
    };
    const content = `
'use strict';
module.exports = ${JSON.stringify(data, undefined, 2)}
`;
    let dbConfigFile;
    try {
      const srcPath = path.join(think.ROOT_PATH, 'src/common/config');
      fs.statSync(srcPath);
      dbConfigFile = path.join(srcPath, 'db.js');
    } catch (e) {
      dbConfigFile = path.join(think.APP_PATH, '/common/config/db.js');
    }
    fs.writeFileSync(dbConfigFile, content);

    think.config('model', think.extend({
      type: 'mysql',
      mysql: think.extend({
        handle: mysql,
        dateStrings: true
      }, this.dbConfig)
    }, think.config('model')));
  }

  async createAccount(username, password) {
    password = think.md5(this.password_salt + password);

    const model = this.getModel('user', 'admin');
    const data = {
      username,
      password,
      email: '',
      type: 1,
      status: 1,
      ip: this.ip
    };
    await model.addUser(data);
  }

  async addStartPost() {
    const postModel = this.getModel('post', 'admin');
    const data = {
      type: 0,
      status: 3,
      is_public: 1,
      comment_num: 0,
      allow_comment: 1,
      primary_img: '/static/img/logo.png',
      author: 'system',
      title: '欢迎使用 Photon',
      content: startPost,
      create_time: think.datetime(),
      update_time: think.datetime(),
      pathname: 'hello-world-via-photon'
    };

    const insert = await postModel.addPost(data);
    return insert;
  }

  async saveDbInfo(dbConfig) {
    this.dbConfig = dbConfig;
    await this.checkDbInfo();
    this.updateConfig();
  }

  async saveSiteInfo({title, site_url, username, password}) {
    await this.insertData(title, site_url);
    await this.createAccount(username, password);
    await this.addStartPost();

    global.photon.setInstalled();

    const optionsModel = this.getModel('options');
    await optionsModel.getOptions(true);
  }
}

const tables = ['cate', 'post', 'post_cate', 'post_tag', 'tag', 'user'];

InstallService.checkInstalled = async function() {
  const dbConfig = think.config('model');
  let database = dbConfig.database;
  let prefix = dbConfig.prefix;
  if (!database && think.isObject(dbConfig[dbConfig.type])) {
    database = dbConfig[dbConfig.type].database;
    prefix = dbConfig[dbConfig.type].prefix;
  }

  try {
    let existTables = await think.model('user', dbConfig).query(
      'SELECT `TABLE_NAME` FROM `INFORMATION_SCHEMA`.`TABLES` WHERE `TABLE_SCHEMA`=\'' +
      database + '\''
    );
    if (think.isEmpty(existTables)) {
      return false;
    }

    existTables = existTables.map(table => table.TABLE_NAME);
    const installed = tables.every(table => existTables.indexOf(prefix + table) > -1);
    if (installed) {
      global.photon.setInstalled();
    }
    return installed;
  } catch (e) {
    think.logger.debug(e);
    return false;
  }
};

export default InstallService;
