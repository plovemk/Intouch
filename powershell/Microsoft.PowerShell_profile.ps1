# Import-Module -Name C:\Users\$env:Username\Documents\WindowsPowerShell\Scripts\Get-Morning-Websites.ps1
Import-Module -Name C:\Users\$env:Username\Documents\WindowsPowerShell\Scripts\New-ECard.ps1
Import-Module -Name C:\Users\$env:Username\Documents\WindowsPowerShell\Scripts\New-WebPage.ps1
Import-Module -Name C:\Users\$env:Username\Documents\WindowsPowerShell\Scripts\Get-Missing-Links.ps1
Import-Module -Name C:\Users\$env:Username\Documents\WindowsPowerShell\Scripts\ConvertTo-Images.ps1
Import-Module -Name C:\Users\$env:Username\Documents\WindowsPowerShell\Scripts\Get-Alias.ps1
Import-Module -Name C:\Users\$env:Username\Documents\WindowsPowerShell\Scripts\ConvertTo-PDF.ps1
Import-Module -Name C:\Users\$env:Username\Documents\WindowsPowerShell\Scripts\Find-JobsPath.ps1
Import-Module -Name C:\Users\$env:Username\Documents\WindowsPowerShell\Scripts\Get-ReleaseJob.ps1
# Import-Module -Name C:\Users\$env:Username\Documents\WindowsPowerShell\Scripts\New-Email.ps1
# Import-Module -Name C:\Users\$env:Username\Documents\WindowsPowerShell\Scripts\Get-Notes.ps1
# Import-Module -Name C:\Users\$env:Username\Documents\WindowsPowerShell\Scripts\ConvertTo-SinglePDF.ps1

# Need to make a command that kicks up a interface for these take ..lke a node -whatever command
#  Itshould list function names and brief descriptions of them and have them pinned to the top.

function edge($website) {
    start microsoft-edge:https://www.$website.com
}

function runPdf {
  node 'pdf.js'
}
function update {
  $profile

}
# function work {
#    $aprimo = "https://marykay.aprimo.com/AprimoPortal/AprimoPortal.aspx?PageID=12221&SelectedNode=InProcessNode&NoFocus=True";
#   iexplorer.exe $aprimo
# }
# function intouch {
#   cd "\\$env:INTOUCH_BASE\US_CS_Web\InTouch"
# }
function intouch {
  # cd "\\$env:INTOUCH_BASE\US_CS_Web\InTouch"
  cd $env:INTOUCH_SERV
}
function intouch-web {
  web "https://applications.marykayintouch.com/Corporate/default.aspx"
}
function open($param) {
  if(!$param) {
    ii .
  } else {
    explorer $param
  }
}

function home {
  cd '~'
}

function networkZ($path) {
  cd "Z:"
    $newpath = $path.Replace("$env:INTOUCH_SERV\","")
    cd $newpath
    pwd

}
#function that sets up a new project

# COPY AND MOVE ITEMS TO ReleaseAllFiles

##ecard or webpage


###INDEX FOLDER PATHS IN Z AND MAKE SEARCHABLE
### PRETTY UP MENU
## HIGHLIGHT NEW FILES IN GREEN TEXT
#WEBPAGE ADD VALUES TO JSON OBJECT - AUTHOR
#JSON OBJECT WITH VALUES FOR ECARD SUBJEC/CATEGORY/TYPE BODY, DISCLAIMER

####webpage string replace the en_Us with es_US --> goes to new variable called spanish -->touch SPANISH
###open in atom

#funciion that changes into project and prompts if I want to open in atom
#function that will copy contents of dev folder into release folder -> prompt to open network shared folder in explorer after being auto pasted in working and release folders


function Invoke-PowerShell {
    powershell -nologo
    Invoke-PowerShell
}
# function release {
#   copyPath
#   open "C:\Users\$env:Username\AppData\Roaming\Microsoft\Templates\ReleaseAllFilesToMerchandisers.oft"
#   & open "C:\Users\$env:Username\AppData\Roaming\Microsoft\Templates\ReleaseAllFiles-Send-Files-to-Canada.oft"
#   & open "C:\Users\$env:Username\AppData\Roaming\Microsoft\Templates\Boards-SendtoJulieHicks.oft"
# }
# function eCard {
#   copyPath
#   open "C:\Users\$env:Username\AppData\Roaming\Microsoft\Templates\eCard-ReleaseFilesToJocelyn.oft"
#   & open "C:\Users\$env:Username\AppData\Roaming\Microsoft\Templates\Boards-SendtoJulieHicks.oft"
# }
function copyPath  {
  #GRAB PATH OF CURREN DIR
  $path = (pwd).PATH
  #REMOVE THE FIRST PARTS OF THE PATHNAME AND POINT TO SERVER
  $result = $path -replace '^[^\\]*\\',''
  #WRAP PATH IN STRING AND REPLACE FILESYSTEM:: AND CLIP TO CLIPBOARD
 '"{0}"' -f $result.replace("FileSystem::", "") | CLIP
}
Set-Alias copyP copyPath
Set-Alias cpath copyPath

function namingConvention {
   echo "JOB ID - COMPONENT-NAME(IF IT EXIST) - ALT TEXT - lang CODE . EXT"
   echo "example 12344-email-hero-en_US.jpg"
}






function touch($fileName) {
  New-Item $fileName
}
function showMenu {
  echo '
 _____                             _
(_____)      _                    | |
   _   ____ | |_  ___  _   _  ____| | _
  | | |  _ \|  _)/ _ \| | | |/ ___) || \
 _| |_| | | | |_| |_| | |_| ( (___| | | |
(_____)_| |_|\___)___/ \____|\____)_| |_| '
Write-Host "Type options to see help"
}

function options {
  $Color = @{
      0='Yellow'
      1='Magenta'
      2='Red'
      3='Cyan'
      4='Green'
      5 ='Blue'
      6 ='DarkGray'
      7 ='Gray'
      8 ='DarkYellow'
      9 ='DarkMagenta'
      10='DarkRed'
      11='DarkCyan'
      12='DarkGreen'
      13='DarkBlue'
    }
  Write-Host "
  Here is a list of functions. " -Fore $Color[1]
  Write-Host "
    makeImages
    missingLinks
    newCard
    searchJobs
    newPage
    pdf
    releaseWebpage
    releaseEcards
    makeText[not working]
  " -Fore $Color[12]
  Write-Host "
    Type gh or help and Function name to get more info on how to use the funcion and see different names " -Fore $Color[1]
  Write-Host "
    'gh makeImages'
    'help makeImages'
  " -Fore $Color[12]
}

Set-Alias -Name 'reload' -Value 'Restart-PowerShell'

$parentProcessId = (Get-WmiObject Win32_Process -Filter "ProcessId=$PID").ParentProcessId
$parentProcessName = (Get-WmiObject Win32_Process -Filter "ProcessId=$parentProcessId").ProcessName

if ($host.Name -eq 'ConsoleHost') {
    if (-not($parentProcessName -eq 'powershell.exe')) {
        Invoke-PowerShell
    }
}
showMenu
