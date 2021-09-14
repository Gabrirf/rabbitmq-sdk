# rabbitmq-sdk

Módulo para centralizar y facilitar el uso del protocolo amqp con rabbitmq.

## Uso

### Inicialización

Para iniciar la conexión será necesario invocar al método `init` pasándole el objeto de configuración.

```javascript
const { rabbitmqService } = require('@cges/rabbitmq-sdk');

rabbitmqService.init(rabbitmqConfig);
```

Un ejemplo de configuración sería el siguiente:

```javascript
const rabbitmqConfig = {
  url: {
    protocol: 'amqp',
    hostname: process.env.RABBITMQ_HOST || 'localhost',
    port: process.env.RABBITMQ_PORT || 5672,
    vhost: process.env.RABBITMQ_VHOST || '/',
    username: process.env.RABBITMQ_USER || 'guest',
    password: process.env.RABBITMQ_PASS || 'guest',
    locale: 'en_US',
    frameMax: 0,
    heartbeat: process.env.RABBITMQ_HEARTBEAT || 60,
  },
};
```

Con esto, ya deberíamos ver los mensajes en consola de la conexión realizada o los intentos de esta en caso de fallo.

### Publicar

Una vez conectados, para publicar tan solo será necesario invocar al método `publish` pasando el objeto del mensaje (_message_) y el nombre de la cola (_queue_)

```javascript
const rabbitmqService = require('@cges/rabbitmq-sdk');

const message = { foo: 'bar' };
rabbitmqService.publish(message, 'queue');
```

### Consumir

Para conectarse a una cola, consumir sus mensajes y definir el controlador que va a dispararse con el evento, será necesario incluir en la configuración de carga un array llamado `queues` que contendrá objetos con la información del nombre de la cola (_name_) y la función, o controlador, que se va a usar una vez se reciba por la misma (_controller_).
Un ejemplo de la estructura se muestra en el siguiente ejemplo:

```javascript
const rabbitmqService = require('@cges/rabbitmq-sdk');
const rabbitmqController = require('../controllers/rabbitmq-controller');

module.exports = config => {
  const queues = [
    {
      name: 'queue1',
      controller: function controller1(msg, channel) {
        // TODO ...
      },
    },
    {
      name: 'queue2',
      controller: function controller2(msg, channel) {
        // TODO ...
      },
    },
  ];
  rabbitmqService.initRabbitMQ({ ...config, queues });
};
```

> Como buena práctica se recomienda mover las funciones a la carpeta controllers, quedando un código similar a:
> 
> ```javascript
> const rabbitmqService = require('@cges/rabbitmq-sdk');
> const rabbitmqController = require('../controllers/> rabbitmq-controller');
> 
> module.exports = config => {
>   const queues = [
>     {
>       name: 'events',
>       controller: rabbitmqController.controller1,
>     },
>     {
>       name: 'populate',
>       controller: rabbitmqController.controller2,
>     },
>   ];
>   rabbitmqService.initRabbitMQ({ ...config, queues });
> };
> ```
> 
> Donde el fichero `rabbitmq-controller.js` contendrá las funciones que harán de controlador de los mensajes entrantes.
> 
> ```javascript
> function controller1(msg, channel) {
>   // TODO ...
> }
> function controller2(msg, channel) {
>   // TODO ...
> }
> module.exports = {
>   controller1,
>   controller2,
> };
> ```