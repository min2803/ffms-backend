require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });
const db = require('../../config/db');
db.execute('SELECT id, amount, source, category_id, description FROM incomes LIMIT 10').then(([r]) => {
  console.log(r);
  process.exit();
}).catch(err => {
  console.error(err);
  process.exit(1);
});
