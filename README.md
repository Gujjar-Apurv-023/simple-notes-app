# 📝 Simple Notes App – DevOps CI/CD Project

<p align="center">
  <img width="100%" alt="simple-notes-app-demo" src="https://github.com/user-attachments/assets/af9b7755-7682-47be-8947-731d04a60960" />
</p>

---

A full-stack Notes application built with **Node.js**, **Express.js**, and **Vanilla JavaScript**.

This project serves as a comprehensive demonstration of modern DevOps practices, taking an application from local development through a fully automated CI/CD pipeline to a containerized deployment.

### 🌟 Key DevOps Practices Demonstrated

* 🐳 **Docker** Containerization
* 🔄 **Jenkins** CI/CD pipeline automation
* 🔍 **SonarQube** Static Code Analysis
* 📦 **Google Artifact Registry** integration
* 🏷️ **Git Commit SHA based** Docker image versioning

---

## 🏗️ Architecture & Workflow Overview

The following diagrams illustrate the complete flow from code commit to production deployment.

### Detailed Technical Architecture

<p align="center">
  <img width="100%" alt="detailed-technical-architecture" src="https://github.com/user-attachments/assets/b7f8f52e-1048-4426-aba0-2a65871ff6a1" />
</p>

---

## 🧰 Technology Stack

| Component | Technologies |
| :--- | :--- |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Backend** | Node.js, Express.js |
| **DevOps & CI/CD** | Jenkins, Docker, GitHub |
| **Code Quality** | SonarQube |
| **Cloud & Registry**| Google Cloud Platform (GCP), Google Artifact Registry, Google Cloud CLI |

---

## 📂 Project Structure

```text
simple-notes-app
│
├── public/                # Frontend static assets
│   ├── index.html        # Main HTML file
│   ├── styles.css        # Application styles
│   └── script.js         # Frontend logic
│
├── server.js             # Node.js/Express server
├── package.json          # Node.js dependencies and scripts
├── Dockerfile            # Docker image build instructions
└── Jenkinsfile           # Jenkins CI/CD pipeline definition
```
## 📂 SonarQube Setup 

1️⃣ Run SonarQube Container

Usually people run it with Docker:
```bash
docker run -d --name sonarqube -p 9000:9000 sonarqube:lts
```

Then open in browser:
```bash
http://<server-ip>:9000
```
2️⃣ Login with Default Credentials

Default login for SonarQube:
```bash
Username: admin
Password: admin
```

After login, SonarQube will force you to change the password.

3️⃣ Create Webhook (Administration → Webhooks)

Path:
```bash
Administration → Configuration → Webhooks
```
Why Webhook is used

Webhook allows SonarQube to send analysis results to other systems.

**Example integrations:**
```
Jenkins pipeline
GitHub
GitLab
CI/CD tools
```

Example webhook URL (Jenkins):
```
http://<jenkins-url>/sonarqube-webhook/
```
So when analysis finishes → SonarQube notifies Jenkins.

4️⃣ Create Security Token

Path:
```
My Account → Security → Generate Token
```
Why Token is needed

Token is used instead of username/password for authentication.
**
CI/CD tools use it to send code for analysis.**

Example token name:
```
jenkins-token
```
5️⃣ Typical Flow in DevOps
```
Developer pushes code
        ↓
Jenkins Pipeline starts
        ↓
Sonar Scanner runs
        ↓
Code sent to SonarQube
        ↓
SonarQube analyzes code quality
        ↓
Webhook notifies Jenkins
        ↓
Pipeline continues or fails
```
## ✅ Jenkins Setup for SonarQube Integration**

6️⃣ Install Required Plugins in Jenkins

Before configuring SonarQube with Jenkins, install the required plugins.

Go to:
```
Manage Jenkins → Manage Plugins → Available Plugins
```

Install the following plugins:
```
SonarQube Scanner
Sonar Quality Gates
NodeJS
```
These plugins allow Jenkins to run SonarQube code analysis inside pipelines.

