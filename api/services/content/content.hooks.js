const { alterItems, iff, isProvider, discard } = require('feathers-hooks-common');
const validateMd5 = require('../../hooks/validate-md5');
const presignedUrl = require('../../hooks/presigned-url');
const safeRemove = require('../../../../../hooks/safe-remove');

const setenv = rec => {rec.bucket = process.env.AWS_BUCKET_PRIVATE; rec.region = process.env.AWS_REGION;};

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      iff(isProvider('external'), discard('md5')),
      alterItems(setenv),
    ],
    update: [
      validateMd5(),
      iff(isProvider('external'), discard('groupId')),
      alterItems(setenv),
    ],
    patch: [
      validateMd5(),
      iff(isProvider('external'), discard('groupId')),
      alterItems(setenv),
    ],
    remove: [safeRemove()]
  },

  after: {
    all: [
      alterItems(rec => rec.key = `${rec.groupId}/${rec._id}.${rec.file.split('.').pop()}`),
      iff(isProvider('external'), discard('region', 'bucket')),
    ],
    find: [],
    get: [presignedUrl()],
    create: [presignedUrl()],
    update: [presignedUrl()],
    patch: [presignedUrl()],
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
