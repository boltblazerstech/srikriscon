# start-db.ps1 - Start local MySQL / MariaDB server
$portInUse = (netstat -an | Select-String ":3306.*LISTENING")
if ($portInUse) {
    Write-Host "[OK] Database server is already running and listening on port 3306." -ForegroundColor Green
} else {
    Write-Host "[*] Starting local MariaDB database server on port 3306..." -ForegroundColor Cyan
    $mariadbPath = "C:\Users\vivek\mariadb\bin\mysqld.exe"
    if (Test-Path $mariadbPath) {
        Start-Process -FilePath $mariadbPath -ArgumentList "--defaults-file=C:\Users\vivek\mariadb\data\my.ini", "--console" -WindowStyle Hidden
        Start-Sleep -Seconds 3
        Write-Host "[OK] Database server started on port 3306." -ForegroundColor Green
    } else {
        Write-Host "[!] MariaDB binary not found at $mariadbPath" -ForegroundColor Red
    }
}
