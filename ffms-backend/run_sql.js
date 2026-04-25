require('dotenv').config();
const db = require('./src/config/db');
const fs = require('fs');
const path = require('path');

async function runSQL() {
    try {
        const sql = fs.readFileSync(path.join(__dirname, 'fix_database.sql'), 'utf-8');
        
        // Split by semi-colon to execute multiple statements.
        // Wait, 'DELIMITER $$' and Stored Procedure makes simple splitting unreliable because mysql2 driver doesn't support multiple statements natively unless connection flag `multipleStatements: true` is set.
        // We might need to connect with `multipleStatements: true`.
        
        // Let's manually run the steps since creating a procedure in Node.js mysql2 can be tricky if not parsed correctly.
        // Step 0: Fix households schema
        console.log("Fixing households schema...");
        try {
            await db.execute("ALTER TABLE households CHANGE COLUMN user_id owner_id INT DEFAULT NULL");
        } catch(e) {}
        try {
            await db.execute("ALTER TABLE households ADD COLUMN description VARCHAR(255) DEFAULT NULL");
        } catch(e) {}

        // Step 1: Add user column
        console.log("Adding household_id column to users...");
        try {
            await db.execute("ALTER TABLE users ADD COLUMN household_id INT DEFAULT NULL;");
        } catch (e) {
            console.log("Column may already exist:", e.message);
        }

        // Step 2: Fetch orphan users
        console.log("Fetching orphan users...");
        const [orphans] = await db.execute("SELECT id, name FROM users WHERE household_id IS NULL;");
        
        for (const user of orphans) {
            console.log(`Fixing orphan user: ${user.name} (id: ${user.id})`);
            
            // Check if they are owner of any household
            const [ownerRecords] = await db.execute("SELECT MAX(household_id) as new_h_id FROM household_members WHERE user_id = ? AND role = 'owner'", [user.id]);
            let new_h_id = ownerRecords[0].new_h_id;

            if (!new_h_id) {
                // Check if they are member of any household
                const [memberRecords] = await db.execute("SELECT MAX(household_id) as new_h_id FROM household_members WHERE user_id = ?", [user.id]);
                new_h_id = memberRecords[0].new_h_id;
            }

            if (!new_h_id) {
                console.log(`User ${user.id} has no household. Creating one...`);
                // Create household
                const [result] = await db.execute(
                    "INSERT INTO households (name, description, owner_id) VALUES (?, ?, ?)",
                    [`${user.name}'s Personal Finance`, 'Default personal household', user.id]
                );
                new_h_id = result.insertId;

                // Add to household_members
                await db.execute(
                    "INSERT INTO household_members (household_id, user_id, role) VALUES (?, ?, 'owner')",
                    [new_h_id, user.id]
                );
            }

            // Update user
            await db.execute("UPDATE users SET household_id = ? WHERE id = ?", [new_h_id, user.id]);
        }

        // Step 3: Add foreign key
        console.log("Adding foreign key constraint...");
        try {
            await db.execute("ALTER TABLE users ADD CONSTRAINT fk_user_primary_household FOREIGN KEY (household_id) REFERENCES households(id) ON DELETE SET NULL;");
        } catch (e) {
            console.log("Foreign key may already exist/fail:", e.message);
        }

        console.log("Database fixed successfully!");
        process.exit(0);

    } catch (err) {
        console.error("Error running fix:", err);
        process.exit(1);
    }
}

runSQL();
