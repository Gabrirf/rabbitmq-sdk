const { logger } = require('@cges/helpers');

const rabbitmqConsumer = require('./consumer');
const rabbitmqPublisher = require('./publisher');
const rabbitmqConnection = require('./connection');

async function init(config) {
  const { connection, channel } = await rabbitmqConnection.connect(config.url);
  if (connection && channel) {
    rabbitmqPublisher.initPublisher(channel);
    rabbitmqConsumer.initConsumer(channel, config.queues);

    connection.on('connect', ({ url }) => {
      logger.info(`🐭 RabbitMQ ready at ${url.hostname}`);
    });
    connection.on('error', error => {
      logger.error(`[AMQP] ${error}`);
      connection.close();
    });
    connection.on('close', () => init(config));
  } else {
    logger.info('Trying to reconnect rabbitmq in 30s');
    setTimeout(() => init(config), 30000);
  }
}

module.exports = {
  init,
  ...rabbitmqConnection,
  ...rabbitmqConsumer,
  ...rabbitmqPublisher,
};
