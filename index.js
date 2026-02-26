const { Client, GatewayIntentBits, Events } = require('discord.js');
const handleButton = require('./interactions/buttonHandler');
const handleModal = require('./interactions/modalHandler');
const linkgenCommand = require('./commands/linkgen');
const config = require('./config');
const fs = require('fs');
const path = require('path');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers]
});

client.once(Events.ClientReady, () => {
    console.log(`Bot online come ${client.user.tag}`);
});

client.on(Events.MessageCreate, async (message) => {
    if (message.content === '!linkgen') {
        await linkgenCommand.execute(message);
    }
});

client.on(Events.InteractionCreate, async (interaction) => {

    if (interaction.isButton()) {
        await handleButton(interaction);
    }

    if (interaction.isModalSubmit()) {
        await handleModal(interaction, client);
    }
});

/*client.on(Events.GuildMemberAdd, async (interaction) => {

})*/

client.on(Events.InteractionCreate, async (interaction) => {

    // --- GESTIONE AUTOCOMPLETE ---
    if (interaction.isAutocomplete()) {
        const command = require(`./slash_commands/${interaction.commandName}`);
        if (!command || !command.autocomplete) return;

        try {
            await command.autocomplete(interaction);
        } catch (error) {
            console.error('[ERROR] autocomplete:', error);
        }
        return; // Importantissimo: non continuare al ChatInputCommand
    }

    // --- GESTIONE COMANDI NORMALI ---
    if (!interaction.isChatInputCommand()) return;

    const command = require(`./slash_commands/${interaction.commandName}`);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'C\'è stato un errore durante l\'esecuzione del comando.', ephemeral: true });
    }
});

client.on('guildMemberAdd', async (member) => {
    try {
        const roleId = '1475983423196631151'; // ID del ruolo da assegnare
        const role = member.guild.roles.cache.get(roleId);

        if (!role) {
            //console.log(`Ruolo con ID ${roleId} non trovato.`);
            return;
        }

        await member.roles.add(role);
        //console.log(`Ruolo assegnato a ${member.user.tag}`);
    } catch (error) {
        //console.error('Errore nell\'assegnare il ruolo:', error);
    }
});

client.login(config.token);

module.exports = client;