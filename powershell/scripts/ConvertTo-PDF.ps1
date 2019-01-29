function makeBoards([string]$filePath, [string]$lang,[string]$version){
  # Set-Location "Z:\"
  $path = $filePath.Replace("$env:INTOUCH_SERV\","Z:\")
  function callNode($uniPath, $lang){

    node "C:\Users\$env:Username\Intouch\intouch-tools\main-Functions\pdf.js" $uniPath $lang $version
  }
  if($path.contains('HTML')){
    Write-Host ' html '  $path
     $hPath = $path.Replace("\Production\HTML","\Boards\Screenshots")
    callNode $path $lang $version
    Set-Location $hPath
  }
  elseIf($path.contains("Production")) {
    $proPath = $path, "\HTML" -join ""
    Write-Host 'production ' $proPath
    $proBoardsPath = $proPath.Replace("\Production\HTML","\Boards\Screenshots")
    Write-Host 'proBoardsPath ' $proBoardsPath
    callNode $proPath $lang $version
    Set-Location $proBoardsPath
  }
  elseIf($path.contains('Working folder')) {
     $workPath = $path, '\Production\HTML' -join ""
    Write-Host 'working ' $workPath
    $workBoardPath = $workPath.Replace("\Production\HTML","\Boards\Screenshots")
    callNode $workPath $lang $version
    cd  $workBoardPath
  }


  <#
  .Synopsis
  makes pdfs of the html files and store them in the correct Directory
  .Description
  Alias:
   pdf, boards, mb

  .Parameter Start
  1. path to the working folder in  a string. copy the path from explorer folder and make sure wrapped in quotes
  2. after the path - the language type should go here. It's either english, en, spanish, sp
  3. The last argument is the version of the board.
  .Example
  makeBoards "path/to/working folder" en v2
  makeBoards "path/to/working folder" english v31
  makeBoards "path/to/working folder" sp v4
  makeBoards "path/to/working folder" spanish v1
  Use any of the alias that are listed
  .Example
  makeBoards "$env:INTOUCH_SERV\_InTouch General Support\866112 PM Botanical Effects Evergreen EC 11-16-18\Working folder\Production\HTML" en v1
  makeBoards "$env:INTOUCH_SERV\_InTouch General Support\866112 PM Botanical Effects Evergreen EC 11-16-18\Working folder\Production\HTML" sp v2
  makeBoards "$env:INTOUCH_SERV\_InTouch General Support\866112 PM Botanical Effects Evergreen EC 11-16-18\Working folder\Production\HTML" english v22
  makeBoards "$env:INTOUCH_SERV\_InTouch General Support\866112 PM Botanical Effects Evergreen EC 11-16-18\Working folder\Production\HTML" spanish v18
  Use any of the alias that are listed
  .Inputs
  String

  #>
}
Set-Alias pdf makeboards
Set-Alias boards makeboards
Set-Alias mb makeboards
