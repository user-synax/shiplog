$modifiedFiles = git diff --name-only
$untrackedFiles = git ls-files --others --exclude-standard
$allFiles = $modifiedFiles + $untrackedFiles

foreach ($file in $allFiles) {
    git add $file
    git commit -m "Add $file"
}