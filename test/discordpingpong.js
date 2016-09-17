/*
  A ping pong bot, whenever you send "ping", it replies "pong".
*/

// import the discord.js module
var Discord = require('discord.js');

// create an instance of a Discord Client, and call it bot
var bot = new Discord.Client();

// the token of your bot - https://discordapp.com/developers/applications/me
var token = 'MjE0ODI2NDA3ODEyMDA1OTA4.CpPzww.WQAVrwaHbTlqiLiOFankkJYPhwo';

// the ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted.
bot.on('ready', function() {
  console.log('I am ready!');
});

// create an event listener for messages
bot.on('message', function(message) {
  // if the message is "ping",
  if (message.content === 'ping') {
    // send "pong" to the same channel.
    message.channel.sendMessage('pong');
  }
});

// log our bot in
bot.login(token);
