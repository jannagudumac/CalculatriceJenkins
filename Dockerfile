FROM selenium/standalone-chrome:latest

USER root
RUN apt-get update && apt-get install -y curl gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app
COPY . .

# Installer selenium-webdriver + http-server
RUN npm install selenium-webdriver http-server --save-dev

EXPOSE 8080

# Démarrer serveur statique + attendre + lancer tests
CMD ["sh", "-c", "npx http-server -p 8080 & npx wait-on http://localhost:8080 && node test_calculatrice.js"]

