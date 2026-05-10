require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });
const db = require('../../config/db');
db.execute('SELECT * FROM categories WHERE type="income"').then(([r]) => {
  console.log(r);
  process.exit();
}).catch(err => {
  console.error(err);
  process.exit(1);
});
