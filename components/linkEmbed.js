const { EmbedBuilder } = require('discord.js');

module.exports = function createLinkEmbed() {

    return new EmbedBuilder()
        .setTitle('Collega il tuo account Minecraft')
        .setDescription(
            "Per collegare il tuo account Minecraft al server Discord:\n\n" +
            "1️⃣ Apri Minecraft e connettiti a `play.lunarrp.it`\n" +
            "2️⃣ Esegui il comando `/link`\n" +
            "3️⃣ Segui le istruzioni che appariranno in gioco per completare la procedura\n\n" +
            "Dopo aver completato questi passaggi, premi il bottone qui sotto per inserire il codice generato in gioco."
        )
        .setColor(0x5865F2);
};