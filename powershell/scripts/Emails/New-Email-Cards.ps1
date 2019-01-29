param (
    [string]$jobId,
    [string]$jobName,
    [string]$releaseLink
)

$serv = $env.MAIL_SERVE



# function checkENV() {
#
#   if(-Not (Get-ChildItem Env:USEREMAIL)) {
#       $setEmailEnv = Read-Host "
#       ------------------------------------------------------------------------------------------------
#         Your email address has not been set as an env variable. Please type your email Address
#       ------------------------------------------------------------------------------------------------
#       "
#       Write-Host $setEmailEnv
#       $YesOrNo = Read-Host "
#       '$setEmailEnv'. Is that correct? Type yes or no
#       "
#       if($YesOrNo -eq 'yes' -or $YesOrNo -eq 'y') {
#         [Environment]::SetEnvironmentVariable("USEREMAIL", "$setEmailEnv")
#         $EmailFrom = (Get-ChildItem Env:USEREMAIL).value
#         Write-Host "
#         ------------------------------------------------------------------------------------------------
#         Your Email has been set as an env variable $EmailFrom
#         ------------------------------------------------------------------------------------------------
#         "
#
#       }
#   }
# }
$style = @"
<style>
th {
  border:none;
  border-right:solid #BFBFBF 1.0pt;
  padding:.05in .1in .05in .1in;
  color: #fff;
  width: 125px;

}
h1 {
  mso-style-priority: 9;
  mso-style-link: "Heading 1 Char";
  margin-top: 24.0pt;
  margin-right: 0in;
  margin-bottom: 0in;
  margin-left: 0in;
  margin-bottom: .0001pt;
  page-break-after: avoid;
  font-size: 14.0pt;
  font-family: "Cambria", serif;
  color: gray;
}
td {

}
</style>
"@



# CODE TO SEND EMAIL DIRECTLY THROUGH SCRIPT
#   # Send-MailMessage -To  "Paul.Love@mkcorp.com" -From $EmailFrom -Cc $carbon -Subject $subject -Body $html -BodyAsHtml -SmtpServer $serv

  $eCardBody = "
    <p>Julie,</p>
    <p>Here are the release files for this job.</p>
    <h1>Path to Release Folder</h1>
    <a href='$releaseLink'>$releaseLink</a>
  "
  $eCardBody = ConvertTo-Html -Head $style -Body $eCardBody | Out-String
  $carbon = "Wimberly, Rachel <Rachel.Wimberly@mkcorp.com>"

  $ecSubject = $jobId," ", $jobName, " | ReleaeFilesToJulie" -join ""
  $ol = New-Object -comObject Outlook.Application
  $newmail = $ol.CreateItem(0)
  $newmail.Recipients.Add('Michalak, Julie <Julie.Michalak@mkcorp.com>')
  $newmail.cc = "<Rachel.Wimberly@mkcorp.com>"
  $newmail.Subject =  $ecSubject
  $newmail.HTMLBody = $eCardBody
  $inspector = $newmail.GetInspector
  $inspector.Activate()
