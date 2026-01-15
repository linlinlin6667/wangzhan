// 个人网站优化版JavaScript文件

// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initNavbarScrollEffect();
    initSmoothScroll();
    initBackToTop();
    initScrollAnimations();
    initContactForm();
    initMobileMenu();
    initActiveSectionHighlight();
});

// 初始化导航栏滚动效果
function initNavbarScrollEffect() {
    const navbar = document.querySelector('.navbar');
    
    if (!navbar) return;
    
    // 使用Intersection Observer API优化性能
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navbar.classList.remove('scrolled');
            } else {
                navbar.classList.add('scrolled');
            }
        });
    }, {
        threshold: 0.1
    });
    
    // 观察页面顶部区域
    const heroSection = document.getElementById('hero');
    if (heroSection) {
        observer.observe(heroSection);
    }
    
    // 降级方案：如果没有heroSection，使用传统滚动监听
    if (!heroSection) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
}

// 初始化平滑滚动
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // 排除空链接和外部链接
            if (targetId === '#' || targetId.startsWith('#/')) {
                return;
            }
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // 获取导航栏高度
                const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 76;
                const offsetTop = targetElement.offsetTop - navbarHeight;
                
                // 使用requestAnimationFrame优化滚动性能
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // 关闭移动端菜单
                const mobileMenu = document.getElementById('navbarNav');
                if (mobileMenu) {
                    mobileMenu.classList.remove('show');
                }
            }
        });
    });
}

// 初始化回到顶部按钮
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (!backToTopBtn) return;
    
    // 使用Intersection Observer API优化性能
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                backToTopBtn.classList.remove('visible');
            } else {
                backToTopBtn.classList.add('visible');
            }
        });
    }, {
        threshold: 0
    });
    
    // 观察页面顶部区域
    const heroSection = document.getElementById('hero');
    if (heroSection) {
        observer.observe(heroSection);
    }
    
    // 点击回到顶部
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 初始化滚动动画
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in');
    
    if (animatedElements.length === 0) return;
    
    // 使用Intersection Observer API优化性能
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // 动画完成后停止观察
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// 初始化联系表单
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 获取表单数据
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        const data = {
            name,
            email,
            subject,
            message
        };
        
        // 简单的表单验证
        if (!validateForm(data)) {
            return;
        }
        
        // 显示提交状态
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 发送中...';
        
        // 模拟表单提交（实际项目中替换为真实API调用）
        setTimeout(() => {
            // 提交成功
            showNotification('留言发送成功！', 'success');
            contactForm.reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }, 1500);
    });
}

// 表单验证
function validateForm(data) {
    if (!data.name.trim()) {
        showNotification('请输入姓名', 'error');
        return false;
    }
    
    if (!data.email.trim() || !isValidEmail(data.email)) {
        showNotification('请输入有效的邮箱地址', 'error');
        return false;
    }
    
    if (!data.subject.trim()) {
        showNotification('请输入主题', 'error');
        return false;
    }
    
    if (!data.message.trim()) {
        showNotification('请输入留言内容', 'error');
        return false;
    }
    
    return true;
}

