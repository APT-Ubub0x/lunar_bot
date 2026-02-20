const createLinkModal = require('../components/linkModal');

module.exports = async function handleButton(interaction) {

    if (interaction.customId === 'open_link_modal') {
        const modal = createLinkModal();
        await interaction.showModal(modal);
    } else if (interaction.customId === 'help_button') {
        await interaction.reply({ content: `Clicca qui per aprire un ticket: <#1465347309909970995>`, ephemeral: true });
    }
};