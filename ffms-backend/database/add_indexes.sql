-- =====================================================
-- Migration: Indexes cho Dashboard & Reports
-- Tối ưu query BETWEEN date, GROUP BY category
-- =====================================================

-- Index cho incomes: tìm kiếm theo household + khoảng thời gian
CREATE INDEX idx_incomes_household_date ON incomes(household_id, income_date);

-- Index cho expenses: tìm kiếm theo household + khoảng thời gian
CREATE INDEX idx_expenses_household_date ON expenses(household_id, expense_date);

-- Index cho expenses: GROUP BY category
CREATE INDEX idx_expenses_category ON expenses(category_id);
