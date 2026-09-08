# start-backend.ps1 - Start local database (if not running) and Spring Boot backend
$portInUse = (netstat -an | Select-String ":3306.*LISTENING")
if (-not $portInUse) {
    & "$PSScriptRoot\start-db.ps1"
}

$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-21.0.11.10-hotspot"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
Set-Location "$PSScriptRoot\backend"
& "C:\Users\vivek\Downloads\apache-maven-3.9.16-bin\apache-maven-3.9.16\bin\mvn.cmd" spring-boot:run
