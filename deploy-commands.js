const { REST, Routes } = require('discord.js');
const config = require('./config');
const fs = require('fs');

const commands = [];
const commandFiles = fs.readdirSync('./slash_commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./slash_commands/${file}`);
    if (!command.data) {
        console.warn(`⚠ Ignored file ${file}: no "data" exported`);
        continue;
    }
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(config.token);

(async () => {
    try {
        console.log('Rimuovo tutti i comandi globali...');
        await rest.put(
            Routes.applicationCommands('1474104261464817746'), // ID del bot
            { body: [] } // corpo vuoto = cancella tutti i comandi
        );
        console.log('Tutti i comandi globali rimossi.');
    } catch (error) {
        console.error(error);
    }
})();

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(
    Routes.applicationGuildCommands('1474104261464817746', '1465340688706306324'),
    { body: commands }
);
        console.log('Successfully reloaded application (/) commands.');
        console.log('Comandi registrati:');
        commands.forEach(cmd => {
        console.log(`- ${cmd.name} (autocomplete: ${cmd.options?.some(o => o.autocomplete) || false})`);
});
    } catch (error) {
        console.error(error);
    }
})();