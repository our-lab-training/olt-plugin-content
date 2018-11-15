// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const errors = require('@feathersjs/errors');

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
    const { data, app, existing } = context;
    const { md5 } = data;
    if(!md5) return context;

    let head = null;
    try {
      head = await app.buckets.private.headObject({
        Key: `${existing.groupId}/${existing.key}`,
      }).promise();
    } catch (err) {
      throw new errors.GeneralError('Failed to validate file, please contact an administrator.');
    }

    if(md5 !== head.ETag.replace(/"/g, '')) throw new errors.BadRequest('Invalid file validation provided.');

    return context;
  };
};
