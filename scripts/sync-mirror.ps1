# Mirrors the "hosting" remote (GitHub, source of Dependabot/Lighthouse commits)
# back onto the "origin" remote (OneDev) when it is a clean fast-forward.
# Run manually or via the "PortfolioSiteMirrorSync" scheduled task.

$ErrorActionPreference = 'Stop'

$repoPath = 'D:\_programming\Portolio-Website'
$logFile = Join-Path $repoPath 'scripts\sync-mirror.log'

function Write-Log {
    param([string]$Message)
    $timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    "$timestamp $Message" | Out-File -FilePath $logFile -Append -Encoding utf8
}

try {
    Set-Location $repoPath

    git fetch origin --quiet 2>&1 | Out-Null
    git fetch hosting --quiet 2>&1 | Out-Null

    $originHead = (git rev-parse origin/master).Trim()
    $hostingHead = (git rev-parse hosting/master).Trim()

    if ($originHead -eq $hostingHead) {
        Write-Log "In sync at $originHead - nothing to do."
        exit 0
    }

    git merge-base --is-ancestor origin/master hosting/master
    if ($LASTEXITCODE -ne 0) {
        Write-Log "SKIPPED: origin/master ($originHead) is not an ancestor of hosting/master ($hostingHead) - history has diverged, needs manual resolution."
        exit 1
    }

    $pushOutput = git push origin "hosting/master:master" 2>&1 | Out-String
    Write-Log "Synced origin/master $originHead -> $hostingHead"
    Write-Log $pushOutput.Trim()
}
catch {
    Write-Log "ERROR: $_"
    exit 1
}
