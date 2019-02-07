function newCard([String]$newCardPath) {
  $import_NSD_en = "\\$env:INTOUCH_BASE\US_CS_Web\Documentation\Dev\Snippets\Code-Snippets\eCard-NSD-en_US.html"
  $import_NSD_es = "\\$env:INTOUCH_BASE\US_CS_Web\Documentation\Dev\Snippets\Code-Snippets\eCard-NSD-es_US.html"
  $import_englishHtml = "\\$env:INTOUCH_BASE\US_CS_Web\Documentation\Dev\Snippets\Code-Snippets\eCard-en_US.html"
  $import_spanishHtml = "\\$env:INTOUCH_BASE\US_CS_Web\Documentation\Dev\Snippets\Code-Snippets\eCard-es_US.html"
# "$env:INTOUCH_SERV\_InTouch General Support\863809 DM Black Friday EC 10-01-18\Working folder\Production"
# "Z:\_InTouch General Support\863809 DM Black Friday EC 10-01-18\Working folder\Production"

  # FOR TESTING ECARDS
  # Set-Location "C:\Users\$env:Username\Intouch\ecard-script-testing"
  # function setLocation($newCardPath) {
    # $fileNames = Get-ChildItem -Path $newCardPath -Directory -Recurse
  # }
  # FOR TESTING ECARDS
  # FOR LIVE ECARDS
  Set-Location "Z:\"

  $path = $newCardPath.Replace("$env:INTOUCH_SERV\","Z:")
  if($path.contains('HTML')){
    cd $path
    Write-Host ' html '  $path
  }
  elseIf($path.contains('Production')) {
      $proPath = $path, '\HTML\' -join ""
      cd $proPath
    Write-Host 'production ' $proPath
  }
  elseIf($path.contains('Working folder')) {
     $workPath = $path, '\Production\HTML\' -join ""
     cd $workPath
    Write-Host 'working ' $workPath
  }
  else {
    $basePath = $path, '\Working folder\Production\HTML\' -join ""
    cd $basePath
    Write-Host 'base path  ' $basePath
  }
  # FOR LIVE ECARDS

  $nsd = New-Object -ComObject "HTMLFile"
  $typeArray = New-Object System.Collections.ArrayList
  $cidArray = New-Object System.Collections.ArrayList
  $foldersArray = New-Object System.Collections.ArrayList
  $menuIndex = 0
  $foldersArray = @{}
  $langFold = @{}
  $projectInfo = @{}
  $path = (pwd).PATH
  $appData = $path + "\appData.json"
  $cidurltxt = "cid-url.txt"
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
  $projectNumber = Read-Host '
  ------------------------------------------------
  What is the project number?
  ------------------------------------------------
  '
  $projectName = Read-Host '
  ------------------------------------------------
  What is the project Name -leave out the number
  ------------------------------------------------
  '
  $releaseDate = Read-Host '
  ------------------------------------------------
  What is the project release date - month/yr - example (0818)
  ------------------------------------------------
  '

  # $newpath = $path.Replace("$env:INTOUCH_SERV\","")
  # cd $newpath

  # cd "Working Folder/Production/HTML"
  $langFold = @{
    0 = 'ENGLISH'
    1 = 'SPANISH'
  }
  $foldersArray = [Ordered]@{
      0 = "NSD-ISD-blank"
      1 = "ISD-ISD-blank"
      2 = "ISD-IBC-blank"
      3 = "IBC-CONSUMER-blank"
      4 = "ISD-CONSUMER-blank"
      5 = "NSD-blank"
      6 = "ISD-blank"
      7 = "NSD-ISD-msg"
      8 = "ISD-ISD-msg"
      9 = "ISD-IBC-msg"
      10 = "IBC-CONSUMER-msg"
      11 = "ISD-CONSUMER-msg"
      12 = "NSD-msg"
      13 = "ISD-msg"
  }
  foreach($word in $foldersArray.keys) {

    if($menuIndex % 2 -eq 0) {
      Write-Host '             #',$menuIndex,'--------' , $foldersArray[$menuIndex]
    } else {
      Write-Host '             #',$menuIndex, '--------', $foldersArray[$menuIndex] -Fore $Color[8]
    }
    $menuIndex += 1

  }

  $folderSelect = (Read-Host "Select Folders to create(type the number and seperate with a comma)").split(',') | ForEach-Object {$_.trim()}
  $jObj = @{jobId=$projectNumber; imagesPath="http://www.marykay.com/email/images/"; releaeDate=$releaseDate; prodName=$projectName; cardTypes=foreach($type in $folderSelect){$foldersArray[[int]$type]}}
  $jobj | ConvertTo-Json  | Out-file $appData -Encoding ASCII

  function pushtoRecentList() {
    # echo "is this even being called? $projectNumber $projectName"
    $pPath = Get-Location
    node "C:\Users\$env:Username\Intouch\main-Functions\recentProjects.js" $projectNumber $projectName "ecard" $pPath
  }
  # pushtoRecentList
  function spawnDir() {
    foreach($item in $folderSelect) {
      $toNumber = [int]$item
      mkdir $foldersArray[$toNumber]
      Write-host $foldersArray[$toNumber] 'folder created.' -Fore $Color[12]
    }
  }

  function makeFileContent(){
    Param([String]$importedFile,[String]$lang )
    Get-Content -Path $importedFile | Out-file $lang -Encoding ASCII
  }
  function makeCID(){
    Param([String]$lang, $jObj, [string]$vers)
    "&et_cid=ecard_", $jObj.releaeDate, $jObj.prodName, $lang, $vers,'_', $jObj.jobId -join ""
  }
  function makeFiles(){
    Param([String]$version, [hashtable]$jObj, [string]$fileType)
    $jObj.jobId,'-',$jObj.prodName,'-',$version, $fileType -join ""
  }
  function insertJobId(){
    Param([string]$file, [hashtable]$jObj, [String]$version)
    $win = Get-Content -Path $file | Out-String
    $win.replace('[[WIN JOB NUMBER]]', $jObj.jobId).replace('<strong>JOB TYPE:</strong></p>', "<strong>JOB TYPE:</strong> $version</p>") | Out-File $file -Encoding ASCII
  }
  function insertJobType(){
    Param([String]$file)
  }
  $pushCounter = 0

   "ENGLISH" , "SPANISH" | ForEach-Object {
     mkdir -p "$_"; cd "$_"; spawnDir;
     $int = 0
     if($pushCounter -eq 0){
       pushtoRecentList
       ++$pushCounter
     }
     foreach($item in $folderSelect) {
       $toNumber = [int]$item
       $version = $foldersArray[$toNumber]

       if($_ -eq 'ENGLISH'){
         $enHtml = makeFiles $version $jObj '-EN-US.html'
         $enTxt = makeFiles $version $jObj '-EN-US.txt'
         touch $enTxt,  $enHtml
         Write-host  $enHtml 'and ' $enTxt ' files created' -Fore $Color[12]
           if($enHtml.contains('NSD')){
               makeFileContent $import_NSD_en $enHtml
                insertJobId $enHtml $jObj $version
             } else{
               makeFileContent $import_englishHtml $enHtml
               insertJobId $enHtml $jObj $version
             }
           $cidArray += makeCID '_en' $jObj $version
           $typeArray += $enHtml
         }elseIf($_ -eq 'SPANISH') {
           ++$int
           $spHtml = makeFiles $version $jObj '-ES-US.html'
           $spTxt = makeFiles $version $jObj '-ES-US.txt'
           touch $spTxt, $spHtml
           Write-host  $spHtml 'and ' $spTxt ' files created' -Fore $Color[12]
           if($spHtml.contains('NSD')){
               makeFileContent $import_NSD_es $spHtml
               insertJobId $spHtml $jObj $version
             } else{
               makeFileContent $import_spanishHtml $spHtml
               insertJobId $spHtml $jObj $version
             }
           $cidArray += makeCID '_es' $jObj $version
           $typeArray += $spHtml
           if($folderSelect.length -eq $int) {
             @{htmlFiles=$typeArray; cidNumbers=$cidArray}| ConvertTo-Json  | Out-file $appData -Append -Encoding UTF8
           }
         }

     }
     cd ".."

  }

  touch $cidurltxt
  $cidArray | Out-file $cidurltxt  -Append -Encoding UTF8
  <#
  .Synopsis
  This will create the ecard and txt files for a job.
    .Parameter Start
  path to the production folder in a string. copy the path from explorer folder and make sure it is wrapped in quotes
  .Description
    Alias - nc ,  ecard, card
  .Example
  newCard "path/to/release folder"
  .Example
  newCard "$env:INTOUCH_SERV\_InTouch General Support\863909 DM Cyber Monday EC 10-01-18\Working folder\Production"
  .Inputs
  String

  #>
}
Set-Alias nc newCard
Set-Alias ecard newCard
Set-Alias card newCard
