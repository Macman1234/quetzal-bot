var cool = require('cool-ascii-faces');
var Discord = require("discord.js");

var bot = new Discord.Client();

//when the bot is ready
bot.on("ready", () => {
    console.log(`Ready to begin! Serving in ${bot.channels.length} channels`);
});

bot.on("disconnected", () => {
    //alert the console
    console.log("Disconnected!");

    //exit node.js with an error
    process.exit(1);
});


bot.on("message", function(msg) {
    if (!msg.content.startsWith("!")) return;

    msg.content = msg.content.substr(1);

    if (msg.content === "ping") {
        bot.sendMessage(msg.channel, "pong");
    } else if (msg.content === "pong") {
        bot.sendMessage(msg.channel, "polo");
    } else if (msg.content === "face") {
        bot.sendMessage(msg.channel, cool());
    }
});

bot.loginWithToken("MjE0ODI2NDA3ODEyMDA1OTA4.CpPzww.WQAVrwaHbTlqiLiOFankkJYPhwo");
