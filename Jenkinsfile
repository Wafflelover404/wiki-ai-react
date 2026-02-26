pipeline {
  agent any

  environment {
    IMAGE   = "wikiai:latest"
    REPO_DIR = "${WORKSPACE}"
    APP_PORT = "3000"
  }

  options {
    timestamps()
    buildDiscarder(logRotator(numToKeepStr: '10'))
  }

  stages {
    stage('Checkout') {
      steps {
        dir("${REPO_DIR}") {
          checkout scm
        }
      }
    }

    stage('Build Image') {
      steps {
        dir("${REPO_DIR}") {
          sh '''
            set -e
            docker build -t ${IMAGE} .
          '''
        }
      }
    }

    stage('Stop & Remove Old Container') {
      steps {
        sh '''
          set -e || true
          if docker ps -a --format '{{.Names}}' | grep -x wikiai >/dev/null 2>&1; then
            docker rm -f wikiai || true
          fi
        '''
      }
    }

    stage('Run Container') {
      steps {
        sh '''
          set -e
          docker run -d --name wikiai \
            --env-file ${REPO_DIR}/.env \
            -p ${APP_PORT}:${APP_PORT} \
            --restart unless-stopped \
            ${IMAGE}
        '''
      }
    }

    stage('Smoke Check') {
      steps {
        sh '''
          set -e || true
          for i in $(seq 1 30); do
            if docker exec wikiai sh -c "ss -ltn | grep -q ':${APP_PORT}' || netstat -ltn | grep -q ':${APP_PORT}'"; then
              echo "wikiai listening on ${APP_PORT}"
              exit 0
            fi
            sleep 1
          done
          echo "Warning: wikiai did not report listening port ${APP_PORT} in time."
        '''
      }
    }
  }

  post {
    success { echo 'wikiai deployed.' }
    failure { echo 'wikiai deploy failed.' }
  }
}
