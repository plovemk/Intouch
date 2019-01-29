function searchJobs([string]$query, [string]$depth){

  node "C:\Users\$env:Username\Intouch\intouch-tools\main-Functions\search.js" $query $depth
  <#
  .Synopsis
  This is a search engine for the server with all of the jobs.
    .Parameter Start
  This takes two parameters . your search query and the depth of the search. The search query has to be wrapped in quotes if you want to search multiple words. The depth parameter is always a number. The lower the number the quicker the search. 1 is the defaualt but zero can be used too.
  .Description
    Alias - search, find, sd, fd
  .Example
  searchJobs 12345
  .Example
  searchJobs Social
  .Example
  searchJobs "DM NSD"
  .Example
  searchJobs "Color" 2
  .Inputs
  String, Integer

  #>
}
Set-Alias search searchJobs
Set-Alias find searchJobs
Set-Alias sd searchJobs
Set-Alias fd searchJobs
