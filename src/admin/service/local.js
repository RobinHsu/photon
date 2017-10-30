import fs from 'fs';
import url from 'url';
import path from 'path';
import Base from './base';

const renameAsync = think.promisify(fs.rename, fs);

export default class extends Base {
  async uploadMethod(file, {name}) {
    const ext = /^\.\w+$/.test(path.extname(file)) ? path.extname(file) : '.png';
    const basename = (name || path.basename(file, ext)) + ext;

    const destDir = this.formatNow();
    const destPath = path.join(think.UPLOAD_PATH, destDir);
    if (!think.isDir(destPath)) {
      think.mkdir(destPath);
    }

    try {
      const filepath = path.join(destPath, basename);
      await renameAsync(file, filepath);
      return url.resolve(think.UPLOAD_BASE_URL, filepath.replace(think.RESOURCE_PATH, ''));
    } catch (e) {
      throw Error('FILE_UPLOAD_MOVE_ERROR');
    }
  }

  async run(file, config) {
    const url = await this.uploadMethod(file, config);
    return url;
  }
}
