# PocketBase 后台管理系统安装和使用指南

## 概述

PocketBase 是一个开源的后台即服务平台（BaaS），为您的个人网站提供完整的后台管理功能。

## 功能特性

- ✅ 内置 SQLite 数据库（无需额外安装）
- ✅ 现代化的管理后台 UI
- ✅ RESTful API 接口
- ✅ 用户认证和权限管理
- ✅ 文件上传和管理
- ✅ 实时数据同步
- ✅ 数据备份和恢复
- ✅ 日志记录和监控

## 安装步骤

### 1. 下载 PocketBase

从 [PocketBase Releases](https://github.com/pocketbase/pocketbase/releases) 下载适合 Windows 的最新版本。

### 2. 复制文件

将下载的 `pocketbase.exe` 文件复制到 `E:\wangzhan\pocketbase\` 目录。

### 3. 目录结构

```
pocketbase/
├── pocketbase.exe          # PocketBase 可执行文件（需要下载）
├── config.ini             # 配置文件
├── pb_hooks.js            # 数据库初始化脚本
├── start.bat              # 启动脚本
└── pb_data/               # 数据目录（自动创建）
    ├── data.db             # SQLite 数据库文件
    └── logs.txt            # 日志文件
```

### 4. 启动服务

双击 `start.bat` 或在命令行中运行：

```bash
cd E:\wangzhan\pocketbase
start.bat
```

### 5. 访问管理后台

打开浏览器访问：http://localhost:8090/_/

首次访问会要求创建管理员账户：
- 用户名：admin
- 邮箱：admin@example.com
- 密码：admin123456

## 数据库结构

### personal（个人信息）
- name: 姓名
- introduction: 简介
- avatar: 头像URL
- email: 邮箱
- phone: 电话
- github: GitHub链接
- weibo: 微博链接

### projects（项目）
- name: 项目名称
- description: 项目描述
- image: 项目图片URL
- category_id: 分类ID
- category_name: 分类名称
- sort_order: 排序
- tags: 标签（JSON数组）

### experiences（经历）
- title: 标题
- start_date: 开始日期
- end_date: 结束日期
- description: 描述

### skills（技能）
- name: 技能名称
- icon: 图标类名
- proficiency: 熟练度（0-100）
- sort_order: 排序

### tools（工具）
- name: 工具名称
- description: 工具描述
- category: 分类（software/document/website/other）
- type: 类型（file/folder/archive/link）
- url: 链接URL
- size: 文件大小
- downloads: 下载次数
- created_at: 创建日期
- tags: 标签（JSON数组）

## API 使用

### 基础 URL

```
http://localhost:8090/api/
```

### 获取数据

```javascript
// 获取所有数据
fetch('http://localhost:8090/api/collections/personal/records')
  .then(response => response.json())
  .then(data => console.log(data));

// 获取个人信息
fetch('http://localhost:8090/api/collections/personal/records/RECORD_ID')
  .then(response => response.json())
  .then(data => console.log(data));
```

### 添加数据

```javascript
fetch('http://localhost:8090/api/collections/projects/records', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: '新项目',
    description: '项目描述',
    category_id: 1,
    category_name: 'Web 开发',
    sort_order: 1,
    tags: ['前端', 'JavaScript']
  })
})
  .then(response => response.json())
  .then(data => console.log(data));
```

### 更新数据

```javascript
fetch('http://localhost:8090/api/collections/projects/records/RECORD_ID', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: '更新后的项目名称'
  })
})
  .then(response => response.json())
  .then(data => console.log(data));
```

### 删除数据

```javascript
fetch('http://localhost:8090/api/collections/projects/records/RECORD_ID', {
  method: 'DELETE'
})
  .then(response => response.json())
  .then(data => console.log(data));
```

## 管理后台功能

### 集合管理
- 创建、编辑、删除数据表
- 配置字段类型和验证规则
- 设置访问权限

### 记录管理
- 添加、编辑、删除数据记录
- 批量操作
- 导入导出数据

### 文件管理
- 上传文件
- 管理存储空间
- 配置文件类型限制

### 设置管理
- 修改管理员密码
- 配置邮件服务
- 设置备份策略
- 查看系统日志

## 配置说明

### config.ini 配置项

```ini
[server]
http_addr = 0.0.0.0:8090          # 服务器监听地址

[database]
db_path = ./pb_data/data.db        # 数据库文件路径

[admin]
admin_username = admin               # 管理员用户名
admin_email = admin@example.com        # 管理员邮箱
admin_password = admin123456          # 管理员密码

[security]
https_enabled = false                # 是否启用 HTTPS
https_cert_path =                   # HTTPS 证书路径
https_key_path =                    # HTTPS 私钥路径

[files]
max_upload_size = 10                # 最大上传文件大小（MB）
allowed_file_types = jpg,jpeg,png,gif,pdf,doc,docx,txt,zip

[logs]
log_level = info                    # 日志级别
log_file = ./pb_data/logs.txt     # 日志文件路径

[cors]
allowed_origins = *                 # 允许的源
allowed_methods = GET,POST,PUT,DELETE,OPTIONS
allowed_headers = Content-Type,Authorization
```

## 数据备份

### 自动备份

PocketBase 支持自动备份，可以在管理后台设置备份策略。

### 手动备份

在管理后台的"备份"页面可以：
- 创建完整数据库备份
- 上传备份到云存储
- 恢复之前的备份

## 安全建议

1. **修改默认密码**：首次登录后立即修改管理员密码
2. **启用 HTTPS**：生产环境建议启用 HTTPS
3. **配置 CORS**：设置允许的源为具体域名
4. **定期备份**：设置自动备份策略
5. **监控日志**：定期查看系统日志

## 故障排除

### 端口被占用

如果 8090 端口被占用，修改 `config.ini` 中的 `http_addr`：

```ini
[server]
http_addr = 0.0.0.0:8091
```

### 数据库锁定

如果遇到数据库锁定错误：
1. 确保只有一个 PocketBase 实例在运行
2. 检查 `pb_data/data.db` 文件权限
3. 重启 PocketBase 服务

### 无法访问管理后台

1. 检查 PocketBase 是否正常运行
2. 确认防火墙设置
3. 查看日志文件 `pb_data/logs.txt`

## 更新和维护

### 更新 PocketBase

1. 停止当前运行的 PocketBase
2. 下载最新版本的 `pocketbase.exe`
3. 替换旧的 `pocketbase.exe` 文件
4. 重新启动服务

### 数据迁移

PocketBase 会自动处理数据库迁移，但建议：
1. 在更新前创建完整备份
2. 测试新版本的功能
3. 确认数据完整性

## 技术支持

- 官方文档：https://pocketbase.io/docs
- GitHub Issues：https://github.com/pocketbase/pocketbase/issues
- 社区论坛：https://github.com/pocketbase/pocketbase/discussions

## 许可证

PocketBase 使用 MIT 许可证，可免费用于商业和个人项目。