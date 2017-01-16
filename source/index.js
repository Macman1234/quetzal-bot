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
    fs.readFile(__dirname + '/log.txt', (err, data) => {
        if (err) throw err;
        io.sockets.emit('begin', data.toString());
    });
});

fs.watch(__dirname + '/log.txt', (type, name) => {
    fs.readFile(__dirname + '/log.txt', (err, data) => {
        if (err) throw err;
        io.sockets.emit('update', data.toString());
    });
});

var logtofile = function(text, callback) {
    let textwithtimestamp = moment().format('MM/DD/YYYY, h:mm:ss a') + ' : ' + text;
    fs.appendFile(__dirname + '/log.txt', textwithtimestamp + '\n', (err) => {
        if (err) throw err;
    });
    if (callback) {
        callback();
    }
};

bot.on("ready", function() {
    //console.log("Ready to begin! Serving in " + bot.channels.array() + " channels");
    logtofile("Starting bot! Serving in " + bot.channels.array().length + " channels");
});

bot.on("disconnected", function() {
    logtofile('bot was disconnected!', process.exit(1));
});


bot.on("message", function(msg) {
    if (!msg.content.startsWith("!")) return;

    msg.content = msg.content.substr(1);

    if (msg.content === "ping") {
        msg.channel.sendMessage("pong");
        logtofile("ponged " + msg.author.username);
    } else if (msg.content === "face") {
        var face = cool();
        msg.channel.sendMessage(face);
        logtofile('sent face to ' + msg.author.username);
    } else if (msg.content.startsWith("youtube")) {
        var searchterm = msg.content.split(" ").slice(1).join(" ");
        youtubeClient.search(searchterm, 2, function(error, result) {
            if (error) {
                msg.channel.sendMessage(error);
                logtofile('error ' + error + ' thrown');
            } else {
                if (result.items[0].id.videoId) {
                    msg.channel.sendMessage("https://youtu.be/" + result.items[0].id.videoId);
                    logtofile('youtube url ' + "https://youtu.be/" + result.items[0].id.videoId + " sent to " + msg.author.username + ", search term was: " + searchterm);
                } else {
                    msg.channel.sendMessage("No results.");
                    logtofile(msg.author.username + " got no search results, search term was: " + searchterm);
                }
            }
        });
    }
});

fs.readFile(__dirname + '/key.txt', (err, data) => {
    key = data.toString();
    bot.login(key);
});