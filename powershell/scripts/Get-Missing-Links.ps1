
function missingLinks([String]$filePath) {
  Set-Location "Z:\"
  $path = $filePath.Replace("$env:INTOUCH_SERV\","Z:")
  cd $path
  if($path.contains('HTML')){
    cd '..\..\..\Release folder\'
  }
  elseIf($path.contains('Production')) {
      cd '..\..\Release folder\'
  }
  elseIf($path.contains('Working folder')) {
     cd '..\Release folder\'
  }
  else {
    # cd 'Release folder'
    Write-Host ' html '  $path
  }
    node "C:\Users\$env:Username\Intouch\intouch-tools\main-Functions\missingLinks.js" $filePath

    <#
    .Synopsis
    This will find all of the missing links and pdf files for a job. It will put them in JSON format inside a file named missingLinks.json

      .Parameter Start
    path to the release file in a string. copy the path from explorer folder and make sure wrapped in quotes
    .Description
      ALIAS
      needLinks, links, ml, missing, miss
    .Example
    missingLinks "path/to/release folder"
    Use any of the alias that are listed
    Follow the format to make a custom alias  ---> Set-Alias name missingLinks
    .Example
    missingLinks "$env:INTOUCH_SERV\_InTouch General Support\863909 DM Cyber Monday EC 10-01-18\Release folder"
    Use any of the alias that are listed
    Follow the format to make a custom alias  ---> Set-Alias name missingLinks
    .Inputs
    String

    #>
}

Set-Alias needLinks missingLinks
Set-Alias links missingLinks
Set-Alias ml missingLinks
Set-Alias missing missingLinks
Set-Alias miss  missingLinks


# TO ADD MORE ALIAS  - Set-Alias [the keyword you want to use] missingLinks
