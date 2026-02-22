#!/usr/bin/env pwsh
# Build resume.pdf from resume.html using a local headless browser (Edge/Chrome).
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$resumeHtml = Join-Path $scriptDir 'resume.html'
$resumePdf = Join-Path $scriptDir 'resume.pdf'

Write-Output "Using working folder: $scriptDir"

# find msedge or chrome
$candidates = @(
  "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
  "$env:ProgramFiles(x86)\Microsoft\Edge\Application\msedge.exe",
  "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
  "$env:ProgramFiles(x86)\Google\Chrome\Application\chrome.exe"
)
$browser = $candidates | Where-Object { Test-Path $_ } | Select-Object -First 1
if(-not $browser){ Write-Error "No Edge/Chrome found. Please install Microsoft Edge or Google Chrome."; exit 2 }

Write-Output "Found browser: $browser"

$fileUrl = "file:///$($resumeHtml -replace '\\','/')"
Write-Output "Rendering $fileUrl -> $resumePdf"

& $browser --headless --disable-gpu --print-to-pdf="$resumePdf" $fileUrl

Start-Sleep -Seconds 1
if(Test-Path $resumePdf){
  Write-Output "PDF created: $resumePdf"
  # remove the temporary HTML per preference
  Remove-Item $resumeHtml -Force -ErrorAction SilentlyContinue
  Write-Output "Temporary resume.html removed."
} else {
  Write-Error "PDF not created. You can open resume.html in your browser and print to PDF manually."
}
