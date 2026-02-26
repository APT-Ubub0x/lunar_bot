const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Elimina un certo numero di messaggi dal canale')
        .addIntegerOption(option =>
            option.setName('quantità')
                  .setDescription('Numero di messaggi da eliminare (max 100)')
                  .setRequired(true)
        ),

    async execute(interaction) {
        const amount = interaction.options.getInteger('quantità');

        // Limite di Discord: max 100 messaggi per bulkDelete
        if (amount < 1 || amount > 100) {
            return interaction.reply({ content: 'Inserisci un numero valido tra 1 e 100.', ephemeral: true });
        }

        try {
            // Elimina i messaggi
            const deletedMessages = await interaction.channel.bulkDelete(amount, true);

            const embed = new EmbedBuilder()
                .setTitle('🧹 Pulizia completata')
                .setDescription(`Sono stati eliminati **${deletedMessages.size}** messaggi.`)
                .setColor(0x9B78F2)
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });

        } catch (error) {
            console.error('Errore clear command:', error);
            await interaction.reply({ content: 'Non è stato possibile eliminare i messaggi. Assicurati che io abbia i permessi necessari.', ephemeral: true });
        }
    }
};