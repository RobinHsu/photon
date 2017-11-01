const BaseRest = require('../rest.js');

module.exports = class extends BaseRest {
  getAction() {
    return this.redirect('/static/lib/ueditor/config.json');
  }

  async postAction() {
    const file = this.file('file');

    if (!file) {
      return this.fail('FILE_UPLOAD_ERROR');
    }

    return this.serviceUpload('local', file.path, {
      name: this.post('name')
    });
  }

  async serviceUpload(service, file, config) {
    try {
      const uploader = think.service(service, 'admin');
      const result = await uploader.run(file, config);
      return this.json({
        state: 'SUCCESS',
        url: result,
        title: '',
        original: '',
        type: '',
        size: ''
      });
    } catch (e) {
      return this.fail(e || 'FILE_UPLOAD_ERROR');
    }
  }
};
