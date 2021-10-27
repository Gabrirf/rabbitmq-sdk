async function connectToQueue(channel, exchange, queue, controller) {
  channel.assertExchange(exchange, 'direct', {
    durable: true,
  });

  const q = await channel.assertQueue(queue);
  
  channel.bindQueue(q.queue, exchange, queue);

  channel.consume(q.queue, msg => controller(msg, channel), { noAck: false });
}

function initConsumer(channel, queues = []) {
  if (!channel) {
    throw new Error('No channel to rabbitmq found');
  }

  const exchange = 'router';
  queues.forEach(queue => {
    connectToQueue(channel, exchange, queue.name, queue.controller);
  });

  return channel;
}

module.exports = {
  initConsumer,
  connectToQueue,
};
