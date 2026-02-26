pipeline {
  agent any
  environment {
    WORKDIR = "${env.WORKSPACE}"
    SERVICE = "wiki-frontend.service"
    NODE_ENV = "production"
  }
  stages {
    stage('Checkout') {
      steps { checkout scm }
    }
    stage('Install') {
      steps {
        dir("${WORKDIR}") {
          sh 'npm ci --no-audit --no-fund'
        }
      }
    }
    stage('Build') {
      steps {
        dir("${WORKDIR}") {
          sh 'npm run build'
        }
      }
    }
    stage('Deploy') {
      steps {
        // If you serve static files with nginx, copy build to site dir here instead of running npm start
        dir("${WORKDIR}") {
          // optional: install pm2 or serve; here we just ensure service restarted
          sh "sudo systemctl restart ${SERVICE}"
        }
      }
    }
    stage('Smoke') {
      steps {
        // basic health check (adjust path/port)
        sh 'sleep 2 || true'
        // e.g., curl --fail http://localhost:3000 || exit 1
      }
    }
  }
  post {
    failure { echo "Frontend pipeline failed" }
    success { echo "Frontend deployed" }
  }
}
