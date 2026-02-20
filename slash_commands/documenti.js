const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const mysql = require('mysql2/promise');
const config = require('../config');

// Creo la pool all'avvio e la riutilizzo
const dbPool = mysql.createPool({
    host: config.database.host,
    port: config.database.port,
    user: config.database.user,
    password: config.database.password,
    database: config.database.name,
    connectionLimit: config.database.connectionLimit
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName('documenti')
        .setDescription('Mostra le informazioni di un player')
        .addStringOption(option =>
            option.setName('player')
                  .setDescription('Nome del player Minecraft')
                  .setRequired(true)
                  .setAutocomplete(true)
        ),

    async autocomplete(interaction) {
        //console.log('[DEBUG] autocomplete chiamata');
        const focusedValue = interaction.options.getFocused(); // valore digitato dall'utente
        //console.log('[DEBUG] valore digitato:', focusedValue);

        try {
            const [rows] = await dbPool.query(
                'SELECT player FROM players WHERE player LIKE ? LIMIT 25',
                [`%${focusedValue}%`]
            );

            //console.log('[DEBUG] risultati query autocomplete:', rows);

            // Creo la lista di choices come stringhe, max 25 elementi
            const choices = rows.slice(0, 25).map(row => ({
                name: row.player.toString(), // deve essere stringa
                value: row.player.toString() // deve essere stringa
            }));

            //console.log('[DEBUG] choices formattati:', choices);

         await interaction.respond(choices);

        } catch (error) {
            console.error('[ERROR] autocomplete query:', error);
            await interaction.respond([]);
        }
    },


    async execute(interaction) {
        const playerName = interaction.options.getString('player');

        try {
            const [rows] = await dbPool.query(
                'SELECT * FROM players WHERE player = ?',
                [playerName]
            );

            if (!rows.length) {
                return interaction.reply({ content: `Nessun player trovato con il nome ${playerName}`, ephemeral: true });
            }

            const player = rows[0];

            const embed = new EmbedBuilder()
                .setTitle(`📄 Documenti di ${player.player}`)
                .setColor(0x00FF00)
                .addFields(
                    { name: 'UUID', value: player.uuid, inline: true },
                    { name: 'Nome', value: player.nome, inline: true },
                    { name: 'Cognome', value: player.cognome, inline: true },
                    { name: 'Età', value: player.eta.toString(), inline: true },
                    { name: 'Sesso', value: player.sesso, inline: true },
                    { name: 'Saldo', value: player.saldo.toString(), inline: true },
                    { name: 'Numero Carta', value: player.numero_carta, inline: true },
                    { name: 'CVV', value: player.cvv, inline: true },
                    { name: 'PIN Carta', value: player.pin_carta, inline: true },
                    { name: 'Phone Number', value: player.phone_number || 'N/A', inline: true },
                    { name: 'First Join', value: player.first_join.toString(), inline: true },
                    { name: 'Last Join', value: player.last_join ? player.last_join.toString() : 'N/A', inline: true },
                    { name: 'Last Exit', value: player.last_exit ? player.last_exit.toString() : 'N/A', inline: true },
                    { name: 'Discord ID', value: player.discord_id || 'N/A', inline: true },
                    { name: 'Discord Username', value: player.discord_username || 'N/A', inline: true },
                    { name: 'Discord Linked At', value: player.discord_linked_at ? player.discord_linked_at.toString() : 'N/A', inline: true }
                );

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Errore execute:', error);
            interaction.reply({ content: 'Errore durante il recupero dei dati.', ephemeral: true });
        }
    }
};