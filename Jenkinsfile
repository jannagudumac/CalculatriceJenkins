pipeline {
    // ---------------------------
    // Определяем агент Jenkins
    // ---------------------------
    // 'any' означает, что сборка может выполняться на любом доступном агенте Jenkins
    // ⚠️ Важно: так как дальше используются команды Windows (bat), агент должен быть Windows
    agent any

    stages {
        // ---------------------------
        // Этап 1: Клонирование кода из Git
        // ---------------------------
        stage('Cloner le Code') {
            steps {
                // Шаг git скачивает репозиторий
                // branch: 'main' → выбираем ветку main
                // url: 'https://github.com/jannagudumac/CalculatriceJenkins.git' → адрес репозитория
                git branch: 'main', url: 'https://github.com/jannagudumac/CalculatriceJenkins.git'
            }
        }

        // ---------------------------
        // Этап 2: Сборка Docker-образа и запуск тестов
        // ---------------------------
        stage('Construire et Tester l\'Image Docker') {
            steps {
                script {
                    // ---------------------------
                    // 2.1. Сборка Docker-образа
                    // ---------------------------
                    // docker build → строим образ из Dockerfile в текущей папке
                    // --no-cache → пересобираем полностью без использования кэша (чистая сборка)
                    // -t calculatrice:${env.BUILD_ID} → тегируем образ именем calculatrice и номером сборки Jenkins
                    bat "docker build --no-cache -t calculatrice:${env.BUILD_ID} ."

                    // ---------------------------
                    // 2.2. Запуск контейнера для тестов
                    // ---------------------------
                    // docker run → запускаем контейнер из только что созданного образа
                    // --rm → контейнер удаляется после завершения (чтобы не оставлять мусор)
                    // В Dockerfile прописано: поднять http-server и запустить тесты test_calculatrice.js
                    bat "docker run --rm calculatrice:${env.BUILD_ID}"
                }
            }
        }

        // ---------------------------
        // Этап 3: Деплой в продакшн (только если тесты успешны)
        // ---------------------------
        stage('Déployer en Production') {
            when {
                // Проверка: если сборка успешна или ещё не определён результат, выполняем деплой
                expression { currentBuild.result == null || currentBuild.result == 'SUCCESS' }
            }
            steps {
                // ---------------------------
                // 3.1. Пауза с ручным подтверждением
                // ---------------------------
                // input → Jenkins останавливается и спрашивает пользователя
                // message → сообщение на кнопке, ok → текст кнопки подтверждения
                input message: 'Les tests ont réussi. Voulez-vous déployer en production ?', ok: 'Déployer'

                script {
                    // ---------------------------
                    // 3.2. Удаляем старый прод-контейнер (если существует)
                    // ---------------------------
                    // docker rm -f calculatrice-prod → принудительно удаляем контейнер с именем calculatrice-prod
                    // || true → на Windows это не работает, лучше заменить на безопасный способ
                    // ⚠️ Если контейнера нет, команда может упасть
                    bat 'docker rm -f calculatrice-prod || true'

                    // ---------------------------
                    // 3.3. Запуск нового продакшн-контейнера
                    // ---------------------------
                    // docker run -d → запускаем в фоне (detached)
                    // -p 8081:8080 → проброс порта: на хосте 8081, внутри контейнера 8080
                    // --name calculatrice-prod → имя контейнера для удобства управления
                    // calculatrice:${env.BUILD_ID} → используем образ текущей сборки
                    // npx http-server -p 8080 → запускаем http-server внутри контейнера, чтобы отдавать статические файлы
                    bat "docker run -d -p 8081:8080 --name calculatrice-prod calculatrice:${env.BUILD_ID} npx http-server -p 8080"
                }
            }
        }
    }
}
