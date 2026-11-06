Add-Type -AssemblyName System.Drawing

$bitmap = New-Object System.Drawing.Bitmap 1200, 630
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$background = [System.Drawing.ColorTranslator]::FromHtml('#131315')
$ink = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml('#e9e9ed'))
$accent = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml('#ffb114'))
$muted = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml('#a1a1ab'))
$small = New-Object System.Drawing.Font 'Arial', 23
$large = New-Object System.Drawing.Font 'Arial', 68
$caption = New-Object System.Drawing.Font 'Arial', 20

try {
    $graphics.Clear($background)
    $graphics.DrawString('goodrocket.ru / дизайн и разработка', $small, $ink, 65, 60)
    $graphics.DrawString('От идеи', $large, $ink, 60, 175)
    $graphics.DrawString('к результату.', $large, $accent, 60, 280)
    $graphics.DrawString('Сайты, сервисы и Telegram-боты', $small, $muted, 65, 440)
    $graphics.DrawString('Проектируем. Разрабатываем. Запускаем.', $caption, $muted, 65, 555)
    $bitmap.Save((Join-Path $PSScriptRoot '../public/og.png'), [System.Drawing.Imaging.ImageFormat]::Png)
} finally {
    $small.Dispose()
    $large.Dispose()
    $caption.Dispose()
    $ink.Dispose()
    $accent.Dispose()
    $muted.Dispose()
    $graphics.Dispose()
    $bitmap.Dispose()
}
