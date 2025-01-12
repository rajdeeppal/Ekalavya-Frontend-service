pipeline {
    agent any
    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials') 
        SSH_KEY = credentials('ec2-ssh-key')
        IMAGE_NAME = 'iamdebjit3107/ekalavya-frontend'
        EC2_USER = 'ubuntu'
        EC2_HOST = '13.233.255.117'
    }
    
    stages {
        stage('Clone Repository') {
            steps {
                // Clone the React project from GitHub
                git branch: 'main', url: 'https://github.com/rajdeeppal/Ekalavya-Frontend-service.git'
            }
        }

        stage('Docker Build') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${env.BUILD_ID} ."
            }
        }

        stage('Docker Login') {
            steps {
                sh "echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin"
            }
        }

        stage('Docker Push') {
            steps {
                sh "docker push ${IMAGE_NAME}:${env.BUILD_ID}"
            }
        }

        stage('Deploy to EC2') {
            steps {
                sh """
                ssh -o StrictHostKeyChecking=no -i ${SSH_KEY} ${EC2_USER}@${EC2_HOST} \
                "docker pull ${env.IMAGE_NAME}:${env.BUILD_ID} && \
                docker stop ekalavya-frontend-app || true && \
                docker rm ekalavya-frontend-app || true && \
                docker run --restart unless-stopped -d --name ekalavya-frontend-app -p 80:80 ${env.IMAGE_NAME}:${env.BUILD_ID}"
                    """
            }
        }
    }

    post {
        success {
            echo 'React App successfully deployed to EC2 instance'
        }
        failure {
            echo 'Deployment failed'
        }
    }
}
