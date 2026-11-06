$ErrorActionPreference = 'Stop'
$fontRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../public/fonts'))
[IO.Directory]::CreateDirectory($fontRoot) | Out-Null
$fontUri = 'https://fonts.googleapis.com/css2?family=Geologica:wght@400..700&family=Golos+Text:wght@400..700&display=swap'
$fontCss = (Invoke-WebRequest -Uri $fontUri -UserAgent 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36').Content
$fontBlocks = [regex]::Matches($fontCss, '(?s)/\*\s*(cyrillic|latin)\s*\*/\s*(@font-face\s*\{.*?\})')
if ($fontBlocks.Count -ne 4) { throw ('Expected four font subsets; got ' + $fontBlocks.Count + '. Response: ' + $fontCss.Substring(0, [Math]::Min(800, $fontCss.Length))) }
$localBlocks = @()
foreach ($fontBlock in $fontBlocks) {
    $subset = $fontBlock.Groups[1].Value
    $face = $fontBlock.Groups[2].Value
    $family = [regex]::Match($face, "font-family:\s*'([^']+)'").Groups[1].Value
    $sourceUri = [regex]::Match($face, 'url\(([^)]+)\)').Groups[1].Value
    if (-not $sourceUri.StartsWith('https://fonts.gstatic.com/')) { throw 'Unexpected font source' }
    $filename = $family.ToLowerInvariant().Replace(' ', '-') + '-' + $subset + '.woff2'
    Invoke-WebRequest -Uri $sourceUri -OutFile (Join-Path $fontRoot $filename)
    $localBlocks += $face.Replace($sourceUri, ('/fonts/' + $filename))
}
Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/google/fonts/main/ofl/golostext/OFL.txt' -OutFile (Join-Path $fontRoot 'golos-text-OFL.txt')
Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/google/fonts/main/ofl/geologica/OFL.txt' -OutFile (Join-Path $fontRoot 'geologica-OFL.txt')
[IO.File]::WriteAllText((Join-Path $PSScriptRoot '../src/fonts.css'), ($localBlocks -join "`n`n"), (New-Object Text.UTF8Encoding $false))
Write-Output 'Installed local Geologica and Golos Text subsets with OFL licenses.'