7️⃣ Configure SonarQube Server in Jenkins

Go to:
```
Manage Jenkins → Configure System

Find the SonarQube Servers section and click Add SonarQube.
```
Add the following details:
```
Name: SonarQube
Server URL: http://<sonarqube-ip>:9000
```
8️⃣ Add SonarQube Authentication Token

Create Jenkins credentials using the token generated earlier in SonarQube.

Go to:
```
Manage Jenkins → Manage Credentials

Add a new credential:

Kind: Secret Text
ID: sonar-token
Secret: <paste-sonarqube-token>
```
Use the token you generated in SonarQube:
```
SonarQube → My Account → Security → Generate Token
```
Then select this credential in the SonarQube Server configuration.

9️⃣ Install SonarQube Scanner Tool

Go to:
```
Manage Jenkins → Global Tool Configuration

Find SonarQube Scanner and click Add SonarQube Scanner.
```
Example configuration:
````
Name: sonar-scanner
Install Automatically: ✓
Version: Latest
````
Jenkins will automatically download the scanner.

**Setup Flow**
```
SonarQube Container Running
        ↓
Generate SonarQube Token
        ↓
Install Jenkins Plugins
        ↓
Configure SonarQube Server in Jenkins
        ↓
Add Token as Secret Text
        ↓
Install SonarQube Scanner Tool
        ↓
Ready for Pipeline Code Analysis
```

## GCP Setup for CI/CD Pipeline

🔟 Install Google Cloud CLI
```
# 1. Update packages
sudo apt update

# 2. Install required dependencies
sudo apt install -y apt-transport-https ca-certificates gnupg curl

# 3. Add Google Cloud CLI repository key
curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo gpg --dearmor -o /usr/share/keyrings/cloud.google.gpg

# 4. Add the repository
echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | sudo tee /etc/apt/sources.list.d/google-cloud-sdk.list

# 5. Update again
sudo apt update

# 6. Install Google Cloud CLI
sudo apt install -y google-cloud-cli
```

Then authenticate:
```
gcloud auth login
```

This allows the VM to interact with Google Cloud services.

1️⃣1️⃣ Create Service Account in GCP

In Google Cloud Platform:
```
Go to IAM & Admin → Service Accounts

Create a new service account

Grant permissions such as:

Artifact Registry Writer

Storage Admin (optional depending on use)

Attach this service account to your VM.
```
1️⃣2️⃣ Create Artifact Registry

Go to:
```
Artifact Registry → Create Repository

Example repository:

devops-repo

Example image path:

us-central1-docker.pkg.dev/project-3fb9dc72-feba-49ea-b89/devops-repo/simple-notes-app
```
This registry stores Docker images built by Jenkins.

1️⃣3️⃣ Create Service Account Key

In the Service Account section:
```
Open your service account

Go to Keys

Click Add Key → Create New Key

Select JSON

Download the JSON key file.
```
1️⃣4️⃣ Add GCP Key to Jenkins Credentials

Go to Jenkins:
```
Manage Jenkins → Manage Credentials

Add credential:

Kind: Secret File
ID: gcp-artifact-key
Upload: service-account-key.json
```
This credential allows Jenkins to authenticate with GCP Artifact Registry.

1️⃣5️⃣ Create Jenkins Pipeline

Create a Jenkins Pipeline job connected to your GitHub repository.

The pipeline will:
```
Pull source code

Run SonarQube analysis

Build Docker image

Push image to Artifact Registry

Deploy container
```
1️⃣6️⃣ Configure GitHub Webhook

In your GitHub repository:
```
Settings → Webhooks → Add Webhook

Example webhook URL:

http://<jenkins-server>:8080/github-webhook/
```
This triggers the Jenkins pipeline when code is pushed.

