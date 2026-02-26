const { Events } = require('discord.js');

// ID del ruolo da assegnare automaticamente
const ROLE_ID = '1475983423196631151';

module.exports = {
    name: Events.GuildMemberAdd,
    once: false, // evento ricorrente
    async execute(member, client) {
        try {
            const role = member.guild.roles.cache.get(ROLE_ID);
            if (!role) {
                console.error(`Ruolo con ID ${ROLE_ID} non trovato nel server ${member.guild.name}`);
                return;
            }

            await member.roles.add(role);

            const channel = member.guild.systemChannel; // oppure metti l'ID di un canale specifico
            if (channel) {
                channel.send(`Benvenuto ${member.user}! Ti è stato assegnato il ruolo automaticamente.`);
            }

            console.log(`Ruolo assegnato a ${member.user.tag}`);
        } catch (error) {
            console.error(`Errore nell'assegnare ruolo a ${member.user.tag}:`, error);
        }
    }
};