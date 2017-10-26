import {PasswordHash} from 'phpass';

module.exports = class extends think.Model {
  getEncryptPassword(password) {
    const passwordHash = new PasswordHash();
    const hash = passwordHash.hashPassword(password);
    return hash;
  }

  checkPassword(userInfo, password) {
    const passwordHash = new PasswordHash();
    return passwordHash.checkPassword(password, userInfo.password);
  }

  addUser(data, ip) {
    const create_time = think.datetime();
    const encryptPassword = this.getEncryptPassword(data.password);
    return this.where({
      name: data.username
    }).thenAdd({
      name: data.username,
      display_name: data.pen_name,
      password: encryptPassword,
      create_time: create_time,
      last_login_time: create_time,
      create_ip: ip,
      last_login_ip: ip,
      type: data.type || 1,
      status: data.status || 1
    });
  }

  async saveUser(data, ip) {
    const info = await this.where({id: data.id}).find();
    if (think.isEmpty(info)) {
      return Promise.reject(new Error('UESR_NOT_EXIST'));
    }
    let password = data.password;
    if (password) {
      password = this.getEncryptPassword(password);
    }
    const updateData = {};
    ['pen_name', 'type', 'status'].forEach(item => {
      if (data[item]) {
        updateData[item] = data[item];
      }
    });
    if (password) {
      updateData.password = password;
    }
    if (think.isEmpty(updateData)) {
      return Promise.reject('DATA_EMPTY');
    }

    updateData.last_login_time = think.datetime();
    updateData.last_login_ip = ip;
    return this.where({id: data.id}).update(updateData);
  }
};
