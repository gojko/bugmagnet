$ErrorActionPreference = 'Stop'

npm run install-deps
npm run pack-extension

$zipPath = Join-Path $PSScriptRoot 'bugmagnet-extension.zip'
if (Test-Path $zipPath) {
    Remove-Item $zipPath
}
Compress-Archive -Path "$PSScriptRoot\pack\*" -DestinationPath $zipPath
Write-Host "Created $zipPath"
