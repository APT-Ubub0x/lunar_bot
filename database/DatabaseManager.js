const mysql = require('mysql2/promise');
const config = require('../config');

class DatabaseManager {

    constructor() {

        this.pool = mysql.createPool({
            host: config.database.host,
            port: config.database.port,
            user: config.database.user,
            password: config.database.password,
            database: config.database.name,
            waitForConnections: true,
            connectionLimit: config.database.connectionLimit,
            queueLimit: 0
        });

        console.log('[Database] Pool MySQL inizializzato.');
    }

    async getPendingCode(code) {
        const [rows] = await this.pool.execute(
            `SELECT * FROM discord_link_pending 
             WHERE code = ? 
             AND created_at > NOW() - INTERVAL 5 MINUTE`,
            [code]
        );

        return rows[0] || null;
    }

    async isMinecraftAlreadyLinked(uuid) {
        const [rows] = await this.pool.execute(
            `SELECT discord_id FROM players WHERE uuid = ?`,
            [uuid]
        );

        if (!rows[0]) return false;
        return rows[0].discord_id !== null;
    }

    async isDiscordAlreadyLinked(discordId) {
        const [rows] = await this.pool.execute(
            `SELECT uuid FROM players WHERE discord_id = ?`,
            [discordId]
        );

        return rows.length > 0;
    }

    async linkAccount(uuid, discordId, discordUsername) {
        //console.log("DEBUG linkAccount", { uuid, discordId, discordUsername });
        await this.pool.execute(
            `UPDATE players 
             SET discord_id = ?, 
                 discord_username = ?, 
                 discord_linked_at = NOW()
             WHERE uuid = ?`,
            [discordId, discordUsername, uuid]
    );
}

    async deletePendingCode(code) {
        await this.pool.execute(
            `DELETE FROM discord_link_pending WHERE code = ?`,
            [code]
        );
    }
}

module.exports = new DatabaseManager();