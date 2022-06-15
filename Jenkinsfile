pipeline {
  agent {
    label 'jenkins-npm'
  }
  environment {
    PROJECT_NAME = 'bpm-web'
  }
  options {
    gitLabConnection('gitlab')
  }
  stages {
    stage('Build') {
      steps {
        script {
          container('node') {
            updateGitlabCommitStatus name: 'build', state: 'pending'
            sh 'npm install'
            sh 'npm run-script build --configuration=production --build-optimizer'
            updateGitlabCommitStatus name: 'build', state: 'success'
          }
        }
      }
    }
//     stage('SonarQube Analysis') {
//       steps {
//         script {
//           def scannerHome = tool 'SonarScanner';
//           withSonarQubeEnv() {
//             updateGitlabCommitStatus name: 'quality', state: 'pending'
//             sh "${scannerHome}/bin/sonar-scanner"
//             updateGitlabCommitStatus name: 'quality', state: 'success'
//           }
//         }
//       }
//     }
    stage('Dockerize') {
      when {
        branch 'develop'
      }
      steps {
        script {
          container('docker') {
            updateGitlabCommitStatus name: 'dockerize', state: 'pending'
            sh 'docker build -t harbor.lptech.vn/library/${PROJECT_NAME}:1.0.0-${BUILD_NUMBER} .'
            sh 'docker push harbor.lptech.vn/library/${PROJECT_NAME}:1.0.0-${BUILD_NUMBER}'
            sh 'docker rmi harbor.lptech.vn/library/${PROJECT_NAME}:1.0.0-${BUILD_NUMBER}'
            updateGitlabCommitStatus name: 'dockerize', state: 'success'
          }
        }
      }
    }
    stage('Deployment') {
      when {
        branch 'develop'
      }
      steps {
        script {
          container('helm') {
            updateGitlabCommitStatus name: 'deployment', state: 'pending'
            sh 'helm upgrade --install -n default ${PROJECT_NAME} chart --set image.tag=1.0.0-${BUILD_NUMBER}'
            updateGitlabCommitStatus name: 'deployment', state: 'success'
          }
        }
      }
    }
  }
}
