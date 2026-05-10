require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });
const db = require('../../config/db');

async function run() {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Get all distinct household_ids
        const [households] = await connection.execute("SELECT id FROM households");
        
        for (const hh of households) {
            const householdId = hh.id;
            
            // Fetch all income categories for this household
            const [categories] = await connection.execute(
                "SELECT * FROM categories WHERE household_id = ? AND type = 'income'", 
                [householdId]
            );
            
            const stdNames = ["Lương", "Đầu tư", "Khác"];
            const standardMap = {}; // name -> id
            
            // First pass: identify existing standard categories
            for (const cat of categories) {
                if (stdNames.includes(cat.name) && !standardMap[cat.name]) {
                    standardMap[cat.name] = cat.id;
                }
            }
            
            // Second pass: create missing standard categories
            for (const stdName of stdNames) {
                if (!standardMap[stdName]) {
                    const [res] = await connection.execute(
                        "INSERT INTO categories (household_id, name, type) VALUES (?, ?, 'income')",
                        [householdId, stdName]
                    );
                    standardMap[stdName] = res.insertId;
                }
            }
            
            // Now we have the standard IDs.
            // Let's process incomes that have category_id = null first.
            // Map based on source or description
            const [incomesNull] = await connection.execute(
                "SELECT id, source, description FROM incomes WHERE household_id = ? AND category_id IS NULL",
                [householdId]
            );
            
            for (const inc of incomesNull) {
                const searchStr = `${inc.source || ''} ${inc.description || ''}`.toLowerCase();
                let targetId = standardMap["Khác"];
                
                if (searchStr.match(/lương|salary|thu nhập tháng|tiền lương/)) {
                    targetId = standardMap["Lương"];
                } else if (searchStr.match(/đầu tư|investment|lãi|cổ tức|thưởng/)) {
                    targetId = standardMap["Đầu tư"];
                }
                
                await connection.execute(
                    "UPDATE incomes SET category_id = ? WHERE id = ?",
                    [targetId, inc.id]
                );
            }
            
            // Now handle non-standard categories
            for (const cat of categories) {
                // If this category is exactly one of the standard IDs we kept, leave it.
                if (Object.values(standardMap).includes(cat.id)) {
                    continue;
                }
                
                // Otherwise, map its name
                const searchStr = cat.name.toLowerCase();
                let targetId = standardMap["Khác"];
                if (searchStr.match(/lương|salary|thu nhập tháng|tiền lương/)) {
                    targetId = standardMap["Lương"];
                } else if (searchStr.match(/đầu tư|investment|lãi|cổ tức|thưởng/)) {
                    targetId = standardMap["Đầu tư"];
                }
                
                // Update any incomes pointing to this redundant category
                await connection.execute(
                    "UPDATE incomes SET category_id = ? WHERE category_id = ?",
                    [targetId, cat.id]
                );
                
                // Delete the redundant category
                await connection.execute(
                    "DELETE FROM categories WHERE id = ?",
                    [cat.id]
                );
            }
        }
        
        await connection.commit();
        console.log("Migration successful!");
    } catch (err) {
        await connection.rollback();
        console.error("Migration failed:", err);
    } finally {
        connection.release();
        process.exit();
    }
}

run();
