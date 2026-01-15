# 网站文件验证脚本
# 用于检查部署所需的所有必要文件是否存在

Write-Host "=== 网站文件验证脚本 ===`n" -ForegroundColor Cyan

# 设置工作目录
$workDir = "E:\wangzhan"
Set-Location $workDir

# 定义必需文件列表
$requiredFiles = @(
    # HTML文件
    "index.html",
    "admin.html",
    "test-api.html",
    "tools.html",
    
    # CSS文件
    "css\admin-style.css",
    "css\personal-style.css",
    
    # JavaScript文件
    "js\admin-main.js",
    "js\personal-main.js",
    
    # 图片文件
    "images\hero.jpg",
    "images\profile.jpg",
    
    # Worker文件
    "worker\index.js",
    "worker\wrangler.toml",
    
    # 配置文件
    ".htaccess",
    "wrangler.json"
)

# 初始化计数器
$totalFiles = $requiredFiles.Count
$missingFiles = @()
$foundFiles = @()

# 检查每个文件
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        $foundFiles += $file
        Write-Host "✓ 找到: $file" -ForegroundColor Green
    } else {
        $missingFiles += $file
        Write-Host "✗ 缺失: $file" -ForegroundColor Red
    }
}

Write-Host "`n=== 验证结果 ===" -ForegroundColor Cyan
Write-Host "总文件数: $totalFiles" -ForegroundColor White
Write-Host "找到文件: $($foundFiles.Count)" -ForegroundColor Green
Write-Host "缺失文件: $($missingFiles.Count)" -ForegroundColor Red

if ($missingFiles.Count -eq 0) {
    Write-Host "`n✅ 所有必需文件都已找到，可以开始部署！" -ForegroundColor Green
    Write-Host "`n下一步操作："
    Write-Host "1. 查看最终部署指南: FINAL_DEPLOYMENT_GUIDE.md" -ForegroundColor Cyan
    Write-Host "2. 执行部署步骤" -ForegroundColor Cyan
} else {
    Write-Host "`n❌ 存在缺失文件，请检查并补充后再部署！" -ForegroundColor Red
    Write-Host "`n缺失文件列表：" -ForegroundColor Yellow
    foreach ($file in $missingFiles) {
        Write-Host "- $file" -ForegroundColor Yellow
    }
}

Write-Host "`n=== 脚本执行完毕 ===" -ForegroundColor Cyan
