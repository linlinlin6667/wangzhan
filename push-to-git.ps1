# Git远程仓库关联和推送脚本
# 用于帮助用户快速关联远程仓库并推送代码

Write-Host "=== Git远程仓库关联和推送脚本 ===`n" -ForegroundColor Cyan

# 获取远程仓库URL
$remoteUrl = Read-Host "请输入你的远程仓库URL (例如: https://github.com/your-username/personal-website.git)"

# 检查URL格式
if (-not ($remoteUrl -match "^https?://")) {
    Write-Host "错误: 请输入有效的HTTPS URL" -ForegroundColor Red
    exit 1
}

# 添加远程仓库
Write-Host "`n1. 添加远程仓库..." -ForegroundColor Yellow
git remote add origin $remoteUrl
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ 远程仓库添加成功!" -ForegroundColor Green
} else {
    Write-Host "✗ 远程仓库添加失败，请检查URL是否正确" -ForegroundColor Red
    exit 1
}

# 推送代码
Write-Host "`n2. 推送代码到远程仓库..." -ForegroundColor Yellow
git push -u origin master
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ 代码推送成功!" -ForegroundColor Green
    Write-Host "`n=== 推送完成 ===" -ForegroundColor Cyan
    Write-Host "你的代码已经成功推送到远程仓库!" -ForegroundColor White
    Write-Host "下一步: 通过Cloudflare Pages连接Git仓库进行部署" -ForegroundColor White
} else {
    Write-Host "✗ 代码推送失败" -ForegroundColor Red
    Write-Host "错误信息: $LASTEXITCODE" -ForegroundColor Red
    Write-Host "`n可能的解决方法:" -ForegroundColor Yellow
    Write-Host "1. 检查你的网络连接" -ForegroundColor White
    Write-Host "2. 检查远程仓库URL是否正确" -ForegroundColor White
    Write-Host "3. 确保你有仓库的访问权限" -ForegroundColor White
    Write-Host "4. 尝试使用HTTPS URL而不是SSH" -ForegroundColor White
    exit 1
}
