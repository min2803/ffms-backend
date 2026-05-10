require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });
const db = require('../../config/db');

async function run() {
    try {
        await db.execute("UPDATE categories SET name = 'Tiền điện' WHERE id = 2");
        await db.execute("UPDATE categories SET name = 'Lương' WHERE id = 3");
        await db.execute("UPDATE categories SET name = 'Di chuyển' WHERE id IN (4, 12, 20)");
        await db.execute("UPDATE categories SET name = 'Học phí' WHERE id = 5");
        await db.execute("UPDATE categories SET name = 'Mua sắm' WHERE id IN (6, 14, 22)");
        await db.execute("UPDATE categories SET name = 'Thưởng' WHERE id IN (7, 18, 26)");
        await db.execute("UPDATE categories SET name = 'Giải trí' WHERE id IN (9, 15, 23)");
        await db.execute("UPDATE categories SET name = 'Y tế' WHERE id = 10");
        await db.execute("UPDATE categories SET name = 'Ăn uống' WHERE id IN (1, 11, 19)");
        await db.execute("UPDATE categories SET name = 'Nhà ở' WHERE id IN (13, 21)");
        await db.execute("UPDATE categories SET name = 'Sức khỏe' WHERE id IN (16, 24)");
        await db.execute("UPDATE categories SET name = 'Tiền lương' WHERE id IN (17, 25)");

        await db.execute("UPDATE households SET name = 'Gia đình Nguyễn' WHERE id = 1");
        await db.execute("UPDATE households SET name = 'Gia đình Trần' WHERE id = 2");
        await db.execute("UPDATE households SET name = 'Gia đình Lê' WHERE id = 3");
        await db.execute("UPDATE households SET name = 'Gia đình Phạm' WHERE id = 4");
        await db.execute("UPDATE households SET name = 'Gia đình Hoàng' WHERE id = 5");
        await db.execute("UPDATE households SET name = 'Gia đình Vũ' WHERE id = 6");
        await db.execute("UPDATE households SET name = 'Gia đình Đặng' WHERE id = 7");
        await db.execute("UPDATE households SET name = 'Gia đình Bùi' WHERE id = 8");
        await db.execute("UPDATE households SET name = 'Gia đình Đỗ' WHERE id = 9");
        await db.execute("UPDATE households SET name = 'Gia đình Hồ' WHERE id = 10");
        await db.execute("UPDATE households SET description = 'Đây là không gian quản lý tài chính cá nhân mặc định của bạn.' WHERE id = 13");

        console.log('Done!');
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}

run();
