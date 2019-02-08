function onboard {
    Scoop install git; Scoop install cygwin; Scoop bucket add extras; Scoop install atom; Scoop install nodejs; git clone https://github.com/plovemk/Intouch.git; changDir; setPuppeteer, lastStep
}

function setPuppeteer {
   New-Item -Name '.npmrc' -ItemType 'file' -Value "puppeteer_skip_chromium_download=true $([Environment]::NewLine)PUPPETEER_CHROMIUM_REVISION=1.0.2"
}

function lastStep {
  npm run getAlias; nad; nr pshell; npm install -g concurrently; nr setup
}

function changDir {
    cd '.\Intouch\'
}

onboard
