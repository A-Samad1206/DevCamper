const redis = require('redis');
const chalk = require('chalk');
// redis-server
// redis-cli
// reddis-commander

const client = redis.createClient({
  port: 6379,
  host: '127.0.0.1',
});
const info = chalk.blue.bgWhite;
client.on('connect', () => {
  console.log(info('Clients connected to Redis'));
});

client.on('error', (err) => {
  console.log(chalk.red.bgWhite(err));
});

client.on('ready', () => {
  console.log(info('Clients connected to Redis & ready to use....'));
});
client.on('end', () => {
  console.log(info('Clients disconnected to Redis'));
});

process.on('SIGNIT', () => {
  client.quit();
});

module.exports = client;
