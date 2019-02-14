function getJobStatus([Int]$jobNumber) {
  node "C:\Users\$env:Username\Intouch\main-Functions\jobStatus.js" $jobNumber
  <#
  .Synopsis
  This will get the report that finds the job Status of a job.

    .Parameter Start
  Job Number/ Job ID
  .Description
    ALIAS
    needLinks, links, ml, missing, miss
  .Example
  js 12345
  Use any of the alias that are listed
  Follow the format to make a custom alias  ---> Set-Alias name missingLinks
  .Example
  jobStatus 586781
  Use any of the alias that are listed
  Follow the format to make a custom alias  ---> Set-Alias name missingLinks
  .Inputs
  Int

  #>
}

Set-Alias jstat getJobStatus
Set-Alias stat getJobStatus
Set-Alias js getJobStatus
