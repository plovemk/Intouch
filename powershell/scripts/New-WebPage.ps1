function newPage([String]$path) {
$import_englishHtml = "\\$env:INTOUCH_BASE\US_CS_Web\Documentation\Dev\Snippets\Code-Snippets\__New-Page-en_US.html"
$import_spanishHtml = "\\$env:INTOUCH_BASE\US_CS_Web\Documentation\Dev\Snippets\Code-Snippets\__New-Page-es_US.html"
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
# for testing
# Set-Location "Users\$env:Username\Intouch\newPages-testing-automation\Working folder\Production\HTML"
  # for testing

  #for live
    Set-Location "Z:\"

    $path = $path.Replace("$env:INTOUCH_SERV\","Z:")
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
    # cd $newpath

    # cd "\Working Folder\Production\HTML"
    # cd "HTML"
    $projectNumber = Read-Host '
    ------------------------------------------------
    What is the project number?
    ------------------------------------------------
    '

    $projectName = Read-Host '
    ------------------------------------------------
  Type the name of the English HTML file WITHOUT the job number and file ext.  ----- test-project-EN-US --------
    ------------------------------------------------
    '
    # Ask for Author name, job number, pushlishDate and store in json object to put in the head meta tags
  function makeFileContent(){
      Param([String]$importedFile,[String]$lang )
      Get-Content -Path $importedFile | Out-file $lang -Encoding ASCII
    }
    function pushtoRecentList() {
      # echo "is this even being called? $projectNumber $projectName"
      $pPath = Get-Location
      node "C:\Users\$env:Username\Intouch\main-Functions\recentProjects.js" $projectNumber $projectName "webpage" $pPath
    }

  $pageName = Read-Host '
  Copy and Paste the English HTML file name from the project notes in WIN.
  '
  $combinedName = $projectNumber, "-", $projectName, ".html" -join ""
  if($pageName.Contains('EN-US')) {
    $YesOrNo = Read-Host "
    ------------------------------------------------------------------------------------------------
     '$pageName' and '$combinedName'. Would you like to proceed? Please enter your response (y/n)
    ------------------------------------------------------------------------------------------------
    "
   if ($YesOrNo -eq 'y' -or $YesOrNo -eq 'yes') {
     pushtoRecentList
     touch $pageName
     makeFileContent $import_englishHtml $pageName
     $spanish = $pageName.Replace("EN-US", "ES-US")
     touch $spanish
     # atom .
   }
 } elseIf(!$pageName.Contains('EN-US')) {

   Write-Host "
        ------------------------------------------------
        | Filename should have an EN-US in it         |
        ------------------------------------------------
        " -ForegroundColor $Color[2]
   home
  }

  <#
  .Synopsis
  This will create the the webpage html files for a new job .
    .Parameter Start
  path to the production folder in a string. copy the path from explorer folder and make sure it is wrapped in quotes
  .Description
    Alias: np - page - makepage
  .Example
  newPage "path/to/production folder"
  .Example
  newPage "$env:INTOUCH_SERV\_InTouch General Support\863909 DM Cyber Monday EC 10-01-18\Working folder"
  .Inputs
  String

  #>
}
Set-Alias np newPage
Set-Alias page newPage
Set-Alias makepage newPage
# TO ADD MORE ALIAS  - Set-Alias [the keyword you want to use] missingLinks
