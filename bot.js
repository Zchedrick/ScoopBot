const { Client, GatewayIntentBits } = require('discord.js');
const request = require('./request');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (msg) => {
    if (msg.author.bot) return;

    if (!msg.content.startsWith('!fetch ')) return;

    const url = msg.content.replace('!fetch ', '').trim();

    msg.reply('Fetching...');

    const [success, content] = await request(url);

    if (!success) {
        return msg.reply(content);
    }

    const buffer = Buffer.from(content, 'utf8');

    await msg.reply({
        files: [{
            attachment: buffer,
            name: 'script.lua'
        }]
    });
});

client.login(process.env.TOKEN);
