$filePath = "docencia-4.0\leccion2_1.html"
$fixPath = "C:\Users\Carmelo Allende\.gemini\antigravity\brain\65643c05-4976-4e1a-865a-a6faf00adb9e\scratch\script_fix.txt"

$content = Get-Content $filePath -Raw -Encoding UTF8
$fix = Get-Content $fixPath -Raw -Encoding UTF8

# Find the last <script> tag (not module)
$pattern = '(?s)<script>(?!.*?<script>).*?</script>'
$newScript = "<script>`r`n" + $fix + "    </script>"

$content = [regex]::Replace($content, $pattern, $newScript)

$content | Set-Content $filePath -NoNewline -Encoding UTF8