// 验证邮箱格式
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 显示通知
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // 添加图标
    const iconClass = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    }[type] || 'fa-info-circle';
    
    notification.innerHTML = `
        <i class="fas ${iconClass}"></i>
        <span>${message}</span>
    `;
    
    // 添加样式
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        color: white;
        font-weight: 500;
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        animation: slideInRight 0.3s ease, fadeOut 0.3s ease 3s forwards;
        box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
    `;
    
    // 根据类型设置背景色
    const bgColor = {
        success: '#10b981', // Emerald
        error: '#ef4444',   // Red
        warning: '#f59e0b', // Amber
        info: '#3b82f6'     // Blue
    }[type] || '#3b82f6';
    
    notification.style.backgroundColor = bgColor;
    
    // 添加动画样式（仅添加一次）
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes fadeOut {
                from {
                    opacity: 1;
                }
                to {
                    opacity: 0;
                    transform: translateX(100%);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 3.5秒后移除
    setTimeout(() => {
        if (notification.parentNode) {
            // 添加淡出动画
            notification.style.animation = 'fadeOut 0.3s ease forwards';
            
            // 动画结束后移除元素
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 3500);
}

// 初始化移动端菜单
function initMobileMenu() {
    // Bootstrap 5已处理移动端菜单，这里添加额外的优化
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.getElementById('navbarNav');
    const navLinks = navbarCollapse?.querySelectorAll('.nav-link');
    
    if (!navbarToggler || !navbarCollapse) return;
    
    // 点击菜单链接后关闭菜单
    navLinks?.forEach(link => {
        link.addEventListener('click', function() {
            // 使用Bootstrap的API关闭菜单
            const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                toggle: false
            });
            bsCollapse.hide();
        });
    });
    
    // 点击页面其他区域关闭菜单
    document.addEventListener('click', function(e) {
        if (!navbarToggler.contains(e.target) && !navbarCollapse.contains(e.target)) {
            const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                toggle: false
            });
            bsCollapse.hide();
        }
    });
}

// 初始化活跃区域高亮
function initActiveSectionHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (sections.length === 0 || navLinks.length === 0) return;
    
    // 使用Intersection Observer API优化性能
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 更新导航链接状态
                const currentSectionId = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    const linkTarget = link.getAttribute('href')?.substring(1);
                    if (linkTarget === currentSectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-76px 0px -50% 0px' // 考虑导航栏高度和区域中心点
    });
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// 添加滚动动画类到元素（如果需要）
function addScrollAnimation() {
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const children = section.querySelectorAll('.section-header, .about-content, .about-skills, .skill-item, .project-card, .timeline-item, .contact-item, .contact-form');
        children.forEach(child => {
            if (!child.classList.contains('fade-in')) {
                child.classList.add('fade-in');
            }
        });
    });
}

// 页面加载完成后添加动画类
window.addEventListener('load', function() {
    addScrollAnimation();
});

// 窗口调整大小时重新计算
window.addEventListener('resize', function() {
    // 使用防抖优化性能
    if (resizeTimeout) {
        clearTimeout(resizeTimeout);
    }
    
    const resizeTimeout = setTimeout(() => {
        // 可以添加需要在窗口调整时重新计算的逻辑
    }, 250);
});

// 性能优化：避免重复声明变量
let resizeTimeout = null;

// 优化滚动性能：使用requestAnimationFrame
let lastScrollTop = 0;
let ticking = false;

function onScroll() {
    const scrollTop = window.scrollY;
    
    // 可以在这里添加基于滚动速度的动画逻辑
    
    lastScrollTop = scrollTop;
    ticking = false;
}

window.addEventListener('scroll', function() {
    if (!ticking) {
        requestAnimationFrame(onScroll);
        ticking = true;
    }
});

// 添加渐进式增强：如果不支持Intersection Observer API，使用传统滚动监听
if (!('IntersectionObserver' in window)) {
    // 动态加载polyfill（可选）
    const script = document.createElement('script');
    script.src = 'https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver';
    script.async = true;
    document.head.appendChild(script);
    
    // 降级到传统滚动监听
    window.addEventListener('scroll', function() {
        // 处理所有需要滚动监听的功能
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        
        const backToTopBtn = document.getElementById('backToTop');
        if (backToTopBtn) {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }
        
        // 处理滚动动画
        const fadeElements = document.querySelectorAll('.fade-in');
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    });
}

// 添加PWA支持（可选）
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
    });
}

// 添加错误处理
window.addEventListener('error', function(e) {
    console.error('JavaScript错误:', e.error);
    // 可以添加错误上报逻辑
});

// 添加未捕获的Promise拒绝处理
window.addEventListener('unhandledrejection', function(e) {
    console.error('未处理的Promise拒绝:', e.reason);
    // 可以添加错误上报逻辑
});

// 优化API请求
function fetchWithRetry(url, options = {}, retries = 3, delay = 1000) {
    return fetch(url, options)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP错误! 状态: ${response.status}`);
            }
            return response.json();
        })
        .catch(error => {
            if (retries <= 0) {
                throw error;
            }
            console.log(`请求失败，${delay}ms后重试... (剩余${retries}次)`);
            return new Promise(resolve => setTimeout(resolve, delay))
                .then(() => fetchWithRetry(url, options, retries - 1, delay * 2));
        });
}

// 缓存API请求结果
const apiCache = new Map();

function fetchWithCache(url, options = {}, cacheTime = 60000) {
    const cacheKey = JSON.stringify({ url, options });
    const cached = apiCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < cacheTime) {
        return Promise.resolve(cached.data);
    }
    
    return fetchWithRetry(url, options)
        .then(data => {
            apiCache.set(cacheKey, { data, timestamp: Date.now() });
            return data;
        });
}

// 导出函数（用于模块化）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initNavbarScrollEffect,
        initSmoothScroll,
        initBackToTop,
        initScrollAnimations,
        initContactForm,
        initMobileMenu,
        initActiveSectionHighlight,
        fetchWithRetry,
        fetchWithCache
    };
}