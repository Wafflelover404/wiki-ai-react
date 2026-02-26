// Jenkinsfile (Frontend - wiki-ai-react)
pipeline {
    agent any

    environment {
        IMAGE_NAME     = 'wikiai-frontend'
        IMAGE_TAG      = 'latest'
        CONTAINER_NAME = 'frontend'
        HOST_PORT      = '3000'
        CONTAINER_PORT = '3000'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "Building ${IMAGE_NAME}:${IMAGE_TAG} ..."
                sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
            }
        }

        stage('Stop & Remove Old Container') {
            steps {
                echo "Stopping and removing old container '${CONTAINER_NAME}' if it exists..."
                sh """
                    docker stop ${CONTAINER_NAME} || true
                    docker rm   ${CONTAINER_NAME} || true
                """
            }
        }

        stage('Run New Container') {
            steps {
                echo "Starting new container '${CONTAINER_NAME}' on port ${HOST_PORT}..."
                sh """
                    docker run -d \
                        --name ${CONTAINER_NAME} \
                        -p ${HOST_PORT}:${CONTAINER_PORT} \
                        --restart unless-stopped \
                        ${IMAGE_NAME}:${IMAGE_TAG}
                """
            }
        }

        stage('Healthcheck') {
            steps {
                echo 'Waiting for container to become healthy...'
                sh """
                    sleep 5
                    docker ps --filter "name=${CONTAINER_NAME}" --filter "status=running" | grep ${CONTAINER_NAME}
                """
            }
        }

        stage('Cleanup Dangling Images') {
            steps {
                echo 'Removing dangling/unused images...'
                sh 'docker image prune -f || true'
            }
        }
    }

    post {
        success {
            echo "✅ Frontend deployed successfully on port ${HOST_PORT}"
        }
        failure {
            echo "❌ Frontend deployment failed — check logs"
            sh "docker logs ${CONTAINER_NAME} || true"
        }
    }
}
