const amqp = require('amqp-connection-manager');
const { logger } = require('@cges/helpers');

async function connect(urls) {
  let connection = null;
  let channel = null;
  if (!urls) {
    throw Error('You need a valid rabbitmq urls');
  }
  try {
    connection = await amqp.connect(urls);
    channel = await connection.createChannel({
      setup: channel => Promise.all([
        channel.prefetch(10),
      ])
    });
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      logger.error(`Couldn't connect to RabbitMQ at ${error.address}:${error.port}`);
      logger.debug('At development environment first run "npm run compose:tools"');
    } else if (error.code === 'ECONNRESET') {
      logger.error(`[AMQP] Connection refused by RabbitMQ ${error}`);
    } else {
      logger.error(`[AMQP] Connection ${error}`);
    }
  }
  return { connection, channel };
}

module.exports = {
  connect,
};
