var fs = require('fs');
var cool = require('cool-ascii-faces');
var Discord = require("discord.js");
var YouTube = require('youtube-node');
var express = require('express');
var path = require('path');
var http = require('http');
var io = require('socket.io');
var bodyParser = require('body-parser');
var fs = require('fs');
var moment = require('moment');

var bot = new Discord.Client();

var youtubeClient = new YouTube();

youtubeClient.setKey('AIzaSyCdOuxh7jgLDXUxaM630eU4jx-MybF76q0');

var app = express();

var util = require('util');

app.set('port', 8080);

app.use(express.static(path.join(__dirname, 'public')));

var server = http.createServer(app);
io = io.listen(server);

io.set('authorization', (handshakeData, callback) => {
    if (handshakeData.xdomain) {
        callback('Cross-domain connections are not allowed');
    } else {
        callback(null, true);
    }
});

server.listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
});

io.sockets.on('connection', function(socket) {
    socket.on('message', function(message) {
        fs.readFile('log.txt', (err, data) => {
            if (err) throw err;
            io.sockets.emit('update', data.toString());
        });
    });
});

bot.on("ready", function() {
    console.log("Ready to begin! Serving in " + bot.channels.array() + " channels");
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
        msg.channel.sendMessage("pong");
        console.log("ponged " + msg.author.username);
        fs.appendFile('log.txt', moment().format('MM/DD/YYYY, h:mm:ss a') + ": ponged " + msg.author.username + '\n', (err) => {
            if (err) throw err;
        });
    } else if (msg.content === "face") {
        var face = cool();
        msg.channel.sendMessage(face);
        console.log("sent face to " + msg.author.username);
        fs.appendFile('log.txt', moment().format('MM/DD/YYYY, h:mm:ss a') + ': sent face to ' + msg.author.username + '\n', (err) => {
            if (err) throw err;
        });
    } else if (msg.content.startsWith("youtube")) {
        var searchterm = msg.content.split(" ").slice(1).join(" ");
        youtubeClient.search(searchterm, 2, function(error, result) {
            if (error) {
                msg.channel.sendMessage(error);
                console.log("youtube error from " + msg.author.username);
                fs.appendFile('log.txt', "youtube error from " + msg.author.username + '\n', (err) => {
                    if (err) throw err;
                });
            } else {
                try {
                    msg.channel.sendMessage("https://youtu.be/" + result.items[0].id.videoId);
                    console.log("youtube url " + "https://youtu.be/" + result.items[0].id.videoId + " sent to " + msg.author.username + ", search term was: " + searchterm);
                    fs.appendFile('log.txt', moment().format('MM/DD/YYYY, h:mm:ss a') + ": youtube url " + "https://youtu.be/" + result.items[0].id.videoId + " sent to " + msg.author.username + ", search term was: " + searchterm + '\n', (err) => {
                        if (err) throw err;
                    });
                } catch (err) {
                    msg.channel.sendMessage("No results.");
                    console.log("search term was: " + searchterm);
                    console.log("error was: " + err);
                    console.log("results were: " + JSON.stringify(result, null, 2));

                }
            }
        });
    }
});


bot.login("MjE0ODI2NDA3ODEyMDA1OTA4.C1LoFw.7xar4sqNLuwuBMwhok1HqhdV09Q");