Jenkins Pipeline (Jenkinsfile)
```
pipeline {
agent any

environment {
    SONAR_HOME = tool "sonar"
    IMAGE_NAME = "us-central1-docker.pkg.dev/project-3fb9dc72-feba-49ea-b89/devops-repo/simple-notes-app"
    CONTAINER_NAME = "notes-app"
}

stages {

    stage('Clean Previous Build') {
        steps {
            cleanWs()
        }
    }

    stage('Checkout Code') {
        steps {
            checkout scm
        }
    }

    stage('Authenticate GCP') {
        steps {
            withCredentials([file(credentialsId: 'gcp-artifact-key', variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
                sh 'gcloud auth activate-service-account --key-file=$GOOGLE_APPLICATION_CREDENTIALS'
                sh 'gcloud auth configure-docker us-central1-docker.pkg.dev --quiet'
            }
        }
    }

    stage('SonarQube Scan') {
        steps {
            withSonarQubeEnv('sonar') {
                sh "${SONAR_HOME}/bin/sonar-scanner -Dsonar.projectKey=simple-notes-app"
            }
        }
    }

    stage('Build & Push Image') {
        steps {
            sh """
            docker build -t ${IMAGE_NAME}:latest -t ${IMAGE_NAME}:latest .
            docker push ${IMAGE_NAME}:latest
            """
        }
    }

    stage('Deploy Container') {
        steps {
            sh """
            docker stop ${CONTAINER_NAME} || true
            docker rm ${CONTAINER_NAME} || true
            docker run -d -p 5000:5000 --name ${CONTAINER_NAME} ${IMAGE_NAME}:latest
            """
        }
    }

}
}
```
<img width="1730" height="493" alt="image" src="https://github.com/user-attachments/assets/ff229c83-7e07-4a0f-a5c2-ff978c8ce55e" />

<img width="1746" height="998" alt="image" src="https://github.com/user-attachments/assets/be4eb585-538e-4448-9abb-65856dd83368" />
## just check the conatiner is running 
<img width="1862" height="114" alt="image" src="https://github.com/user-attachments/assets/5f7acabc-e90a-4938-813d-8ef541c8c147" />

## App is running on port 5000 so just checkit out it should accessible or not 

<img width="1862" height="792" alt="image" src="https://github.com/user-attachments/assets/7b881c0d-3eb7-4eea-8b15-05f7a825f409" />


CI/CD Pipeline Flow
```
Developer pushes code → GitHub
           ↓
GitHub Webhook triggers Jenkins
           ↓
Jenkins Pipeline starts
           ↓
SonarQube Code Analysis
           ↓
Docker Image Build
           ↓
Push Image to GCP Artifact Registry
           ↓
Deploy Container
```
## Generate Git Commit SHA for Docker Image Tag

In the Jenkins pipeline, we generate a short Git commit SHA and store it in an environment variable.
```
TAG = "${sh(script: 'git rev-parse --short=10 HEAD', returnStdout: true).trim()}"
Command Explanation
git rev-parse --short=10 HEAD


```
<img width="1016" height="166" alt="image" src="https://github.com/user-attachments/assets/581eb6bc-5200-4c10-8edf-f3bda0f9828f" />
git rev-parse → Git command used to get commit information
HEAD → Refers to the latest commit in the current branch
--short=10 → Returns the first 10 characters of the commit SHA

Example output:
```
a3f9b7c1d2
```
**Why We Use This**

We use the Git commit SHA as the Docker image tag to:
Identify exactly which commit built the image
Ensure every build has a unique image tag
Enable easy rollback to a previous version
Follow CI/CD best practices for traceable deployments

Example Docker image created:
```
simple-notes-app:a3f9b7c1d2
```
<img width="1824" height="110" alt="image" src="https://github.com/user-attachments/assets/8aaba630-2211-45c1-9f2c-602aa87f7f6d" />

<img width="1848" height="731" alt="image" src="https://github.com/user-attachments/assets/fdeabc71-dd4f-4d31-a32f-56eb265f2ab6" />
