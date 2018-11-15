// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const errors = require('@feathersjs/errors');

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return context => {
    return new Promise( (resolve, reject) => {
      const { method, app, result } = context;
      const {key} = result;

      if (method === 'get') {
        app.buckets.private.getSignedUrl('getObject', {Key: key}, (err, url) => {
          if(err){
            console.error(err); // eslint-disable-line no-console
            return reject(new errors.GeneralError('Could not initiate download link, please contact an administrator.'));
          }
          context.result.url = url;
          resolve(context);
        });
      } else {
        app.buckets.private.createPresignedPost({
          Bucket: result.bucket,
          Fields: {
            key,
          },
          Conditions: [
            { 'bucket': result.bucket },
            ['content-length-range', 0, 1048576],
            { 'success_action_status': '200' },
          ],
          Expires: 900,
        }, (err, data) => {
          data.fields.success_action_status = '200';
          context.result.fields = data.fields;
          context.result.url = data.url;
          resolve(context);
        });
      }
    });
  };
};
