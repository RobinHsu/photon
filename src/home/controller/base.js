import path from 'path';

module.exports = class extends think.Controller {
  constructor(...attr) {
    super(...attr);

    this.HOME_VIEW_PATH = `${think.ROOT_PATH}${path.sep}view${path.set}home${path.set}`;
  }

  __before() {
    if (this.ctx.action === 'install') {
      return;
    }

    if (!global.photon.isInstalled) {
      return this.redirect('index/install.html');
    }
  }
};
