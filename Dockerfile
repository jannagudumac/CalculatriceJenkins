# Берём готовый образ с Selenium + Chrome (браузер + драйвер для тестов)
FROM selenium/standalone-chrome:latest

# Работаем от root, чтобы устанавливать пакеты
USER root

# Обновляем списки пакетов и ставим необходимые инструменты
RUN apt-get update && apt-get install -y curl gnupg \
    # Скачиваем и настраиваем репозиторий Node.js 18.x
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    # Устанавливаем Node.js
    && apt-get install -y nodejs \
    # Чистим кэш, чтобы образ был легче
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /usr/src/app

# Копируем все файлы проекта в рабочую директорию контейнера
COPY . .

# Устанавливаем библиотеки для тестов и сервера
# selenium-webdriver — для автотестов
# http-server — для запуска локального веб-сервера
RUN npm install selenium-webdriver http-server --save-dev

# Открываем порт 8080, чтобы к приложению можно было подключаться извне
EXPOSE 8080

# CMD — команда, которая выполняется при запуске контейнера
# sh -c — позволяет выполнить несколько команд в одной строке:
# 1) npx http-server -p 8080 & → запускаем статический сервер в фоне
# 2) npx wait-on http://localhost:8080 → ждём, пока сервер станет доступен
# 3) node test_calculatrice.js → запускаем автотесты

# Важно:
# - В Jenkins мы используем этот контейнер для сборки и тестов.
# - Когда тесты успешны, мы можем запустить тот же контейнер в "продакшн-режиме",
#   например через команду:
#   docker run -d -p 8081:8080 --name calculatrice-prod calculatrice:<BUILD_ID> npx http-server -p 8080
# - То есть продакшн-контейнер — это тот же образ, но мы просто не запускаем тесты, а только сервер.
CMD ["sh", "-c", "npx http-server -p 8080 & npx wait-on http://localhost:8080 && node test_calculatrice.js"]
