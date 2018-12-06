const { alterItems, iff, isProvider, discard } = require('feathers-hooks-common');
const presignedUrl = require('../../hooks/presigned-url');
const checkCopy = require('../../hooks/check-copy');
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
      iff(isProvider('external'), discard('groupId')),
      alterItems(setenv),
    ],
    patch: [
      iff(isProvider('external'), discard('groupId')),
      alterItems(setenv),
    ],
    remove: [safeRemove()]
  },

  after: {
    all: [
      alterItems(rec => {const parts = rec.name.split('/'); parts.shift(); rec.filename = parts.pop(); rec.path = parts.join('/');}),
      alterItems(rec => rec.key = `${rec.groupId}/${rec._id}.${rec.ext ? rec.ext : rec.filename.split('.').pop()}`),
      iff(isProvider('external'), discard('region', 'bucket')),
    ],
    find: [],
    get: [presignedUrl()],
    create: [presignedUrl(), checkCopy()],
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
