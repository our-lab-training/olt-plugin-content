
const validateMd5 = require('../../hooks/validate-md5');
const safeRemove = require('../../../../../hooks/safe-remove');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [validateMd5()],
    patch: [validateMd5()],
    remove: [safeRemove()]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
