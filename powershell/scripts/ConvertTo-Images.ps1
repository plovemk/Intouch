function makeImages([String]$filePath) {
  $announce =  Write-Host '
  ------------------------------------------------
  Making eCard Image files
  ------------------------------------------------
  '
  Set-Location "Z:\"
  $path = $filePath.Replace("$env:INTOUCH_SERV\","Z:")
  cd $path

  if($path.contains('HTML')){
    cd '..\..\..\Release folder\'
    $finalPath = get-location
  }
  elseIf($path.contains('Production')) {
      cd '..\..\Release folder\'
      $finalPath = get-location
  }
  elseIf($path.contains('Working folder')) {
     cd '..\Release folder\'
     $finalPath = get-location
  }
  else {
    cd 'Release folder\'
    Write-Host ' html '  $path
  }

  node "C:\Users\$env:Username\Intouch\intouch-tools\main-Functions\resize.js" $finalPath

  <#
  .Synopsis
  makes image files for eCards

  .Description
  Alias:
  images, imgs, createImage

  .Parameter Start
  path to the release file in a string. copy the path from explorer folder and make sure wrapped in quotes

  .Example
  makeImages "path/to/release folder"
  Use any of the alias that are listed
  .Example
  makeImage "$env:INTOUCH_SERV\_InTouch General Support\863909 DM Cyber Monday EC 10-01-18\Release folder"
  Use any of the alias that are listed
  .Inputs
  String

  #>
}
Set-Alias images makeImages
Set-Alias imgs makeImages
Set-Alias createImage makeImages
# Set-Alias makeImages
# Set-Alias makeImages
