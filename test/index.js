var fs = require('fs');
var cool = require('cool-ascii-faces');
var Discord = require("discord.js");
var YouTube = require('youtube-node');

var bot = new Discord.Client();

var youtubeClient = new YouTube();

youtubeClient.setKey('AIzaSyCdOuxh7jgLDXUxaM630eU4jx-MybF76q0');

//when the bot is ready
bot.on("ready", function() {
    console.log("Ready to begin! Serving in " + bot.channels.length + " channels");
});

bot.on("disconnected", function() {
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
        console.log("ponged " + msg.sender.name);
    } else if (msg.content === "face") {
        var face = cool();
        bot.sendMessage(msg.channel, face);
        console.log("sent face to " + msg.sender.name);
    } else if (msg.content.startsWith("youtube")) {
        var searchterm = msg.content.split(" ").slice(1).join(" ");
        youtubeClient.search(searchterm, 2, function(error, result) {
            if (error) {
                bot.sendMessage(msg.channel, error);
                console.log("youtube error from " + msg.sender.name);
            } else {
                try {
                    bot.sendMessage(msg.channel, "https://youtu.be/" + result.items[0].id.videoId);
                    console.log("youtube url " + "https://youtu.be/" + result.items[0].id.videoId + " sent to " + msg.sender.name);
                } catch (err) {
                    bot.sendMessage(msg.channel, "No results.");
                    console.log("search term was: " + searchterm);
                    console.log("error was: " + err);
                    console.log("results were: " + JSON.stringify(result, null, 2));
                }
            }
        });
    }
    /* else if (msg.content.startsWith("womp")) {
        bot.joinVoiceChannel(msg.sender.voiceChannel, function(er, connection) {
            console.log("channel " + msg.sender.voiceChannel + "joined")
            connection.playFile("../womp.mp3", function(intent) {
                intent.on("end", () => {
                    setTimeout(function() {
                        bot.leaveVoiceChannel(msg.sender.voiceChannel);
                        console.log("womped " + msg.sender.name);
                    }, 2000);
                });
            });
        });
    }
    */
});


bot.loginWithToken("MjE0ODI2NDA3ODEyMDA1OTA4.CpPzww.WQAVrwaHbTlqiLiOFankkJYPhwo");
