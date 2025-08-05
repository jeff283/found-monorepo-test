#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Upload environment variables from .env files to GitHub repository secrets

.DESCRIPTION
    This script can either scan for .env files in the current directory or use a specific file path.
    It parses the file and uploads each key-value pair as a GitHub secret using GitHub CLI.

.PARAMETER EnvFile
    Specific path to the .env file to upload (relative to current directory)

.PARAMETER Scan
    Scan current directory for .env files and let user choose

.EXAMPLE
    .\upload-secrets.ps1 -EnvFile ".env.actions"
    
.EXAMPLE
    .\upload-secrets.ps1 -Scan
    
.EXAMPLE
    .\upload-secrets.ps1
    # Will prompt for file selection if multiple .env files found
#>

param(
    [Parameter(Mandatory=$false)]
    [string]$EnvFile,
    
    [Parameter(Mandatory=$false)]
    [switch]$Scan
)

# Colors for output
$Green = "`e[32m"
$Red = "`e[31m"
$Yellow = "`e[33m"
$Blue = "`e[34m"
$Cyan = "`e[36m"
$Reset = "`e[0m"

function Write-ColorOutput {
    param([string]$Message, [string]$Color = $Reset)
    Write-Host "$Color$Message$Reset"
}

function Get-EnvFiles {
    $envFiles = Get-ChildItem -Name "*.env*" -File | Where-Object { $_ -match "\.env" }
    return $envFiles
}

function Select-EnvFile {
    param([array]$envFiles)
    
    if ($envFiles.Count -eq 0) {
        Write-ColorOutput "❌ No .env files found in current directory!" $Red
        Write-ColorOutput "💡 Available files:" $Blue
        Get-ChildItem -Name "*env*" | ForEach-Object { Write-Host "   $_" }
        exit 1
    }
    
    if ($envFiles.Count -eq 1) {
        Write-ColorOutput "📁 Found one .env file: $($envFiles[0])" $Cyan
        return $envFiles[0]
    }
    
    Write-ColorOutput "📁 Multiple .env files found:" $Blue
    for ($i = 0; $i -lt $envFiles.Count; $i++) {
        Write-Host "   [$($i + 1)] $($envFiles[$i])"
    }
    
    do {
        Write-Host ""
        $choice = Read-Host "Select file number (1-$($envFiles.Count))"
        $index = [int]$choice - 1
    } while ($index -lt 0 -or $index -ge $envFiles.Count)
    
    return $envFiles[$index]
}

function Test-GitHubCli {
    try {
        $ghVersion = gh --version 2>$null
        if ($LASTEXITCODE -ne 0) {
            throw "GitHub CLI not found"
        }
        Write-ColorOutput "✅ GitHub CLI detected: $($ghVersion.Split("`n")[0])" $Green
        return $true
    }
    catch {
        Write-ColorOutput "❌ GitHub CLI not found or not authenticated!" $Red
        Write-ColorOutput "💡 Install: winget install --id GitHub.cli" $Yellow
        Write-ColorOutput "💡 Then run: gh auth login" $Yellow
        return $false
    }
}

function Test-RepoContext {
    try {
        $repoInfo = gh repo view --json nameWithOwner,url 2>$null | ConvertFrom-Json
        Write-ColorOutput "🏠 Repository: $($repoInfo.nameWithOwner)" $Cyan
        Write-ColorOutput "🔗 URL: $($repoInfo.url)" $Blue
        return $true
    }
    catch {
        Write-ColorOutput "❌ Not in a GitHub repository or not authenticated!" $Red
        Write-ColorOutput "💡 Make sure you're in the repo directory and run: gh auth login" $Yellow
        return $false
    }
}

function Upload-SecretsFromFile {
    param([string]$FilePath)
    
    if (-not (Test-Path $FilePath)) {
        Write-ColorOutput "❌ File not found: $FilePath" $Red
        return
    }
    
    Write-ColorOutput "🔐 Processing file: $FilePath" $Blue
    
    $content = Get-Content $FilePath -Raw
    $lines = $content -split "`n"
    
    $successCount = 0
    $errorCount = 0
    $skippedCount = 0
    
    Write-Host ""
    Write-ColorOutput "📤 Uploading secrets..." $Yellow
    Write-Host ""
    
    foreach ($line in $lines) {
        $line = $line.Trim()
        
        # Skip comments, empty lines, and section headers
        if ($line -match "^#" -or $line -eq "" -or $line -match "^=+$") {
            continue
        }
        
        # Parse key=value
        if ($line -match "^([^=]+)=(.*)$") {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            
            # Remove quotes from value
            $value = $value -replace '^"', '' -replace '"$', ''
            
            # Skip if value is empty
            if ([string]::IsNullOrWhiteSpace($value)) {
                Write-ColorOutput "⚠️  Skipping $key (empty value)" $Yellow
                $skippedCount++
                continue
            }
            
            # Upload secret
            Write-Host "Setting $key... " -NoNewline
            try {
                $result = gh secret set $key --body $value 2>&1
                if ($LASTEXITCODE -eq 0) {
                    Write-ColorOutput "✅" $Green
                    $successCount++
                } else {
                    Write-ColorOutput "❌ ($result)" $Red
                    $errorCount++
                }
            }
            catch {
                Write-ColorOutput "❌ ($_)" $Red
                $errorCount++
            }
        }
    }
    
    # Summary
    Write-Host ""
    Write-ColorOutput "📊 Upload Summary:" $Blue
    Write-ColorOutput "✅ Successfully uploaded: $successCount secrets" $Green
    Write-ColorOutput "❌ Errors: $errorCount" $Red
    Write-ColorOutput "⚠️  Skipped: $skippedCount" $Yellow
    
    if ($errorCount -eq 0) {
        Write-ColorOutput "🎉 All secrets uploaded successfully!" $Green
    } else {
        Write-ColorOutput "⚠️  Some secrets failed to upload. Check your permissions." $Yellow
    }
}

# Main execution
Write-ColorOutput "🚀 GitHub Secrets Uploader" $Blue
Write-ColorOutput "================================" $Blue

# Check prerequisites
if (-not (Test-GitHubCli)) { exit 1 }
if (-not (Test-RepoContext)) { exit 1 }

# Determine which file to use
$selectedFile = $null

if ($EnvFile) {
    # Use specified file
    $selectedFile = $EnvFile
    Write-ColorOutput "📁 Using specified file: $selectedFile" $Cyan
} elseif ($Scan) {
    # Scan and select
    $envFiles = Get-EnvFiles
    $selectedFile = Select-EnvFile $envFiles
} else {
    # Auto-detect behavior
    $envFiles = Get-EnvFiles
    if ($envFiles.Count -eq 1) {
        $selectedFile = $envFiles[0]
        Write-ColorOutput "📁 Auto-detected: $selectedFile" $Cyan
    } else {
        $selectedFile = Select-EnvFile $envFiles
    }
}

# Confirm before upload
Write-Host ""
Write-ColorOutput "⚠️  About to upload secrets from: $selectedFile" $Yellow
$confirm = Read-Host "Continue? (y/N)"

if ($confirm -notmatch "^[yY]") {
    Write-ColorOutput "❌ Upload cancelled." $Red
    exit 0
}

# Upload secrets
Upload-SecretsFromFile $selectedFile

Write-Host ""
Write-ColorOutput "✨ Done!" $Green
