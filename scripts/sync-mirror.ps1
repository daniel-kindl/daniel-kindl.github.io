# Mirrors the "hosting" remote (GitHub, source of Dependabot/Lighthouse commits and
# semantic-release tags) back onto the "origin" remote (OneDev) when it is a clean fast-forward.
# Run manually or via the "PortfolioSiteMirrorSync" scheduled task.

$ErrorActionPreference = 'Stop'

$repoPath = 'D:\_programming\Portolio-Website'
$logFile = Join-Path $repoPath 'scripts\sync-mirror.log'

function Write-Log {
    param([string]$Message)
    $timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    "$timestamp $Message" | Out-File -FilePath $logFile -Append -Encoding utf8
}

function Get-TagMap {
    param([string[]]$Lines)
    $map = @{}
    foreach ($line in $Lines) {
        if ($line -match '^(?<sha>[0-9a-f]{40})\s+refs/tags/(?<name>.+?)(?<peeled>\^\{\})?$') {
            $name = $Matches['name']
            $sha  = $Matches['sha']
            # Prefer the peeled (^{}) commit SHA for annotated tags - that's the commit
            # the tag actually points to, which is what "in sync" should mean.
            if ($Matches['peeled'] -or -not $map.ContainsKey($name)) {
                $map[$name] = $sha
            }
        }
    }
    return $map
}

function Sync-Tags {
    try {
        Write-Log "Checking for tags on hosting not yet present on origin..."

        $hostingTagsRaw = git ls-remote --tags hosting 2>&1
        $originTagsRaw  = git ls-remote --tags origin 2>&1

        $hostingTags = Get-TagMap $hostingTagsRaw
        $originTags  = Get-TagMap $originTagsRaw

        $missing = @()
        foreach ($name in $hostingTags.Keys) {
            if (-not $originTags.ContainsKey($name)) {
                $missing += $name
            }
            elseif ($originTags[$name] -ne $hostingTags[$name]) {
                Write-Log "WARNING: tag '$name' points to different commits on origin ($($originTags[$name])) vs hosting ($($hostingTags[$name])) - skipping, needs manual resolution."
            }
        }

        if ($missing.Count -eq 0) {
            Write-Log "Tags already in sync - nothing to push."
            return
        }

        foreach ($name in $missing) {
            $pushOutput = git push origin "refs/tags/$name" 2>&1 | Out-String
            Write-Log "Pushed missing tag '$name' ($($hostingTags[$name])) to origin."
            Write-Log $pushOutput.Trim()
        }
    }
    catch {
        Write-Log "ERROR (tag sync): $_"
    }
}

try {
    Set-Location $repoPath

    git fetch origin --tags --quiet 2>&1 | Out-Null
    git fetch hosting --tags --quiet 2>&1 | Out-Null

    Sync-Tags

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
