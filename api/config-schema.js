const { Schema } = require('mongoose');

module.exports = (app) => {
  const mongooseClient = app.get('mongooseClient');

  const contentConfig = new Schema({
    //something
  });

  app.plugins.content.model = mongooseClient.model('contentConfig', contentConfig);
};