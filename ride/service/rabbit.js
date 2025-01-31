const amqp = require('amqplib')

const rmqurl = process.env.RABBIT_URL

let connection,channel;

async function connect() {
    connection = await amqp.connect(rmqurl);
    channel = await connection.createChannel();
    console.log("Ride service connected to RabbitMq");
    
}

async function subscribeToQueue(queueName, callback) {
    if (!channel) await connect();
    await channel.assertQueue(queueName);
    channel.consume(queueName, (message) => {
        callback(message.content.toString());
        channel.ack(message);
    });
}

async function publishToQueue(queueName, data) {
    if (!channel) await connect();
    await channel.assertQueue(queueName);
    channel.sendToQueue(queueName, Buffer.from(data));
}

module.exports = {
    subscribeToQueue,
    publishToQueue,
    connect
}