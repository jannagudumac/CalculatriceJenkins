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
CMD ["sh", "-c", "npx http-server -p 8080 & sleep 5 && node test_calculatrice.js"]








## Use Selenium standalone Chrome as base image
#FROM selenium/standalone-chrome:latest

## Switch to root user
#USER root

## Install Node.js 18.x
#RUN apt-get update && apt-get install -y curl gnupg \
#    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
#    && apt-get install -y nodejs \
#    && apt-get clean && rm -rf /var/lib/apt/lists/*

## Set working directory
#WORKDIR /app

## Copy application files and tests
#COPY . .

## Install selenium-webdriver and http-server
#RUN npm install selenium-webdriver http-server

## Expose web server port
#EXPOSE 8081

## Create startup script
#RUN echo '#!/bin/sh\n\
## Start the web server in background\n\
#npx http-server -p 8080 &\n\
## Wait 2 seconds for server to start\n\
#sleep 2\n\
## Run the Selenium test script\n\
#node test_calculatrice.js' > /app/run.sh \
#    && chmod +x /app/run.sh

## Set the entrypoint
#ENTRYPOINT ["/app/run.sh"] 

