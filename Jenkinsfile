pipeline {
    agent any

    stages {
        stage('Cloner le Code') {
            steps {
                git branch: 'main', url: 'https://github.com/jannagudumac/CalculatriceJenkins.git'
            }
        }

        stage('Construire et Tester l\'Image Docker') {
            steps {
                script {
                    // Construire l'image
                    bat "docker build --no-cache -t calculatrice:${env.BUILD_ID} ."

                    // Lancer le container → il démarre http-server + exécute test_calculatrice.js
                    bat "docker run --rm calculatrice:${env.BUILD_ID}"
                }
            }
        }

        stage('Déployer en Production') {
            when {
                expression { currentBuild.result == null || currentBuild.result == 'SUCCESS' }
            }
            steps {
                input message: 'Les tests ont réussi. Voulez-vous déployer en production ?', ok: 'Déployer'
                script {
                    // Supprimer un ancien container prod s’il existe
                    bat 'docker rm -f calculatrice-prod || true'

                    // Lancer l’appli en prod (pas les tests, juste le serveur statique)
                    bat "docker run -d -p 8081:8080 --name calculatrice-prod calculatrice:${env.BUILD_ID} npx http-server -p 8080"
                }
            }
        }
    }
}