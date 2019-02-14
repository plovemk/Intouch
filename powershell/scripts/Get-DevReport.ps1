function getDevReport([String]$devName) {
  node "C:\Users\$env:Username\Intouch\main-Functions\incoming-jobs.js" $devName
  <#
  .Synopsis
  This will get all of the jobs that every dev has assigned

    .Parameter Start
  string only - Params are a devs first or last name. OR you can type all and it will loop through every dev
  .Description
    ALIAS
    incoming, ij, jobs
  .Example
  getDevReport all
  Use any of the alias that are listed
  Follow the format to make a custom alias  ---> Set-Alias name missingLinks
  .Example
  getDevReport Kayla
  Use any of the alias that are listed
  Follow the format to make a custom alias  ---> Set-Alias name missingLinks
  .Example
  getDevReport
  Leaving the Param blank will run a search on every dev
  Use any of the alias that are listed
  Follow the format to make a custom alias  ---> Set-Alias name missingLinks
  .Inputs
  String - Name of dev to run a DevReport or "all"
  Undefined/Blank - To run a search on every dev

  #>
}

Set-Alias incoming getDevReport
Set-Alias ij getDevReport
Set-Alias jobs getDevReport
