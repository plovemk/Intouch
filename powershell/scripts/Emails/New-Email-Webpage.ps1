
param (
    [string]$jobId,
    [string]$jobName,
    [string]$releaseLink,
    [string]$copyLink
)
$serv = $env.MAIL_SERVE

$carbon = "Wimberly, Rachel <Rachel.Wimberly@mkcorp.com>"
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

$body  = "
<p>$jobId $jobName is ready to release. </p>
<h1>Web Pages &amp; Assets</h1>
<a href='$releaseLink'><p>$releaseLink</p></a>
<h1>Missing Links</h1>
<table>
<p>Missing Copy here</p>
<h1>Copy Documents</h1>
<table>
  <tr>
    <th style='background: #376092;''>English</th>
    <td><a href='$copyLink'>$copyLink</a></td>
  </tr>
  <tr>
    <th style='background: #C0504D;'>Spanish</th>
    <td><a href='$copyLink'>$copyLink</a></td>
  </table>
"
$html = ConvertTo-Html -Head $style -Body $body | Out-String

$subject = $jobId," ", $jobName,  " || ReleaseAllFilesToMerchandisers" -join ""
$ol = New-Object -comObject Outlook.Application
$newmail = $ol.CreateItem(0)
$newmail.Recipients.Add('InTouchReleaseToIST <InTouchReleaseToIST@mkcorp.com>')
$newmail.cc = "<Rachel.Wimberly@mkcorp.com>"
$newmail.Subject =  $subject
$newmail.HTMLBody = $html
$inspector = $newmail.GetInspector
$inspector.Activate()
