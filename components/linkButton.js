const { ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

module.exports = function createLinkButtons() {

    // Bottone per inserire il codice
    const linkButton = new ButtonBuilder()
        .setCustomId('open_link_modal')
        .setLabel('Inserisci Codice')
        .setEmoji('🔑')
        .setStyle(ButtonStyle.Primary);

    // Bottone per richiedere aiuto
    const helpButton = new ButtonBuilder()
        .setLabel('Ho bisogno di aiuto')
        .setStyle(ButtonStyle.Success) // verde, usa ButtonStyle.Secondary se vuoi giallo
        .setEmoji('🎫') // icona ticket
        //.setURL('https://discord.com/channels/@me/1465347309909970995') // link al canale
        .setDisabled(false)
        .setCustomId('help_button'); // opzionale, solo se vuoi gestire interazione (non necessario se apri link)

    return new ActionRowBuilder().addComponents(linkButton, helpButton);
};