const { EmbedBuilder } = require('discord.js');
const db = require('../database/DatabaseManager');

module.exports = async function handleModal(interaction, client) {

    if (interaction.customId !== 'link_modal') return;

    const code = interaction.fields.getTextInputValue('minecraft_code').toUpperCase();
    const discordId = interaction.user.id;
    const discordUser = await client.users.fetch(discordId);
    const discordUsername = discordUser.tag;

    const roleToRemoveId = '1465342121027436682';
    const roleToAddId = '1474172315955757158';

    try {

        // 1️⃣ Controllo codice valido
        const pending = await db.getPendingCode(code);

        if (!pending) {
            return interaction.reply({
                content: '❌ Codice non valido o scaduto.',
                ephemeral: true
            });
        }

        const uuid = pending.minecraft_uuid;

        // 2️⃣ Controllo se Minecraft già linkato
        const mcLinked = await db.isMinecraftAlreadyLinked(uuid);
        if (mcLinked) {
            return interaction.reply({
                content: '❌ Questo account Minecraft è già collegato.',
                ephemeral: true
            });
        }

        // 3️⃣ Controllo se Discord già linkato
        const dsLinked = await db.isDiscordAlreadyLinked(discordId);
        if (dsLinked) {
            return interaction.reply({
                content: '❌ Il tuo account Discord è già collegato.',
                ephemeral: true
            });
        }

        // 4️⃣ Link definitivo
        await db.linkAccount(uuid, discordId, discordUsername);

        // 5️⃣ Elimina codice pending
        await db.deletePendingCode(code);

        const guild = interaction.guild; // server dove avviene l'interazione
        if (guild) {
            const member = await guild.members.fetch(discordId);
            if (member) {
                if (roleToRemoveId) await member.roles.remove(roleToRemoveId).catch(console.error);
                if (roleToAddId) await member.roles.add(roleToAddId).catch(console.error);
            }
        }

        const successEmbed = new EmbedBuilder()
            .setTitle('✅ Account Collegato')
            .setDescription('Il tuo account Minecraft è stato collegato correttamente.')
            .setColor(0x00FF00);

        await interaction.reply({
            embeds: [successEmbed],
            ephemeral: true
        });

    } catch (err) {
        console.error(err);
        await interaction.reply({
            content: '❌ Errore interno del server.',
            ephemeral: true
        });
    }
};