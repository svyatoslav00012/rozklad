pipeline {
	agent any
	
	stages {
		stage ('deploy project') {
		    steps {
		        sh 'docker build -t rozklad-backend .'
		        sh 'docker-compose down'
		        sh 'docker-compose up -d'
		    }
		}
    }
}