const amqp = require('amqplib');
const { logger } = require('helpers');

async function connect(uri) {
  let connection = null;
  let channel = null;
  if (!uri) {
    throw Error('You need a valid rabbitmq uri');
  }
  try {
    connection = await amqp.connect(uri);
    channel = await connection.createChannel();
    logger.info(`🐭 RabbitMQ ready at ${uri.hostname}`);
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
