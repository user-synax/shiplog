$files = git ls-files --others --modified --exclude-standard
$i = 1
foreach ($file in $files) {
    Write-Host "Committing file $i/101: $file"
    git add "$file"
    git commit -m "Add/Update: $file"
    $i++
}
Write-Host "All 101 commits completed!"
