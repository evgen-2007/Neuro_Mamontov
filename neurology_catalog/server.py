import os
import requests
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
CORS(app)  # Дозволяємо крос-доменні запити з вашого сайту

# --- НАЛАШТУВАННЯ БАЗИ ДАНИХ SQL ---
# Використовуємо SQLite (створить файл neuro_guide.db у папці проєкту, без зайвих налаштувань MySQL)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///neuro_guide.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# --- МОДЕЛЬ ДЛЯ ЗБЕРЕЖЕННЯ ПОВІДОМЛЕНЬ У SQL ---
class ReportMessage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(150), nullable=False)
    message = db.Column(db.Text, nullable=False)
    date = db.Column(db.String(50))

# --- НАЛАШТУВАННЯ TELEGRAM БОТА (для сповіщень) ---
TELEGRAM_BOT_TOKEN = '8676456518:AAH6roQ2sLCQlrEWrEt7OuuKDxIRUXxUWgY'  # Ваш токен від @BotFather
YOUR_TELEGRAM_CHAT_ID = '7715584230'  # Ваш числовий ID в Telegram


def send_telegram_notification(name, email, message):
    """Відправляє сповіщення про проблему прямо вам у Telegram-бот"""
    if not TELEGRAM_BOT_TOKEN or TELEGRAM_BOT_TOKEN == 'YOUR_TELEGRAM_BOT_TOKEN':
        print('[DEV MODE] Telegram токен не налаштовано. Сповіщення виведено в консоль:')
        print(f"Ім'я: {name} | Email: {email} | Повідомлення: {message}")
        return

    telegram_url = f'https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage'
    
    text = (
        f'🚨 <b>Новий звіт про помилку або пропозицію!</b>\n\n'
        f"👤 <b>Ім'я:</b> {name}\n"
        f'📧 <b>Email:</b> {email}\n'
        f'💬 <b>Повідомлення:</b> {message}'
    )

    payload = {
        'chat_id': YOUR_TELEGRAM_CHAT_ID,
        'text': text,
        'parse_mode': 'HTML',
    }

    try:
        response = requests.post(telegram_url, json=payload, timeout=5)
        if not response.ok:
            print(f'Помилка відправки в Telegram: {response.text}')
        else:
            print('Сповіщення успішно надіслано в Telegram!')
    except Exception as e:
        print(f'Виняток під час надсилання запиту в Telegram: {e}')


@app.route('/api/report', methods=['POST'])
def handle_report():
    data = request.get_json()

    if not data:
        return jsonify({'status': 'error', 'message': 'Порожні дані'}), 400

    name = data.get('name', 'Анонім')
    email = data.get('email', 'Не вказано')
    message = data.get('message', '')
    date = data.get('date', '')

    print(f"Отримано повідомлення від {name} ({email}) [Дата: {date}]: {message}")

    # ЗАХИСТ ТА ЗБЕРЕЖЕННЯ В SQL БАЗУ ДАНИХ (з Fallback-режимом)
    try:
        new_report = ReportMessage(name=name, email=email, message=message, date=date)
        db.session.add(new_report)
        db.session.commit()
        print("Повідомлення успішно збережено в SQL базі даних!")
    except Exception as db_error:
        print(f"[УВАГА] Помилка SQL бази даних: {db_error}. Зберігаємо в резервний файл.")
        try:
            with open('fallback_reports.log', 'a', encoding='utf-8') as f:
                f.write(f"DATE: {date} | NAME: {name} | EMAIL: {email} | MSG: {message}\n")
        except Exception as file_error:
            print(f"[КРИТИЧНО] Не вдалося зберегти навіть у файл: {file_error}")

    # Відправляємо сповіщення вам у Telegram
    send_telegram_notification(name, email, message)

    # Повертаємо клієнту успішну відповідь
    return (
        jsonify({
            'status': 'success',
            'message': 'Повідомлення успішно отримано сервером та збережено!',
        }),
        200,
    )


if __name__ == '__main__':
    # Автоматично створюємо файл/таблицю БД при запуску
    with app.app_context():
        db.create_all()
        print("База даних SQL успішно ініціалізована.")

    # Запускаємо локальний сервер на порту 5000
    print('Запуск серверної частини для НейроДовідника...')
    app.run(host='127.0.0.1', port=5000, debug=True)
