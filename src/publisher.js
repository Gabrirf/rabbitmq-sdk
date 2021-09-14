const { logger } = require('helpers');

let channel = null;

function initPublisher(ch) {
  channel = ch;
}

async function publish(message, queue) {
  try {
    if (!channel) {
      throw new Error('No channel to rabbitmq found');
    }
    const exchange = 'router';

    channel.assertExchange(exchange, 'direct', {
      durable: true,
    });

    const sent = await channel.publish(exchange, queue, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });
    if (!sent) {
      throw new Error('Channel buffer is full');
    }
    logger.info(`Message sent ${JSON.stringify(message)}`);
    return message;
  } catch (error) {
    logger.error(`Rabbit publish ${JSON.stringify(error)}`);
    return error;
  }
}

function publishMany(messages, queue) {
  messages.map(async data => publish(data, queue));
}

module.exports = {
  publish,
  publishMany,
  initPublisher,
};
