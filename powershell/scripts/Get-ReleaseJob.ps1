function releaseJob([string]$job){
  node "C:\Users\$env:Username\Intouch\main-Functions\email.js" $job
  <#
  .Synopsis
  This will create a draft of the release email
    .Parameter Start
    job Number of the files being released
  .Description
    Alias - rw, rwp, reweb
  .Example
  rec 12356
  .Example
  rj 123456
  .Inputs
  integer

  #>
}



Set-Alias rw releaseJob
Set-Alias rj releaseJob
Set-Alias rwp releaseJob
Set-Alias reweb releaseJob
Set-Alias rec releaseJob
