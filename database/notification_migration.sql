-- =====================================================
-- Migration: Bảng notifications cho Notification System
-- =====================================================

CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Index: lọc theo user + trạng thái đọc
CREATE INDEX idx_notif_user_read ON notifications(user_id, is_read);

-- Index: lọc theo user + thời gian
CREATE INDEX idx_notif_user_date ON notifications(user_id, created_at);
