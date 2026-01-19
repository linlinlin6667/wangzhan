# 自动化同步脚本
# 将本地仓库同步到GitHub Desktop仓库

# 设置
$localRepo = "E:\wangzhan"
$githubRepo = "E:\Github\wangzhan"

# 需要同步的文件
$filesToSync = @(
    "admin.html",
    "index.html",
    "tools-upload.html",
    "projects-upload.html",
    "css/style.css",
    "js/main.js",
    "images/hero.jpg",
    "images/profile.jpg"
)

# 需要排除的文件
$filesToExclude = @(
    "index-optimized.html",
    "main-optimized.js",
    "admin-style.css",
    "style-optimized.css",
    "tools-upload.css",
    "performance-monitor.js",
    "test-api.js",
    "worker/",
    "wrangler.toml",
    ".gitignore",
    ".htaccess",
    "API_TEST_REPORT.md",
    "FINAL_DEPLOYMENT_GUIDE.md",
    "OPTIMIZATION_SUMMARY.md",
    "PERFORMANCE_OPTIMIZATION.md",
    "README.md",
    "api-test.html",
    "data.json"
)

# 同步函数
function Sync-Files {
    param(
        [string]$SourcePath,
        [string]$DestPath,
        [string[]]$FilesToSync,
        [string[]]$FilesToExclude
    )
    
    Write-Host "开始同步文件..." -ForegroundColor Green
    
    foreach ($file in $FilesToSync) {
        $sourceFile = Join-Path $SourcePath $file
        $destFile = Join-Path $DestPath $file
        
        # 检查文件是否存在于源目录
        if (Test-Path $sourceFile) {
            # 检查文件是否需要排除
            $shouldExclude = $false
            foreach ($exclude in $FilesToExclude) {
                if ($file -eq $exclude) {
                    $shouldExclude = $true
                    break
                }
            }
            
            if (-not $shouldExclude) {
                # 检查目标目录中的文件是否存在
                if (Test-Path $destFile) {
                    # 比较文件修改时间
                    $sourceTime = (Get-Item $sourceFile).LastWriteTime
                    $destTime = (Get-Item $destFile).LastWriteTime
                    
                    if ($sourceTime -gt $destTime) {
                        Write-Host "  更新: $file" -ForegroundColor Yellow
                        Copy-Item -Path $sourceFile -Destination $destFile -Force
                    } else {
                        Write-Host "  跳过: $file (未修改)" -ForegroundColor Gray
                    }
                } else {
                    Write-Host "  复制: $file" -ForegroundColor Cyan
                    Copy-Item -Path $sourceFile -Destination $destFile -Force
                }
            } else {
                Write-Host "  排除: $file" -ForegroundColor Red
            }
        } else {
            Write-Host "  不存在: $file" -ForegroundColor Red
        }
    }
    
    Write-Host "同步完成！" -ForegroundColor Green
}

# 执行同步
Sync-Files -SourcePath $localRepo -DestPath $githubRepo -FilesToSync $filesToSync -FilesToExclude $filesToExclude

# 询问是否要推送到GitHub
$pushToGitHub = Read-Host "是否要推送到GitHub？(y/n): " -ForegroundColor Yellow
if ($pushToGitHub -eq 'y' -or $pushToGitHub -eq 'Y') {
    Write-Host "请手动在GitHub Desktop中推送更改" -ForegroundColor Green
} else {
    Write-Host "跳过推送" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "按任意键退出..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
Write-Host ""