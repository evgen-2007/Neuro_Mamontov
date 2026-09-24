-- Створення бази даних, якщо вона ще не створена
CREATE DATABASE IF NOT EXISTS neuro_guide CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE neuro_guide;

-- Таблиця для надійного зберігання повідомлень із розділу «Контакти»
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    subject VARCHAR(255) DEFAULT 'Звернення з сайту',
    message TEXT NOT NULL,
    status ENUM('pending', 'processed', 'spam') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Індекс для прискорення сортування/пошуку за статусом
CREATE INDEX idx_contact_status ON contact_messages(status);