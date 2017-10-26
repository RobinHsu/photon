module.exports = class extends think.Logic {
  indexAction() {

  }

  installAction() {
    this.rules = {
      step: {
        int: true,
        default: 1
      }
    };

    if (this.isPOST) {
      this.rules = think.extend({
        db_account: {
          requiredIf: ['step', 1]
        },
        db_name: {
          requiredIf: ['step', 1]
        },
        title: {
          requiredIf: ['step', 2]
        },
        site_url: {
          requiredIf: ['step', 2],
          url: true
        },
        username: {
          requiredIf: ['step', 2],
          length: {
            min: 4
          }
        },
        password: {
          requiredIf: ['step', 2],
          length: {
            min: 6
          }
        }
      }, this.rules);
    }
  }
};
