pipeline {
	agent any
	  environment {
        //CI scripts
        WORKSPACE = "${env.WORKSPACE}"
    }

	stages {
	stage('Build'){
			steps{
				bat '"C:\\Program Files (x86)\\Yarn\\bin\\yarn.cmd" install'
			}
		}
		stage('Clean old builds'){
			steps {
				script{
					try{
						echo 'Clean'
						dir("E:\\Site\\MicroService\\web\\runtime"){
							deleteDir();
						}
					}catch(err){
						echo 'Error: ' + err.message
					}
				}
			}
		}
		stage('Deploy'){
			steps{
				bat 'xcopy %WORKSPACE% "E:\\Site\\MicroService\\web\\runtime" /h /i /c /k /e /r /y'
				dir("E:\\Site\\MicroService\\web\\runtime"){
					
					bat '"C:\\Program Files (x86)\\Yarn\\bin\\yarn.cmd" build:staging'
					bat 'C:\\Users\\Administrator\\AppData\\Roaming\\npm\\pm2 restart vme_web'
				}
			}
		}
	}
}