-- =====================================================
-- Migration: Bảng system_logs cho Admin API
-- =====================================================

CREATE TABLE IF NOT EXISTS system_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    level ENUM('info', 'warn', 'error') DEFAULT 'info',
    message TEXT NOT NULL,
    source VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index cho logs: filter by level + date
CREATE INDEX idx_logs_level_date ON system_logs(level, created_at);
