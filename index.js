var cool = require('cool-ascii-faces');
var Discord = require("discord.js");
var YouTube = require('youtube-node');

var bot = new Discord.Client();

var youtubeClient = new YouTube();

youtubeClient.setKey('AIzaSyCdOuxh7jgLDXUxaM630eU4jx-MybF76q0');

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
        console.log("ponged " + msg.sender)
    } else if (msg.content === "face") {
        bot.sendMessage(msg.channel, cool());
        console.log("sent face to " + msg.sender)
    } else if (msg.content.startsWith("youtube")) {
        var searchterm = msg.content.split(" ").slice(1).join(" ");
        youtubeClient.search(searchterm, 2, function(error, result) {
            if (error) {
                bot.sendMessage(msg.channel, error);
                console.log("youtube error from " + msg.sender)
            } else {
                try {
                    bot.sendMessage(msg.channel, "https://youtu.be/" + result.items[0].id.videoId);
                    console.log("youtube url " + "https://youtu.be/" + result.items[0].id.videoId + " sent to " + msg.sender)
                } catch (err) {
                    bot.sendMessage(msg.channel, "No results.")
                    console.log("search term was: " + searchterm)
                    console.log("error was: " + err)
                    console.log("results were: " + JSON.stringify(result, null, 2));
                }
            }
        });
    } //else if (msg.content.startsWith("waifu"))
    //bot.sendFile(msg.channel, "http://vignette2.wikia.nocookie.net/overwatch/images/3/3b/Mei_portrait.png");
    //console.log("waifu-d " + msg.sender)
});

bot.loginWithToken("MjE0ODI2NDA3ODEyMDA1OTA4.CpPzww.WQAVrwaHbTlqiLiOFankkJYPhwo");
