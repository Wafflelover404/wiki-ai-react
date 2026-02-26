pipeline {
  agent any

  environment {
    IMAGE    = "wikiai:latest"
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

    stage('Validate .env') {
      steps {
        dir("${REPO_DIR}") {
          sh '''
            set -e
            if [ ! -f .env ]; then
              echo ".env not found — creating minimal .env"
              cat > .env <<'EOF'
APP_PORT=3000
# Add other variables here as KEY=VALUE
EOF
            fi
            # Fail if any non-comment line does not contain an '=' (invalid for --env-file)
            bad_lines=$(grep -n '^[[:space:]]*[^#[:space:]]' .env | awk -F: '$2 !~ /=/ {print $1":"$2}')
            if [ -n "$bad_lines" ]; then
              echo "Invalid lines in .env (lines without KEY=VALUE):"
              echo "$bad_lines"
              exit 1
            fi
            # Remove any stray CR characters and ensure file is readable only by owner
            sed -i 's/\r$//' .env
            chmod 600 .env || true
          '''
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
        dir("${REPO_DIR}") {
          sh '''
            set -e
            # Ensure .env is properly owned and has no invalid lines (defensive)
            chmod 600 .env || true
            docker run -d --name wikiai \
              --env-file ${REPO_DIR}/.env \
              -p ${APP_PORT}:${APP_PORT} \
              --restart unless-stopped \
              ${IMAGE}
          '''
        }
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
          exit 1
        '''
      }
    }
  }

  post {
    success { echo 'wikiai deployed.' }
    failure { echo 'wikiai deploy failed.' }
  }
}
