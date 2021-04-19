#!groovy

node ('jenkins_test'){
    
        stage ('Get Source Code'){
            try{
                    PrintMessage("获取代码","green")
                    checkout scm
            }catch(err){
                    PrintMessage("获取代码失败","red")
                    SendEmail("获取代码失败")
                    throw err
            }
        }
        stage ('npm install'){
            try{
                    PrintMessage("npm 获取依赖","green")
                     sh "npm --registry https://registry.npm.taobao.org install"
            }catch(err){
                    PrintMessage("npm 获取依赖失败","red")
                    SendEmail("npm 获取依赖失败")
                    throw err
            }
        }

    if (env.BRANCH_NAME == 'develop' ) {


        stage ('Dev Test Package'){
            try{
                PrintMessage("Dev Test Package","green")
                sh "npm run build:test"
            }catch(err){
                PrintMessage("Dev Test Package失败","red")
                SendEmail("Dev Test Package失败")
                throw err
            }
        }           
    }

    if (env.BRANCH_NAME == 'master' ) {
        stage ('PROD Package'){
            try{
                PrintMessage("PROD Package","green")
                sh "npm run build:prod"
            }catch(err){
                PrintMessage("PROD Package失败","red")
                SendEmail("PROD Package失败")
                throw err
            }
        }           
    }
}


def PrintMessage(value,color){
    colors = [
                    'red'   : "\033[40;31m >>>>>>>>>>>${value}<<<<<<<<<<< \033[0m",
                    'blue'  : "\033[47;34m ${value} \033[0m",
                    'green' : "[1;32m>>>>>>>>>>${value}>>>>>>>>>>[m"
            ]
    ansiColor('xterm') {
        println(colors[color])
    }
}

