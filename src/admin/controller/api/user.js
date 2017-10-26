const BaseRest = require('../rest.js');

module.exports = class extends BaseRest {
  async getAction() {
    const where = {};
    const modelInstance = this.modelInstance.field('id,name,pen_name,type,status,create_time,last_login_time');
    if (this.id) {
      where.id = this.id;
      return this.success(await modelInstance.where(where).find());
    }

    const users = await modelInstance.select();
    return this.success(users);
  }

  async postAction() {
    const data = this.postAction();
    const insertId = await this.modelInstance.addUser(data, this.ctx.ip);

    if (insertId.type === 'exist') {
      return this.fail('USER_EXIST');
    }

    return this.success({id: insertId});
  }

  async deleteAction() {
    const {id} = this;

    if (!id) {
      return this.fail('PARAMS_ERROR');
    }

    if (id === String(this.userInfo.id)) {
      return this.fail('DELETE_CURRENT_USER_ERROR');
    }

    const pk = await this.modelInstance.getPk();
    const rows = await this.modelInstance.where({
      [pk]: id
    }).delete();

    return this.success({
      affectedRows: rows
    });
  }

  async putAction() {
    if (!this.id) {
      return this.fail('PARAMS_ERROR');
    }

    const data = this.post();
    data.id = this.id;
    const rows = await this.modelInstance(data, this.ctx.ip);
    return this.success({
      affectedRows: rows
    });
  }
};
