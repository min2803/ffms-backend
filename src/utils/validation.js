function isValidDate(dateStr) {
    if (!dateStr) return false;
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateStr)) return false;
    const date = new Date(dateStr);
    return !isNaN(date.getTime());
}

function getMonthDateRange(month, year) {
    const m = parseInt(month);
    const y = parseInt(year);

    if (isNaN(m) || isNaN(y) || m < 1 || m > 12 || y < 1900 || y > 2100) {
        return null;
    }

    const fromDate = `${y}-${String(m).padStart(2, "0")}-01`;
    const lastDay = new Date(y, m, 0).getDate();
    const toDate = `${y}-${String(m).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

    return { fromDate, toDate };
}

function getDefaultDateRange() {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth() + 1;
    const fromDate = `${y}-${String(m).padStart(2, "0")}-01`;
    const lastDay = new Date(y, m, 0).getDate();
    const toDate = `${y}-${String(m).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
    return { fromDate, toDate };
}

function resolveDateRange(fromDate, toDate) {
    if (!fromDate && !toDate) {
        return getDefaultDateRange();
    }

    if (!isValidDate(fromDate) || !isValidDate(toDate)) {
        throw { status: 400, message: "fromDate and toDate are required in YYYY-MM-DD format" };
    }

    if (fromDate > toDate) {
        throw { status: 400, message: "fromDate must be before or equal to toDate" };
    }

    return { fromDate, toDate };
}

module.exports = { isValidDate, getMonthDateRange, getDefaultDateRange, resolveDateRange };
