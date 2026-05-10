/**
 * Migration: Add UNIQUE constraint and created_at to budgets table
 * Run: node migrate_budget_unique.js
 */
require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });
const db = require('../../config/db');

async function migrate() {
    console.log("=== Budget Table Migration ===\n");

    // 1. Check if created_at column exists
    const [cols] = await db.execute("DESCRIBE budgets");
    const hasCreatedAt = cols.some(c => c.Field === "created_at");

    if (!hasCreatedAt) {
        console.log("Adding created_at column...");
        await db.execute(
            "ALTER TABLE budgets ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
        );
        console.log("✓ created_at column added");
    } else {
        console.log("✓ created_at column already exists");
    }

    // 2. Check if UNIQUE constraint already exists
    const [indexes] = await db.execute("SHOW INDEX FROM budgets WHERE Key_name = 'uq_budget_household_cat_month_year'");
    if (indexes.length === 0) {
        // Check for duplicate data first
        const [dupes] = await db.execute(
            `SELECT household_id, category_id, month, year, COUNT(*) as cnt
             FROM budgets
             GROUP BY household_id, category_id, month, year
             HAVING cnt > 1`
        );

        if (dupes.length > 0) {
            console.log("⚠ Found duplicate budget entries, cleaning up (keeping latest)...");
            for (const dupe of dupes) {
                // Keep the one with the highest ID, delete others
                await db.execute(
                    `DELETE b1 FROM budgets b1
                     INNER JOIN budgets b2
                     WHERE b1.household_id = b2.household_id
                       AND b1.category_id = b2.category_id
                       AND b1.month = b2.month
                       AND b1.year = b2.year
                       AND b1.id < b2.id`
                );
            }
            console.log("✓ Duplicates cleaned");
        }

        console.log("Adding UNIQUE constraint...");
        await db.execute(
            `ALTER TABLE budgets ADD CONSTRAINT uq_budget_household_cat_month_year
             UNIQUE (household_id, category_id, month, year)`
        );
        console.log("✓ UNIQUE constraint added");
    } else {
        console.log("✓ UNIQUE constraint already exists");
    }

    // 3. Show final schema
    const [finalCols] = await db.execute("DESCRIBE budgets");
    console.log("\nFinal schema:");
    finalCols.forEach(c => console.log(`  ${c.Field} ${c.Type} ${c.Null === "YES" ? "NULL" : "NOT NULL"} ${c.Key || ""}`));

    console.log("\n✓ Migration complete!");
    process.exit(0);
}

migrate().catch(err => {
    console.error("Migration failed:", err.message);
    process.exit(1);
});
