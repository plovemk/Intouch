

function onboard {
    setLocal; getScoop; Scoop install git; Scoop install cygwin; Scoop bucket add extras; Scoop install atom; Scoop install nodejs; npm config set strict-ssl false; git clone https://github.com/plovemk/Intouch.git; changDir; setPuppeteer; createEnvFile; lastStep; message; setBaseEnv; setServEnv
  }
function setLocal {
  cd '~'
}
function getScoop {
  Write-Host "installing Scoop" -Fore "Green"
  iex (new-object net.webclient).downloadstring('https://get.scoop.sh')
}
function setPuppeteer {
   New-Item -Name '.npmrc' -ItemType 'file' -Value "puppeteer_skip_chromium_download=true $([Environment]::NewLine)PUPPETEER_CHROMIUM_REVISION=1.0.2"
   Write-Host "NPMRC file created and Puppeteer flags were set" -Fore "Green"
}
function createEnvFile {
  New-Item -Name '.env' -ItemType 'file' -Value "APRIMO_REPORT =$([Environment]::NewLine)INTOUCH_SERV ="
  Write-Host "ENV file created " -Fore "Green"
}

function lastStep {
  Write-Host "installing Dependencies" -Fore "Green"
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

  $baseValue = Read-Host '
  ------------------------------------------------
  Copy and Paste the INTOUCH_BASE Value? - make sure there are not any spaces at the beginning or end.
  ------------------------------------------------
  '
  [Environment]::SetEnvironmentVariable("INTOUCH_BASE", "$baseValue", "User"); [Environment]::SetEnvironmentVariable("INTOUCH_BASE", "$baseValue", "Process")
  Write-Host "Environment variable for INTOUCH_BASE set" -Fore "Green"
}

function setServEnv {


  $servValue = Read-Host '
  ------------------------------------------------
  Copy and Paste the INTOUCH_SERV Value? - make sure there are not any spaces at the beginning or end.
  ------------------------------------------------
  '
  [Environment]::SetEnvironmentVariable("INTOUCH_SERV", "$servValue", "User"); [Environment]::SetEnvironmentVariable("INTOUCH_SERV", "$servValue", "Process"); createNetworkDrive

  Write-Host "Environment variable for INTOUCH_SERV set" -Fore "Green"
}

onboard
