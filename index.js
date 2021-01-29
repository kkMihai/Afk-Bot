const Discord = require('discord.js');
const bot = new Discord.Client();
const prefix = "!"; //your bot prefix
const fs = require('fs');
const db = require('quick.db');

bot.on("ready", async () => {
  console.log(`Logged in as ${bot.user.tag}`);
  })


bot.on("message", message => {
  let afk = new db.table("AFKs")
  const authorStatus = await afk.get(`${message.author.id}_${message.guild.id}`)
   const mentioned = message.mentions.members.first()

  if (mentioned) {
    const status = await afk.fetch(`${mentioned.id}_${message.guild.id}`);
    
   if (status) {
      const embed1 = new Discord.MessageEmbed()
      .setColor("GREEN")
     .setDescription(`**${mentioned.user.tag} is AFK: ${status}**`)

      message.channel.send(embed1).then(i => i.delete({timeout: 10000}));

    }

  }

   if (authorStatus) {
   afk.delete(`${message.author.id}_${message.guild.id}`)
    const embed2 = new Discord.MessageEmbed()
    .setColor("GREEN")
    .setDescription(`**Welcome Back __${message.author.tag}__, you are no longer AFK**`)

    message.channel.send(embed2).then(i => i.delete({timeout: 10000}));
 }
})

    


bot.on("message", async message => {
  if (!message.guild) return;
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;
  let args = message.content
    .slice(prefix.length)
    .trim()
    .split(" ");
  let cmd = args.shift().toLowerCase();
  message.prefix = prefix;
  if (!message.content.startsWith(prefix)) return;
     
  
  // Command Handler
  try {
    let commandFile = require(`./cmds/${cmd}.js`);
    commandFile.run(bot, message, args, prefix);
  } catch (err) {}
    })



bot.login("your bot token")
