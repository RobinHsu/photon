import InstallService from '../service/install';
const Base = require('./base.js');

module.exports = class extends Base {
  indexAction() {
    return this.display();
  }

  async installAction() {
    const step = this.get('step');
    const instance = this.service('install', 'home', this.ctx.ip);
    let message = '';

    this.assign({step});
    if (this.isGet) {
      if (global.photon.isInstalled) {
        return this.redirect('/');
      }

      let dbConfig = this.config('model');
      dbConfig = dbConfig[dbConfig.type];
      const isDbConfig = think.isObject(dbConfig) &&
                         dbConfig.host &&
                         dbConfig.port &&
                         dbConfig.database &&
                         dbConfig.user &&
                         dbConfig.password;

      switch (step) {
        case 1:
          if (isDbConfig) {
            this.redirect('/index/install?step=2');
          }
          break;
        case 2:
          if (!isDbConfig) {
            this.redirect('/index/install');
          }
          if (await InstallService.checkInstalled()) {
            message = 'success';
          }
      }

      this.assign({message});
      return this.display();
    }

    if (global.photon.isInstalled) {
      return this.fail('SYSTERM_INSTALLED');
    }

    const errors = this.assign('errors');
    if (!think.isEmpty(errors)) {
      this.assign('message', errors[Object.keys(errors)[0]]);
      return this.display();
    }

    const data = this.post();

    this.assign({step: data.step});

    switch (data.step) {
      case 2:
        const siteInfo = {
          title: data.title,
          site_url: data.site_url,
          username: data.username,
          password: data.password
        };
        try {
          await instance.saveSiteInfo(siteInfo);
          message = 'success';
        } catch (e) {
          message = e;
        }
        break;

      default:
        const dbInfo = {
          host: data.db_host,
          port: data.db_port,
          database: data.db_name,
          user: data.db_account,
          password: data.db_password,
          prefix: data.db_table_prefix
        };
        try {
          await instance.saveDbInfo(dbInfo);
          message = 'success';
        } catch (e) {
          message = e;
        }
        break;
    }
    this.assign('message', message);
    this.assign('data', data);
    return this.display();
  }
};
