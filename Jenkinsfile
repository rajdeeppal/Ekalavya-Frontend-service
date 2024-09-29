pipeline {
    agent any
    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials') 
        SSH_KEY = credentials('ec2-ssh-key')
        IMAGE_NAME = 'iamdebjit3107/ekalavya-frontend'
        EC2_USER = 'ubuntu'
        EC2_HOST = '3.111.84.98'
    }
    
    stages {
        stage('Clone Repository') {
            steps {
                // Clone the React project from GitHub
                git branch: 'main', url: 'https://github.com/rajdeeppal/Ekalavya-Frontend-service.git'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build React App') {
            steps {
                sh 'CI=false npm run build'
            }
        }

        stage('Docker Build') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${env.BUILD_ID} ."
            }
        }

        stage('Docker Login') {
            steps {
                // Login to DockerHub
                withCredentials([usernamePassword(credentialsId: DOCKER_CREDENTIALS_ID, passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                    sh 'echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin'
                }
            }
        }

        stage('Docker Push') {
            steps {
                sh "docker push ${IMAGE_NAME}:${env.BUILD_ID} ."
            }
        }

        stage('Deploy to EC2') {
            steps {
                sshagent (credentials: ['ec2-ssh-credentials']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_IP} '
                        docker pull ${IMAGE_NAME}:${env.BUILD_ID} &&
                        docker stop ${IMAGE_NAME} || true &&
                        docker rm ${IMAGE_NAME} || true &&
                        docker run -d -p 8080:3000 --name react-container ${IMAGE_NAME}:${env.BUILD_ID}
                        '
                    """
                }
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
