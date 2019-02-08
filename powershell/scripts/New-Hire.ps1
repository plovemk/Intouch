$baseName = Read-Host '
------------------------------------------------
What is the base variable Name?
------------------------------------------------
'
$baseValue = Read-Host'
------------------------------------------------
What is the base variable Value?
------------------------------------------------
'
$servName = Read-Host '
------------------------------------------------
What is the server variable Name ?
------------------------------------------------
'

$servValue = Read-Host'
------------------------------------------------
What is the server variable Value?
------------------------------------------------
'
function onboard {
    Scoop install git; Scoop install cygwin; Scoop bucket add extras; Scoop install atom; Scoop install nodejs; git clone https://github.com/plovemk/Intouch.git; changDir; setPuppeteer; createEnvFile; lastStep; message; createNetworkDrive; setBaseEnv; setServEnv
}

function setPuppeteer {
   New-Item -Name '.npmrc' -ItemType 'file' -Value "puppeteer_skip_chromium_download=true $([Environment]::NewLine)PUPPETEER_CHROMIUM_REVISION=1.0.2"
}
function createEnvFile {
  New-Item -Name '.env' -ItemType 'file' -Value "APRIMO_REPORT =$([Environment]::NewLine)INTOUCH_SERV ="
}

function lastStep {
  npm run getAlias; nad; nr pshell; npm install -g concurrently; nr setup
}
function message {
  Write-Host "Set your ENV variables for the App in the .env file and for the system. See documentation"  -Fore 'Green'
}
function changDir {
    cd '.\Intouch\'
}
function createNetworkDrive {
  New-PSDrive -Name "Z" -PSProvider "FileSystem" -Root "$servValue"
  Write-Host "Network Drive Z created: $servValue" -Fore 'Green'
}

function setBaseEnv {
  [Environment]::SetEnvironmentVariable("$baseName", "$baseValue", "User"); [Environment]::SetEnvironmentVariable("$baseName", "$baseValue", "Process")
  Write-Host "Environment variable for $baseName set" -Fore "Green"
}

function setServEnv {
  [Environment]::SetEnvironmentVariable("$servName", "$servValue", "User"); [Environment]::SetEnvironmentVariable("$servName", "$servValue", "Process")
  Write-Host "Environment variable for $servName set" -Fore "Green"
}


onboard
