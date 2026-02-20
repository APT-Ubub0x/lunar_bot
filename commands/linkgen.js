const createLinkEmbed = require('../components/linkEmbed');
const createLinkButton = require('../components/linkButton');

module.exports = {
    async execute(message) {
        
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.reply("Non hai il permesso di eseguire questo comando.");
        }

        const embed = createLinkEmbed();
        const button = createLinkButton();

        await message.channel.send({
            embeds: [embed],
            components: [button]
        });
    }
};