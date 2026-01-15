# 个人网站最终部署指南

## 目录

1. [准备工作](#准备工作)
2. [快速部署步骤](#快速部署步骤)
3. [通过Git仓库上传](#通过git仓库上传)
4. [详细部署步骤](#详细部署步骤)
   1. [步骤1：部署Cloudflare Pages](#步骤1部署cloudflare-pages)
   2. [步骤2：创建D1数据库](#步骤2创建d1数据库)
   3. [步骤3：部署Cloudflare Worker](#步骤3部署cloudflare-worker)
   4. [步骤4：配置D1数据库绑定](#步骤4配置d1数据库绑定)
   5. [步骤5：更新API URL配置](#步骤5更新api-url配置)
   6. [步骤6：测试和验证](#步骤6测试和验证)
   7. [步骤7：配置自定义域名（可选）](#步骤7配置自定义域名可选)
5. [常见问题排查](#常见问题排查)
6. [附加资源](#附加资源)

## 准备工作

### 1.1 注册Cloudflare账户
- 访问 [Cloudflare官网](https://www.cloudflare.com/)
- 点击右上角 "Sign Up"
- 填写邮箱和密码，完成注册

### 1.2 安装Wrangler CLI
- 确保已安装Node.js (版本16+)
- 打开**管理员模式**的命令提示符或PowerShell
- 运行以下命令安装Wrangler CLI：
  ```powershell
  E:\nodejs\npm.cmd install -g wrangler
  ```

#### 安装故障排除
如果遇到权限错误：
1. 确保使用**管理员模式**运行命令行
2. 关闭所有可能占用npm目录的程序
3. 尝试清理npm缓存：
   ```powershell
   E:\nodejs\npm.cmd cache clean --force
   ```
4. 重新尝试安装

### 1.3 登录Wrangler
- 运行以下命令登录Cloudflare：
  ```powershell
  wrangler login
  ```
- 在浏览器中授权登录

## 快速部署步骤

### 使用命令提示符(cmd.exe)快速部署

1. **部署Cloudflare Pages**
   - 访问 [Cloudflare Pages](https://dash.cloudflare.com/?to=/:account/pages)
   - 点击 "Create project" → "Direct Upload"
   - 上传 `E:\wangzhan` 目录下的所有文件和文件夹
   - 记录下Pages域名

2. **创建D1数据库**
   - 访问 [Cloudflare D1](https://dash.cloudflare.com/?to=/:account/workers/d1)
   - 点击 "Create database"，输入名称（例如：`personal-website-db`）
   - 记录下数据库ID

3. **部署Worker**
   ```cmd
   e:               # 切换到E盘
   cd E:\wangzhan\worker  # 进入Worker目录
   wrangler login   # 登录Cloudflare
   wrangler deploy  # 部署Worker
   ```
   - 记录下Worker域名

4. **更新API URL**
   - 编辑 `E:\wangzhan` 目录下的所有HTML文件
   - 替换API_URL为你的Worker域名
   - 重新部署Cloudflare Pages

5. **测试网站**
   - 访问 `你的Pages域名/test-api.html`
   - 点击 "测试API连接" 按钮，确认连接成功

## 通过Git仓库上传

### 1. 创建远程Git仓库

#### GitHub
1. 访问 [GitHub](https://github.com/)
2. 点击右上角 "+" → "New repository"
3. 输入仓库名称（例如：`personal-website`）
4. 选择 "Public" 或 "Private"
5. 不要初始化README或.gitignore（我们已经有了）
6. 点击 "Create repository"
7. 记录下仓库URL（例如：`https://github.com/your-username/personal-website.git`）

#### GitLab
1. 访问 [GitLab](https://gitlab.com/)
2. 点击右上角 "+" → "New project"
3. 输入仓库名称（例如：`personal-website`）
4. 选择可见性级别
5. 不要初始化README或.gitignore
6. 点击 "Create project"
7. 记录下仓库URL

### 2. 关联本地仓库

1. 打开命令提示符(cmd.exe)，进入项目目录：
   ```cmd
   e:               # 切换到E盘
   cd E:\wangzhan    # 进入项目目录
   ```

2. 配置Git用户信息：
   ```cmd
   git config --global user.name "你的用户名"
   git config --global user.email "你的邮箱"
   ```

3. 添加远程仓库：
   ```cmd
   git remote add origin 你的仓库URL
   ```
   例如：
   ```cmd
   git remote add origin https://github.com/your-username/personal-website.git
   ```

### 3. 提交代码

1. 添加所有文件到暂存区：
   ```cmd
   git add .
   ```

2. 提交代码：
   ```cmd
   git commit -m "Initial commit"
   ```

3. 推送到远程仓库：
   ```cmd
   git push -u origin main
   ```
   或如果使用master分支：
   ```cmd
   git push -u origin master
   ```

### 4. 通过Git部署到Cloudflare Pages

1. 访问 [Cloudflare Pages](https://dash.cloudflare.com/?to=/:account/pages)
2. 点击 "Create project"
3. 选择 "Connect to Git"
4. 选择你的Git提供商（GitHub/GitLab）
5. 授权Cloudflare访问你的仓库
6. 选择你刚刚创建的仓库
7. 点击 "Begin setup"

8. **构建设置**：
   - **Build command**: 留空
   - **Build output directory**: 留空
   - **Root directory**: 留空
   - **Branch to deploy**: 选择 `main` 或 `master`

9. 点击 "Save and Deploy"

10. 等待部署完成，记录下你的Pages域名

### 5. 后续更新流程

当你修改了代码后，可以通过以下步骤更新网站：

1. 添加修改的文件：
   ```cmd
   git add .
   ```

2. 提交修改：
   ```cmd
   git commit -m "描述你的修改"
   ```

3. 推送到远程仓库：
   ```cmd
   git push
   ```

4. Cloudflare Pages会自动检测到推送并重新部署

## 详细部署步骤

### 步骤1：部署Cloudflare Pages

#### 1.1 访问Cloudflare Pages控制台
- 登录Cloudflare后，点击左侧菜单中的 "Workers & Pages"
- 点击顶部 "Pages" 标签页

#### 1.2 创建新的Pages项目
- 点击 "Create project" 按钮
- 选择 "Direct Upload" 选项
- 点击 "Upload assets" 按钮

#### 1.3 上传网站文件
1. 在文件选择对话框中，进入 `e:\wangzhan` 目录
2. 选择以下文件和文件夹：
   - `.htaccess`
   - `admin.html`
   - `index.html`
   - `test-api.html`
   - `tools.html`
   - `css` 文件夹
   - `images` 文件夹
   - `js` 文件夹
   - `wrangler.json`
3. 点击 "Open" 按钮开始上传

#### 1.4 配置构建设置
- **Build command**: 留空
- **Build output directory**: 留空
- **Root directory**: 留空
- 点击 "Save and Deploy" 按钮

#### 1.5 等待部署完成
- 部署过程可能需要1-2分钟
- 部署完成后，点击 "Continue to project"
- 记录下你的Pages域名（例如：`your-project.pages.dev`）

### 步骤2：创建D1数据库

#### 2.1 访问D1数据库控制台
- 在Cloudflare左侧菜单中，点击 "Workers & Pages"
- 点击顶部 "D1" 标签页

#### 2.2 创建新的D1数据库
1. 点击 "Create database" 按钮
2. **Database name**: 输入数据库名称（例如：`personal-website-db`）
3. **Database alias**: 输入别名（例如：`DB`）
4. 点击 "Create"

#### 2.3 获取数据库ID
- 数据库创建完成后，点击数据库名称进入详情页
- 在 "Settings" 标签页中，找到 "Database ID" 并记录下来

### 步骤3：部署Cloudflare Worker

#### 3.1 配置Worker文件
1. 打开 `e:\wangzhan\worker\wrangler.toml` 文件
2. 确保内容如下：
   ```toml
   name = "personal-website-api"
   main = "index.js"
   compatibility_date = "2023-09-01"

   [[d1_databases]]
   binding = "DB"
   database_name = "personal-website-db"
   database_id = "你的数据库ID"  # 替换为实际ID
   ```
3. 将 `数据库ID` 替换为你在步骤2.3中记录的D1数据库ID

#### 3.2 部署Worker（方法一：使用Wrangler CLI）
1. 打开**管理员模式**的命令提示符或PowerShell
2. 进入Worker目录：
   ```powershell
   cd e:\wangzhan\worker
   ```
3. 运行部署命令：
   ```powershell
   wrangler deploy
   ```
4. 等待部署完成
5. 部署成功后，记录下你的Worker域名（例如：`personal-website-api.your-subdomain.workers.dev`）

#### 3.3 部署Worker（方法二：手动部署）
如果Wrangler CLI安装遇到问题，可以使用Cloudflare控制台手动部署：

1. 访问Cloudflare控制台，点击左侧菜单中的 "Workers & Pages"
2. 点击顶部 "Workers" 标签页
3. 点击 "Create Worker" 按钮
4. **Worker name**: 输入Worker名称（例如：`personal-website-api`）
5. 点击 "Deploy"
6. 部署完成后，点击 "Edit code"
7. 删除默认代码，粘贴 `worker/index.js` 文件的完整内容
8. 点击 "Save and deploy"
9. 记录下你的Worker域名

### 步骤4：配置D1数据库绑定

#### 4.1 访问Worker控制台
- 在Cloudflare左侧菜单中，点击 "Workers & Pages"
- 点击顶部 "Workers" 标签页
- 点击你的Worker名称进入详情页

#### 4.2 添加D1绑定
1. 点击 "Settings" 标签页
2. 点击左侧菜单中的 "Variables"
3. 向下滚动找到 "D1 database bindings" 部分
4. 点击 "Add binding"
5. **Variable name**: 输入 `DB`
6. **Database**: 从下拉菜单中选择你创建的D1数据库
7. 点击 "Save"

### 步骤5：更新API URL配置

#### 5.1 更新HTML文件中的API URL
1. 打开 `e:\wangzhan\index.html` 文件
2. 找到以下代码行：
   ```html
   <script>const API_URL = 'https://personal-website-api.1950837615.workers.dev';</script>
   ```
3. 将URL替换为你的Worker域名
4. 同样更新 `admin.html`、`test-api.html` 和 `tools.html` 文件中的API_URL

#### 5.2 重新部署Cloudflare Pages
- 回到Cloudflare Pages控制台
- 点击你的项目名称
- 点击 "Deployments" 标签页
- 点击 "Upload assets" 按钮
- 重新上传所有更新后的HTML文件
- 点击 "Save and Deploy"

### 步骤6：测试和验证

#### 6.1 测试网站访问
- 在浏览器中访问你的Pages域名（例如：`your-project.pages.dev`）
- 确认网站能正常加载

#### 6.2 测试API连接
1. 访问 `your-project.pages.dev/test-api.html`
2. 点击 "测试API连接" 按钮
3. 确认显示 "API连接成功！"

#### 6.3 测试数据库连接
1. 在test-api.html页面中，点击 "测试数据库连接" 按钮
2. 确认显示数据库连接状态

#### 6.4 测试CRUD操作
1. 访问 `your-project.pages.dev/admin.html`
2. 尝试添加一条数据
3. 确认数据能正常保存
4. 尝试查看、编辑和删除数据

### 步骤7：配置自定义域名（可选）

#### 7.1 添加自定义域名
- 在Cloudflare Pages控制台中，点击你的项目
- 点击 "Custom domains" 标签页
- 点击 "Set up a custom domain"
- 输入你的域名（例如：`example.com`）
- 点击 "Continue"

#### 7.2 更新DNS记录
- 根据Cloudflare提供的DNS记录，在你的域名注册商处更新DNS设置
- 等待DNS记录生效（通常需要5-10分钟）

## 常见问题排查

### 1. API连接失败
- **原因**：API_URL配置错误
- **解决**：检查HTML文件中的API_URL是否正确指向你的Worker域名

### 2. 数据库连接错误
- **原因**：D1绑定配置错误
- **解决**：检查Worker的D1绑定是否正确配置，变量名为`DB`

### 3. Worker部署失败
- **原因**：wrangler.toml配置错误
- **解决**：检查wrangler.toml中的数据库ID是否正确

### 4. Pages部署失败
- **原因**：文件上传不完整
- **解决**：确保所有必要文件都已上传

### 5. CORS错误
- **原因**：Worker未配置CORS headers
- **解决**：检查worker/index.js中的CORS配置，确保包含正确的headers

### 6. wrangler命令无法执行
- **原因**：PowerShell执行策略问题
- **解决**：使用命令提示符(cmd.exe)代替PowerShell

## 附加资源

- [Cloudflare Pages文档](https://developers.cloudflare.com/pages/)
- [Cloudflare Workers文档](https://developers.cloudflare.com/workers/)
- [Cloudflare D1文档](https://developers.cloudflare.com/d1/)
- [Wrangler CLI文档](https://developers.cloudflare.com/workers/wrangler/)

## 联系支持

- 如果遇到问题，可以访问 [Cloudflare社区](https://community.cloudflare.com/)
- 或在Cloudflare控制台中点击右下角的 "?" 按钮获取支持
