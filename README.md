# 个人网站部署指南

这是一个使用HTML、CSS和JavaScript开发的个人网站，通过Cloudflare Pages部署，并使用Cloudflare Workers实现API功能。

## 目录结构

```
.
├── .github/workflows/       # GitHub Actions配置
├── css/                     # 样式文件
├── images/                  # 图片资源
├── js/                      # JavaScript文件
├── worker/                  # Cloudflare Worker API
├── .htaccess               # Apache配置文件
├── index.html              # 网站首页
├── tools.html              # 工具页面
├── wrangler.json           # Cloudflare Pages配置
└── README.md               # 项目说明文档
```

## 部署步骤

### 1. 部署Cloudflare Worker API

#### 步骤1：安装Wrangler

```bash
npm install -g wrangler@latest
```

#### 步骤2：登录Cloudflare

```bash
wrangler login
```

#### 步骤3：部署Worker

```bash
cd worker
wrangler deploy
```

#### 步骤4：获取Worker域名

部署完成后，你将获得一个Worker域名，类似于：
```
https://your-worker.your-username.workers.dev
```

### 2. 配置前端代码

修改`index.html`和`tools.html`中的API_URL变量，替换为你的Worker域名：

```javascript
const API_URL = 'https://your-worker.your-username.workers.dev';
```

### 3. 部署前端到Cloudflare Pages

#### 选项1：使用GitHub Actions部署

1. 将代码推送到GitHub仓库
2. 在Cloudflare控制台中创建Pages项目，连接到GitHub仓库
3. 配置构建设置：
   - 构建命令：留空
   - 构建输出目录：留空或填写 `.`
   - 根目录：留空或填写 `.`
4. 在GitHub仓库中添加以下Secrets：
   - `CLOUDFLARE_API_TOKEN`：你的Cloudflare API令牌
   - `CLOUDFLARE_ACCOUNT_ID`：你的Cloudflare账户ID

#### 选项2：手动部署

1. 登录Cloudflare控制台
2. 创建Pages项目
3. 点击"Upload assets"上传所有前端文件
4. 配置构建设置：
   - 构建命令：留空
   - 构建输出目录：留空或填写 `.`

### 4. 配置自定义域名

1. 在Cloudflare Pages项目中，点击"Custom domains"
2. 点击"Add custom domain"
3. 输入你的域名（如：linxiaowei.dpns.org）
4. 按照提示配置DNS记录
5. 启用HTTPS

## 更新网站内容

### 更新API数据

修改`worker/index.js`文件中的`mockData`对象，然后重新部署Worker：

```bash
cd worker
wrangler deploy
```

### 更新前端代码

修改HTML、CSS或JavaScript文件，然后重新部署到Cloudflare Pages。

## 技术栈

- **前端**：HTML5, CSS3, JavaScript (ES6+)
- **部署**：Cloudflare Pages
- **API**：Cloudflare Workers
- **样式**：Bootstrap 5
- **图标**：Font Awesome 6

## 故障排除

### 1. API调用失败

- 检查Worker域名是否正确
- 检查Worker是否正在运行
- 检查浏览器控制台的错误信息
- 确保CORS头设置正确

### 2. 前端部署失败

- 检查构建设置是否正确
- 检查GitHub Actions日志
- 确保没有语法错误

### 3. 自定义域名不工作

- 检查DNS记录是否正确
- 等待DNS记录生效（通常需要几分钟到几小时）
- 检查SSL证书状态

## 联系方式

如有任何问题，请联系网站管理员。