module.exports = class extends think.Model {
  get cacheKey() {
    return 'website_options';
  }

  get cacheOptions() {
    return {
      timeout: 30 * 24 * 3600 * 1000,
      type: !think.isMaster ? 'file' : 'memory'
    };
  }

  async getOptions(flag) {
    if (flag === true) {
      await think.cache(this.cacheKey, null);
    }

    const ret = await think.cache(this.cacheKey, async() => {
      const data = await this.select();
      const result = {};
      data.forEach(item => {
        result[item.key] = item.value;
      });
      return result;
    });

    if (ret) {
      if (ret.comment && think.isString(ret.comment)) {
        ret.comment = JSON.parse(ret.comment);
      }
      if (!ret.comment) {
        ret.commemt = {type: 'disqus'};
      }

      if (ret.upload && think.isString(ret.upload)) {
        ret.upload = JSON.parse(ret.upload);
      }
      if (!ret.upload) {
        ret.upload = {type: 'local'};
      }

      if (ret.push_sites && think.isString(ret.push_sites)) {
        ret.push_sites = JSON.parse(ret.push_sites);
      }
      if (!ret.push_sites) {
        ret.push_sites = {};
      }
    }

    return ret;
  }

  async updateOptions(key, value) {
    const data = think.isObject(key) ? think.extend({}, key) : {[key]: value};
    let cacheData = await think.cache(this.cacheKey, undefined);
    if (think.isEmpty(cacheData)) {
      cacheData = await this.getOptions(true);
    }

    const changedData = {};
    for (const key in data) {
      if (data[key] !== cacheData[key]) {
        changedData[key] = data[key];
      }
    }

    if (think.isEmpty(changedData)) {
      return;
    }

    const p1 = think.cache(this.cacheKey, think.extend(cacheData, changedData));
    const promises = [p1];
    for (const key in changedData) {
      const value = changedData[key];
      const exist = await this.where({key: key}).count('key');
      let p;
      if (exist) {
        p = this.where({key: key}).update({value: value});
      } else {
        p = this.add({key, value});
      }
      promises.push(p);
    }
    await Promise.all(promises);
    await this.getOptions(true);

    if (typeof changedData.auto_summary !== 'undefined') {
      const postModel = think.model('post', {}, 'admin');
      // doesn't wait for return
      await postModel.updateAllPostSummaries();
    }
  }
};
