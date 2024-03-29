// Initializes the `content` service on path `/content`
const createService = require('feathers-mongoose');
const createModel = require('../../models/content.model');
const hooks = require('./content.hooks');
const groupCreate = require('./content.groupCreate');

module.exports = function (app) {
  groupCreate(app);
  const Model = createModel(app);
  // const paginate = app.get('paginate');

  const options = {
    Model,
    // paginate
  };

  // Initialize our service with any options it requires
  app.use('/content', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('content');

  service.hooks(hooks);
};
