const services = require('./services');
const configSchema = require('./config-schema');

module.exports = (app) => {
  app.configure(services);
  app.configure(configSchema);
};