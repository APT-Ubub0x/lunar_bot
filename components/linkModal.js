const { ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } = require('discord.js');

module.exports = function createLinkModal() {

    const modal = new ModalBuilder()
        .setCustomId('link_modal')
        .setTitle('Collega Account Minecraft');

    const codeInput = new TextInputBuilder()
        .setCustomId('minecraft_code')
        .setLabel('Inserisci il codice (6 caratteri)')
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setMinLength(6)
        .setMaxLength(6)
        .setPlaceholder('K9X4P2');

    const row = new ActionRowBuilder().addComponents(codeInput);
    modal.addComponents(row);

    return modal;
};