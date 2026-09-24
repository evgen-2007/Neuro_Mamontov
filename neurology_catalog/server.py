import os
import requests
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Дозволяємо крос-доменні запити з вашого сайту

# --- НАЛАШТУВАННЯ TELEGRAM БОТА (для сповіщень) ---
TELEGRAM_BOT_TOKEN = '8676456518:AAH6roQ2sLCQlrEWrEt7OuuKDxIRUXxUWgY'  # Ваш токен від @BotFather
YOUR_TELEGRAM_CHAT_ID = '7715584230'  # Ваш числовий ID в Telegram


def send_telegram_notification(name, email, message):
  """Відправляє сповіщення про проблему прямо вам у Telegram-бот"""
  if not TELEGRAM_BOT_TOKEN or TELEGRAM_BOT_TOKEN == 'YOUR_TELEGRAM_BOT_TOKEN':
    print(
        '[DEV MODE] Telegram токен не налаштовано. Сповіщення виведено в'
        ' консоль:'
    )
    print(f"Ім'я: {name} | Email: {email} | Повідомлення: {message}")
    return

  # Виправляємо URL через використання змінної токена замість вставки всередину з двокрапкою
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
    response = requests.post(telegram_url, json=payload)
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

  print(
      f"Отримано повідомлення від {name} ({email}) [Дата: {date}]: {message}"
  )

  # Відправляємо сповіщення вам у Telegram
  send_telegram_notification(name, email, message)

  # Повертаємо клієнту успішну відповідь
  return (
      jsonify({
          'status': 'success',
          'message': 'Повідомлення успішно отримано сервером!',
      }),
      200,
  )


if __name__ == '__main__':
  # Запускаємо локальний сервер на порту 5000
  print('Запуск серверної частини для НейроДовідника...')
  app.run(host='127.0.0.1', port=5000, debug=True)