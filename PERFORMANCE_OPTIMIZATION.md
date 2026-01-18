# My World 性能优化文档

## 目录
1. [性能测试清单](#性能测试清单)
2. [最佳实践](#最佳实践)
3. [优化技术详解](#优化技术详解)
4. [性能监控指南](#性能监控指南)
5. [故障排除](#故障排除)

---

## 性能测试清单

### Core Web Vitals 目标

| 指标 | 目标值 | 需要改进 | 差 |
|------|--------|----------|-----|
| **FCP** (First Contentful Paint) | < 1.8s | 1.8s - 3.0s | > 3.0s |
| **LCP** (Largest Contentful Paint) | < 2.5s | 2.5s - 4.0s | > 4.0s |
| **FID** (First Input Delay) | < 100ms | 100ms - 300ms | > 300ms |
| **CLS** (Cumulative Layout Shift) | < 0.1 | 0.1 - 0.25 | > 0.25 |
| **TTI** (Time to Interactive) | < 3.9s | 3.9s - 7.3s | > 7.3s |

### 测试工具

#### 1. Lighthouse 测试
```bash
# 使用 Chrome DevTools
1. 打开 Chrome DevTools (F12)
2. 切换到 Lighthouse 标签
3. 选择 Performance 和 Accessibility
4. 点击 "Analyze page load"
5. 查看报告和分数
```

#### 2. WebPageTest 测试
```bash
# 访问 https://www.webpagetest.org
1. 输入网站 URL
2. 选择测试位置和浏览器
3. 配置测试选项（带宽、CPU 速度等）
4. 运行测试
5. 分析瀑布图和性能指标
```

#### 3. Chrome DevTools Performance
```bash
# 性能分析
1. 打开 Chrome DevTools (F12)
2. 切换到 Performance 标签
3. 点击 Record
4. 与页面交互
5. 停止录制
6. 分析帧率、脚本执行时间等
```

#### 4. PageSpeed Insights
```bash
# 访问 https://pagespeed.web.dev
1. 输入网站 URL
2. 运行分析
3. 查看移动端和桌面端分数
4. 阅读优化建议
```

### 测试清单

#### 加载性能测试
- [ ] **FCP < 1.8s** - 首次内容绘制时间
- [ ] **LCP < 2.5s** - 最大内容绘制时间
- [ ] **TTI < 3.9s** - 可交互时间
- [ ] **TTFB < 600ms** - 首字节时间
- [ ] **页面总大小 < 2.5MB**
- [ ] **资源请求数 < 50**
- [ ] **JavaScript 大小 < 500KB**
- [ ] **CSS 大小 < 100KB**
- [ ] **图片大小 < 1MB**

#### 运行时性能测试
- [ ] **FID < 100ms** - 首次输入延迟
- [ ] **CLS < 0.1** - 累积布局偏移
- [ ] **TBT < 300ms** - 总阻塞时间
- [ ] **帧率 ≥ 60fps** - 动画流畅度
- [ ] **无长任务 (>50ms)**
- [ ] **内存使用合理**

#### 可访问性测试
- [ ] **WCAG AA 合规**
- [ ] **键盘导航正常**
- [ ] **屏幕阅读器友好**
- [ ] **色彩对比度 ≥ 4.5:1**
- [ ] **减少动画支持**

#### 兼容性测试
- [ ] **Chrome 最新版**
- [ ] **Firefox 最新版**
- [ ] **Safari 最新版**
- [ ] **Edge 最新版**
- [ ] **移动端浏览器**
- [ ] **不同屏幕尺寸**

---

## 最佳实践

### 1. CSS 性能优化

#### 1.1 减少重排和重绘
```css
/* ❌ 不好的做法 */
.element {
    left: 10px;
    top: 10px;
    width: 100px;
    height: 100px;
}

/* ✅ 好的做法 - 使用 transform */
.element {
    transform: translate(10px, 10px);
    width: 100px;
    height: 100px;
}
```

#### 1.2 使用 GPU 加速
```css
/* 启用 GPU 加速 */
.gpu-accelerated {
    will-change: transform;
    transform: translateZ(0);
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
}
```

#### 1.3 使用 CSS Containment
```css
/* 限制布局计算范围 */
.contain-layout {
    contain: layout style;
}

/* 限制重绘范围 */
.contain-paint {
    contain: paint;
}

/* 完全隔离 */
.contain-strict {
    contain: strict;
}
```

#### 1.4 优化选择器
```css
/* ❌ 不好的做法 - 深层嵌套 */
body div ul li a {
    color: blue;
}

/* ✅ 好的做法 - 扁平选择器 */
.nav-link {
    color: blue;
}
```

#### 1.5 使用 will-change 提示
```css
/* 为即将发生动画的元素添加提示 */
.animated-element {
    will-change: transform, opacity;
}

/* 动画结束后移除 */
.animated-element.finished {
    will-change: auto;
}
```

### 2. JavaScript 性能优化

#### 2.1 使用节流和防抖
```javascript
// 防抖 - 限制函数调用频率
const debouncedSearch = debounce(searchFunction, 300);

// 节流 - 限制函数执行频率
const throttledScroll = throttle(scrollHandler, 100);

// RAF 节流 - 用于动画
const rafThrottled = rafThrottle(animationFrame);
```

#### 2.2 使用 IntersectionObserver
```javascript
// ❌ 不好的做法 - 滚动事件监听
window.addEventListener('scroll', () => {
    // 计算元素位置
    // 触发重排
});

// ✅ 好的做法 - IntersectionObserver
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // 元素可见
        }
    });
});

observer.observe(element);
```

#### 2.3 懒加载图片
```html
<!-- 原生懒加载 -->
<img src="placeholder.jpg" 
     data-src="actual-image.jpg" 
     loading="lazy" 
     alt="Description">

<!-- IntersectionObserver 回退 -->
<script>
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            imageObserver.unobserve(img);
        }
    });
});
</script>
```

#### 2.4 减少 DOM 操作
```javascript
// ❌ 不好的做法 - 多次 DOM 操作
const list = document.getElementById('list');
items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    list.appendChild(li); // 每次都触发重排
});

// ✅ 好的做法 - 使用 DocumentFragment
const list = document.getElementById('list');
const fragment = document.createDocumentFragment();
items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    fragment.appendChild(li);
});
list.appendChild(fragment); // 只触发一次重排
```

#### 2.5 使用 requestAnimationFrame
```javascript
// ❌ 不好的做法 - setInterval
setInterval(() => {
    element.style.transform = `translateX(${x}px)`;
}, 16);

// ✅ 好的做法 - requestAnimationFrame
function animate() {
    element.style.transform = `translateX(${x}px)`;
    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
```

### 3. 资源优化

#### 3.1 图片优化
```bash
# 使用 WebP 格式
convert input.jpg -quality 85 output.webp

# 响应式图片
<img src="small.jpg"
     srcset="small.jpg 500w,
             medium.jpg 1000w,
             large.jpg 1500w"
     sizes="(max-width: 600px) 500px,
            (max-width: 1200px) 1000px,
            1500px"
     alt="Description">

# 使用 picture 元素
<picture>
    <source srcset="image.webp" type="image/webp">
    <source srcset="image.jpg" type="image/jpeg">
    <img src="image.jpg" alt="Description">
</picture>
```

#### 3.2 字体优化
```css
/* 使用 font-display: swap */
@font-face {
    font-family: 'Custom Font';
    src: url('font.woff2') format('woff2');
    font-display: swap;
}

/* 字体子集化 */
@font-face {
    font-family: 'Custom Font';
    src: url('font-latin.woff2') format('woff2');
    unicode-range: U+0000-00FF; /* 只包含拉丁字符 */
}
```

#### 3.3 CSS 和 JavaScript 压缩
```bash
# 使用工具压缩 CSS
npm install -g cssnano
cssnano input.css output.css

# 使用工具压缩 JavaScript
npm install -g terser
terser input.js -o output.js

# 使用 webpack 打包和优化
webpack --mode production
```

#### 3.4 CDN 优化
```html
<!-- 使用 CDN 加载常用库 -->
<script src="https://cdn.jsdelivr.net/npm/vue@3/dist/vue.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css">

<!-- 预连接到 CDN -->
<link rel="preconnect" href="https://cdn.jsdelivr.net">
<link rel="dns-prefetch" href="https://cdn.jsdelivr.net">
```

### 4. 加载性能优化

#### 4.1 预加载关键资源
```html
<!-- 预加载关键 CSS -->
<link rel="preload" href="critical.css" as="style">

<!-- 预加载关键 JavaScript -->
<link rel="preload" href="critical.js" as="script">

<!-- 预加载关键字体 -->
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>
```

#### 4.2 异步加载非关键资源
```html
<!-- 异步加载 JavaScript -->
<script src="non-critical.js" async></script>
<script src="deferred.js" defer></script>

<!-- 动态加载模块 -->
<script type="module">
    import('./module.js').then(module => {
        // 使用模块
    });
</script>
```

#### 4.3 优化关键渲染路径
```html
<!-- 内联关键 CSS -->
<style>
    /* 关键 CSS */
    body { margin: 0; padding: 0; }
    .hero { display: flex; align-items: center; }
</style>

<!-- 延迟加载非关键 CSS -->
<link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="styles.css"></noscript>
```

#### 4.4 减少 HTTP 请求
```html
<!-- 使用 CSS Sprites -->
<style>
    .sprite {
        background-image: url('sprite.png');
        background-repeat: no-repeat;
    }
    .icon-home {
        background-position: 0 0;
        width: 32px;
        height: 32px;
    }
</style>

<!-- 使用 Data URI（小文件） -->
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==">
```

### 5. 运行时性能优化

#### 5.1 虚拟滚动
```javascript
// 虚拟滚动实现
class VirtualScroll {
    constructor(container, itemHeight, renderItem) {
        this.container = container;
        this.itemHeight = itemHeight;
        this.renderItem = renderItem;
        this.visibleItems = Math.ceil(container.clientHeight / itemHeight);
        this.startIndex = 0;
        this.endIndex = this.visibleItems;
        
        this.init();
    }
    
    init() {
        this.container.addEventListener('scroll', this.onScroll.bind(this));
        this.render();
    }
    
    onScroll() {
        const scrollTop = this.container.scrollTop;
        this.startIndex = Math.floor(scrollTop / this.itemHeight);
        this.endIndex = this.startIndex + this.visibleItems;
        this.render();
    }
    
    render() {
        const fragment = document.createDocumentFragment();
        for (let i = this.startIndex; i < this.endIndex; i++) {
            const item = this.renderItem(i);
            item.style.position = 'absolute';
            item.style.top = `${i * this.itemHeight}px`;
            fragment.appendChild(item);
        }
        this.container.innerHTML = '';
        this.container.appendChild(fragment);
    }
}
```

#### 5.2 代码分割
```javascript
// 动态导入
const loadModule = async () => {
    const module = await import('./heavy-module.js');
    module.doSomething();
};

// 路由级别的代码分割
const routes = {
    home: () => import('./home.js'),
    about: () => import('./about.js'),
    contact: () => import('./contact.js')
};

// 懒加载组件
const LazyComponent = React.lazy(() => import('./LazyComponent'));
```

#### 5.3 内存泄漏检测
```javascript
// 检查内存泄漏
function checkMemoryLeaks() {
    if (window.performance && window.performance.memory) {
        const memory = window.performance.memory;
        console.log('Memory usage:', {
            used: `${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`,
            total: `${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB`,
            limit: `${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`
        });
    }
}

// 定期检查
setInterval(checkMemoryLeaks, 10000);
```

#### 5.4 优化动画帧率
```javascript
// 使用 requestAnimationFrame
function animate(timestamp) {
    // 计算增量时间
    const deltaTime = timestamp - lastTimestamp;
    lastTimestamp = timestamp;
    
    // 更新动画
    updateAnimation(deltaTime);
    
    // 请求下一帧
    requestAnimationFrame(animate);
}

// 使用 CSS 动画代替 JavaScript
.animated {
    animation: slideIn 0.3s ease;
}

@keyframes slideIn {
    from {
        transform: translateX(-100%);
    }
    to {
        transform: translateX(0);
    }
}
```

### 6. 可访问性优化

#### 6.1 WCAG AA 标准
```html
<!-- 色彩对比度 -->
<style>
    .text {
        color: #333333; /* 对比度 ≥ 4.5:1 */
        background: #FFFFFF;
    }
</style>

<!-- 键盘导航 -->
<button tabindex="0">可聚焦按钮</button>

<!-- ARIA 标签 -->
<nav aria-label="主导航">
    <ul>
        <li><a href="#" aria-current="page">首页</a></li>
        <li><a href="#">关于</a></li>
    </ul>
</nav>
```

#### 6.2 键盘导航
```javascript
// 键盘事件处理
document.addEventListener('keydown', (e) => {
    // Escape 键关闭模态框
    if (e.key === 'Escape') {
        closeModal();
    }
    
    // Tab 键焦点管理
    if (e.key === 'Tab') {
        manageFocus(e);
    }
});

// 焦点陷阱
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    element.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    });
}
```

#### 6.3 减少动画支持
```css
/* 尊重用户的动画偏好 */
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
```

#### 6.4 屏幕阅读器优化
```html
<!-- 跳转到主要内容 -->
<a href="#main-content" class="sr-only">
    跳转到主要内容
</a>

<!-- ARIA 标签 -->
<div role="alert" aria-live="polite">
    通知消息
</div>

<!-- 图标按钮 -->
<button aria-label="关闭">
    <i class="fas fa-times"></i>
</button>
```

---

## 优化技术详解

### CSS 性能优化技术

#### 1. GPU 加速
- **原理**: 将渲染工作从 CPU 转移到 GPU
- **适用场景**: 动画、过渡、3D 变换
- **实现**: `transform: translateZ(0)`, `will-change: transform`

#### 2. CSS Containment
- **原理**: 限制浏览器重排和重绘的范围
- **适用场景**: 复杂布局、独立组件
- **实现**: `contain: layout`, `contain: paint`

#### 3. 减少重排
- **原理**: 避免频繁触发布局计算
- **适用场景**: 动态内容更新
- **实现**: 批量 DOM 操作、使用 transform

### JavaScript 性能优化技术

#### 1. 节流和防抖
- **原理**: 限制函数调用频率
- **适用场景**: 滚动、输入、调整大小
- **实现**: `setTimeout`, `requestAnimationFrame`

#### 2. IntersectionObserver
- **原理**: 异步检测元素可见性
- **适用场景**: 懒加载、无限滚动
- **实现**: `new IntersectionObserver()`

#### 3. 虚拟滚动
- **原理**: 只渲染可见区域的元素
- **适用场景**: 长列表、大数据集
- **实现**: 计算可见范围、动态渲染

---

## 性能监控指南

### 使用性能监控代码

```javascript
// 初始化性能监控
PerformanceMonitor.init();

// 获取性能报告
const report = PerformanceMonitor.getReport();
console.log(report);

// 获取实时指标
const metrics = PerformanceMonitor.getMetrics();
console.log(metrics);

// 切换性能仪表板
PerformanceMonitor.toggleDashboard();
```

### 性能仪表板

```javascript
// 启用性能仪表板
PERFORMANCE_CONFIG.showDashboard = true;

// 切换显示
PerformanceMonitor.toggleDashboard();
```

### 性能报告

```javascript
// 生成性能报告
const report = PerformanceMonitor.getReport();

// 发送到分析服务
fetch('/api/performance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(report)
});
```

---

## 故障排除

### 常见性能问题

#### 1. FCP 过慢
**原因**:
- 服务器响应慢
- 阻塞渲染的 CSS/JS
- 大型资源加载

**解决方案**:
- 优化服务器响应时间
- 内联关键 CSS
- 延迟加载非关键资源

#### 2. LCP 过慢
**原因**:
- 大型图片
- 慢速网络
- 渲染阻塞资源

**解决方案**:
- 压缩和优化图片
- 使用 CDN
- 预加载关键资源

#### 3. FID 过高
**原因**:
- 长时间运行的 JavaScript
- 大型 JavaScript 包
- 主线程阻塞

**解决方案**:
- 代码分割
- 使用 Web Workers
- 优化 JavaScript 执行

#### 4. CLS 过高
**原因**:
- 动态内容插入
- 图片尺寸未指定
- 字体加载

**解决方案**:
- 为图片指定尺寸
- 使用 font-display: swap
- 预留空间给动态内容

#### 5. TTI 过慢
**原因**:
- 大型 JavaScript 包
- 长任务
- 复杂的 DOM 操作

**解决方案**:
- 代码分割
- 优化 JavaScript 执行
- 减少 DOM 操作

---

## 总结

### 关键要点

1. **优先优化 Core Web Vitals**
   - FCP < 1.8s
   - LCP < 2.5s
   - FID < 100ms
   - CLS < 0.1
   - TTI < 3.9s

2. **使用现代性能技术**
   - GPU 加速
   - IntersectionObserver
   - requestAnimationFrame
   - CSS Containment

3. **持续监控和优化**
   - 使用性能监控工具
   - 定期运行性能测试
   - 跟踪性能指标

4. **关注用户体验**
   - 确保可访问性
   - 支持减少动画
   - 优化移动端性能

### 资源链接

- [Web.dev - Performance](https://web.dev/performance/)
- [MDN - Performance API](https://developer.mozilla.org/en-US/docs/Web/API/Performance)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WebPageTest](https://www.webpagetest.org/)
- [PageSpeed Insights](https://pagespeed.web.dev/)

---

**文档版本**: 1.0  
**最后更新**: 2024-01-18  
**维护者**: My World Team
