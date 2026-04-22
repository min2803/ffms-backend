require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function migrate() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        multipleStatements: true
    });

    try {
        console.log('Bắt đầu migration...');
        const sql = fs.readFileSync(path.join(__dirname, 'database', 'full_system_init.sql'), 'utf8');
        await connection.query(sql);
        console.log('Migration hoàn tất thành công!');
    } catch (error) {
        console.error('Lỗi khi migration:', error);
    } finally {
        await connection.end();
    }
}

migrate();
