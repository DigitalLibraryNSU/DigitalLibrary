FROM python:3.12-slim

# Устанавливаем рабочую директорию в контейнере
WORKDIR /app

# Копируем только зависимости в контейнер
COPY requirements.txt /app/

# Устанавливаем зависимости
RUN pip install --no-cache-dir -r requirements.txt
# Открываем порт 8000 для Django-сервера
EXPOSE 8000

# Команда для запуска сервера
#CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
CMD ["gunicorn", "digitalLibraryBackend.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "1"]
