var cool = require('cool-ascii-faces');
var Discord = require("discord.js");

var mybot = new Discord.Client();

mybot.on("message", function(message) {
    if(message.content === "!ping") {
        mybot.sendMessage(message.channel, "pong");
    }
    if(message.content === "!face") {
        mybot.sendMessage(message.channel, cool());
    }
});

mybot.loginWithToken("MjE0ODI2NDA3ODEyMDA1OTA4.CpPzww.WQAVrwaHbTlqiLiOFankkJYPhwo");
