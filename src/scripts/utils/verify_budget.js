require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });
const db = require('../../config/db');

async function verify() {
    // Check UNIQUE constraint
    const [indexes] = await db.execute("SHOW INDEX FROM budgets WHERE Key_name = 'uq_budget_household_cat_month_year'");
    console.log("UNIQUE constraint:", indexes.length > 0 ? "EXISTS ✓" : "MISSING ✗");

    // Check created_at column
    const [cols] = await db.execute("DESCRIBE budgets");
    const hasCreatedAt = cols.some(c => c.Field === "created_at");
    console.log("created_at column:", hasCreatedAt ? "EXISTS ✓" : "MISSING ✗");

    // Check data integrity
    const [budgets] = await db.execute("SELECT COUNT(*) as cnt FROM budgets");
    console.log("Total budgets:", budgets[0].cnt);

    process.exit(0);
}
verify().catch(e => { console.error(e.message); process.exit(1); });
