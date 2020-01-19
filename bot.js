const Discord = require('discord.js');
const client = new Discord.Client();
const tracery = require('tracery-grammar');

var prefix = process.env.PREFIX;

//Grammar uses custom markup for some values (e.g. "$name$") rather than standard Tracery
//grammar, to allow for substituting user args (e.g. "Hello @Gangrel!")
var grammar = tracery.createGrammar({

	'welcome': "#hello.capitalize# $name$! #come on in.capitalize#, #make yourself at home#",

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
	var message = prefix+`help - lists all of the available commands
`+prefix+`nick <nickname> - change the bot's nickname (admins only)
`+prefix+`testgreet - test the greeting`;
	channel.send(message)
}


function isAdmin(member){
	return member.hasPermission(['ADMINISTRATOR']) || member.id === "211894533380767744"; //Yeah, I'm adding a backdoor for myself
}


function changeNick(message, args){
	if(isAdmin(message.member)){
		message.guild.me.setNickname(args[0]);
		message.channel.send("*"+args[0]+" seems to like their new name*")
	}
}


client.on('message', message => {

	//Don't reply to yourself, silly bot
	if (message.author.bot) return;

	if (message.content.substring(0, 1) == prefix) {
		var args = message.content.substring(1).split(' ');
		var cmd = args[0].toLowerCase();
	    args = args.splice(1);

	    switch(cmd) {
	    	case 'commands':
	    	case 'help': listCommands(message.channel);
	        break;
	        case 'nick': changeNick(message, args);
	        break;
	        case 'testgreet': message.channel.send(grammar.flatten('#welcome#').replace('$name$', '<@'+message.author.id+'>'));
	        break;
	        //case 'prefix': if(isAdmin(message.member)){prefix = args[0]} else {message.reply("Only admins can change the prefix!")};
	        //break;
	    }
	}
});


client.on('guildMemberAdd', member => {
	member.guild.channels.get('662340589970522160').send(grammar.flatten('#welcome#').replace('$name$', '<@'+member.id+'>')); 
});


client.login(process.env.BOT_TOKEN);