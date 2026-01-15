// 个人网站主JavaScript文件

// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initMobileMenu();
    initScrollEffects();
    initSmoothScroll();
    initBackToTop();
    initScrollAnimations();
    initContactForm();
});

// 初始化移动端菜单
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const menuLinks = document.querySelectorAll('.menu-link');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
        
        // 点击菜单链接后关闭菜单
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            });
        });
    }
}

// 初始化滚动效果
function initScrollEffects() {
    const nav = document.querySelector('.personal-nav');
    const sections = document.querySelectorAll('section');
    const menuLinks = document.querySelectorAll('.menu-link');
    
    window.addEventListener('scroll', function() {
        // 导航栏滚动效果
        if (nav) {
            if (window.scrollY > 100) {
                nav.style.background = 'rgba(255, 255, 255, 0.98)';
                nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                nav.style.background = 'rgba(255, 255, 255, 0.95)';
                nav.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
            }
        }
        
        // 激活当前菜单链接
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        menuLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

// 初始化平滑滚动
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // 考虑导航栏高度
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 初始化回到顶部按钮
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// 初始化滚动动画
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
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
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 获取表单数据
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message')
            };
            
            // 简单的表单验证
            if (!validateForm(data)) {
                return;
            }
            
            // 显示提交状态
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.disabled = true;
            submitBtn.textContent = '发送中...';
            
            // 模拟表单提交（实际项目中替换为真实API调用）
            setTimeout(() => {
                // 提交成功
                showNotification('留言发送成功！', 'success');
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }, 1500);
        });
    }
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
    notification.textContent = message;
    
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
        animation: slideInRight 0.3s ease, fadeOut 0.3s ease 3s forwards;
        box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
    `;
    
    // 根据类型设置背景色
    switch (type) {
        case 'success':
            notification.style.backgroundColor = '#48bb78';
            break;
        case 'error':
            notification.style.backgroundColor = '#f56565';
            break;
        case 'warning':
            notification.style.backgroundColor = '#ed8936';
            break;
        default:
            notification.style.backgroundColor = '#4299e1';
    }
    
    // 添加动画样式
    const style = document.createElement('style');
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
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 3.5秒后移除
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3500);
}

// 添加滚动动画类到元素
function addScrollAnimation() {
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionId = section.getAttribute('id');
        if (sectionId && sectionId !== 'home') {
            const children = section.querySelectorAll('.section-header, .about-content, .skill-category, .project-card, .contact-info, .contact-form');
            children.forEach(child => {
                child.classList.add('fade-in');
            });
        }
    });
}

// 页面加载完成后添加动画类
window.addEventListener('load', function() {
    addScrollAnimation();
});

// 窗口调整大小时重新计算
window.addEventListener('resize', function() {
    // 可以添加需要在窗口调整时重新计算的逻辑
});

// 监听滚动速度，用于更复杂的动画效果
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
