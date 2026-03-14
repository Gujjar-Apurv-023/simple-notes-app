pipeline {
agent any

environment {
TAG = "${sh(script: 'git rev-parse --short=10 HEAD', returnStdout: true).trim()}"
SONAR_HOME = tool "sonar"
IMAGE_NAME = "us-central1-docker.pkg.dev/project-3fb9dc72-feba-49ea-b89/devops-repo/simple-notes-app"
CONTAINER_NAME = "notes-app"
}

stages {

// ==================================================
// 🔄 CHECKOUT CODE
// ==================================================

stage('Checkout Code') {
    steps {
        checkout scm
    }
}

// ==================================================
// 🔐 GCP AUTHENTICATION
// ==================================================

stage('Authenticate GCP') {
    steps {
        withCredentials([file(credentialsId: 'gcp-artifact-key', variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
            sh 'gcloud auth activate-service-account --key-file=$GOOGLE_APPLICATION_CREDENTIALS'
            sh 'gcloud auth configure-docker us-central1-docker.pkg.dev --quiet'
        }
    }
}

// ==================================================
// ✅ TEST GKE CLUSTER CONNECTION
// ==================================================

stage('Test GKE Cluster') {
    steps {
        sh """
        gcloud container clusters get-credentials project-apurv --region us-west1 --project project-3fb9dc72-feba-49ea-b89
        kubectl get nodes
        """
    }
}

// ==================================================
// 🔎 SONARQUBE SCAN
// ==================================================

stage('SonarQube Scan') {
    steps {
        withSonarQubeEnv('sonar') {
            sh "${SONAR_HOME}/bin/sonar-scanner -Dsonar.projectKey=simple-notes-app"
        }
    }
}

// ==================================================
// 🐳 BUILD & PUSH IMAGE
// ==================================================

stage('Build & Push Image') {
    steps {
        sh """
        docker build -t ${IMAGE_NAME}:${TAG} -t ${IMAGE_NAME}:latest .
        docker push ${IMAGE_NAME}:${TAG}
        """
    }
}

// ==================================================
// 🚀 DEPLOY CONTAINER
// ==================================================

stage('Deploy Container') {
    steps {
        sh """
        docker stop ${CONTAINER_NAME} || true
        docker rm ${CONTAINER_NAME} || true
        docker run -d -p 5000:5000 --name ${CONTAINER_NAME} ${IMAGE_NAME}:${TAG}
        """
    }
}

}
}
