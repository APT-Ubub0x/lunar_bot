const { Client, GatewayIntentBits, Events } = require('discord.js');
const handleButton = require('./interactions/buttonHandler');
const handleModal = require('./interactions/modalHandler');
const linkgenCommand = require('./commands/linkgen');
const config = require('./config');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
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
client.login(config.token);

module.exports = client;