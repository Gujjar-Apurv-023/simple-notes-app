@Library('shared') _

pipeline {
agent any

environment {
TAG = "${sh(script: 'git rev-parse --short=10 HEAD', returnStdout: true).trim()}"
SONAR_HOME = tool "sonar"
IMAGE_NAME = "us-central1-docker.pkg.dev/project-3fb9dc72-feba-49ea-b89/devops-repo/simple-notes-app"
RELEASE_NAME = "notes-app"
NAMESPACE = "dev"
CHART_PATH = "./helm/notes-app-chart"
VALUES_FILE = "./helm/notes-app-chart/values.yaml"
}

stages {

// ==================================================
// 🧹 CLEAN WORKSPACE
// ==================================================

stage('Clean Workspace') {
    steps {
        cleanWs()
    }
}

// ==================================================
// 🔄 CHECKOUT CODE
// ==================================================

stage('Checkout Code') {
    steps {
        checkout scm
    }
}

// ==================================================
// 🔐 AUTHENTICATE GCP & GKE 
// ==================================================

stage('Authenticate GCP & Connect GKE') {
    steps {
        withCredentials([file(credentialsId: 'gcp-artifact-key', variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
            sh '''
            gcloud auth activate-service-account --key-file=$GOOGLE_APPLICATION_CREDENTIALS
            gcloud auth configure-docker us-central1-docker.pkg.dev --quiet
            '''
        }
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
        docker build -t ${IMAGE_NAME}:${TAG} -t ${IMAGE_NAME}:${TAG} .
        docker push ${IMAGE_NAME}:${TAG}
        """
    }
}

// ==================================================
// 🚀 HELM DEPLOY USING SHARED LIBRARY 
// ==================================================

stage('Helm Deploy') {
    steps {
        script {
            helmDeploy(
                releaseName: "${RELEASE_NAME}",
                chartPath: "${CHART_PATH}",
                namespace: "${NAMESPACE}",
                valuesFile: "${VALUES_FILE}",
                tag: "${TAG}"
            )
        }
    }
}

}
}

