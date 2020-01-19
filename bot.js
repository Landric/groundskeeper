const Discord = require('discord.js');
const client = new Discord.Client();
const tracery = require('tracery-grammar');

var prefix = process.env.PREFIX;

//Grammar uses custom markup for some values (e.g. "$name$") rather than standard Tracery
//grammar, to allow for substituting user args (e.g. "Hello @Gangrel!")
var grammar = tracery.createGrammar({

	'welcome': "#greeting.capitalize#, #come on in#! #make yourself at home.capitalize#",

	'greeting': [
		"#hello# @$name$!"
	],

	'hello': ["hi there", "hi", "hey", "howdy"],

	'come on in': [
		"come on in",
		"grab a seat"
	],

	'make yourself at home': [
		'make yourself at home',
		"don't mind #patron#, they don't bite",
		"there's beer in the fridge, and coffee on the stove"
	],

	'patron': ["Gangrel", "Grin", "Rhet", "Mag", "Sunday"]
});

grammar.addModifiers(tracery.baseEngModifiers); 




function listCommands(channel){
	var message = prefix+`help - lists all of the eavailable commands
	`+prefix+`nick <nickname> - change the bot's nickname (admins only)`;
	channel.send(message)
}


function changeNick(message, args){
	if(message.member.hasPermission(['ADMINISTRATOR'])){
		message.guild.me.setNickname(args[0]);
	}
}


client.on('message', message => {

	//Don't reply to yourself, silly bot
	if (message.author.bot) return;

	if (message.substring(0, 1) == prefix) {
		var args = message.substring(1).split(' ');
		var cmd = args[0].toLowerCase();
	    args = args.splice(1);

	    switch(cmd) {
	    	case 'commands':
	    	case 'help': listCommands(message.channel);
	        break;
	        case 'nick': changeNick(message, args);
	        break;
	        case 'testgreet': message.reply(grammar.flatten('#welcome#').replace('$name$', message.author.id));
	        break;
	    }
	}
});


client.on('guildMemberAdd', member => {
	member.guild.channels.get('662340589970522160').send(grammar.flatten('#welcome#').replace('$name$', member.id)); 
});


client.login(process.env.BOT_TOKEN);