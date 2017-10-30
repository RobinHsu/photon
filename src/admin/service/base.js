import path from 'path';
import moment from 'moment';

export default class extends think.Service {
  getAbsOrigin(origin) {
    const reg = /^(https?:)?\/\/.+/;
    if (!reg.test(origin)) {
      return `http://${origin}`;
    }
    return origin;
  }

  formatNow() {
    return moment(new Date()).format('YYYYMMDD');
  }

  getSavePath(filename, prefix) {
    prefix = prefix ? `${prefix}/` : '';
    const dir = this.formatNow();
    const basename = path.basename(filename);
    return `${prefix}${dir}/${basename}`;
  }

  async uploadMethod() {}

  async upload(filename, config) {
    const result = await this.uploadMethod(filename, config);
    return result;
  }
}
