document.addEventListener('DOMContentLoaded', function() {
    initParticles();
    initNavbarScroll();
    initMouseGlow();
    loadToolsFromStorage();
    initUploadForm();
    initFilterButtons();
});

function initParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    const particleCount = 40;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (Math.random() * 15 + 15) + 's';
        particle.style.width = (Math.random() * 4 + 2) + 'px';
        particle.style.height = particle.style.width;
        particle.style.opacity = Math.random() * 0.4 + 0.2;
        particlesContainer.appendChild(particle);
    }
}

function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });
}

function initMouseGlow() {
    const cursorGlow = document.querySelector('.cursor-glow');
    
    document.addEventListener('mousemove', function(e) {
        cursorGlow.style.left = e.clientX - 20 + 'px';
        cursorGlow.style.top = e.clientY - 20 + 'px';
    });
}

function loadToolsFromStorage() {
    const storedTools = localStorage.getItem('uploadedTools');
    let tools = [];
    
    if (storedTools) {
        try {
            tools = JSON.parse(storedTools);
        } catch (error) {
            console.error('Error loading tools from localStorage:', error);
        }
    } else {
        tools = getDefaultTools();
        saveToolsToStorage(tools);
    }
    
    displayTools(tools);
}

function getDefaultTools() {
    return [
        {
            id: 1,
            name: 'VS Code',
            description: '强大的代码编辑器，支持多种编程语言和插件扩展',
            version: '1.85.0',
            category: '开发工具',
            link: 'https://code.visualstudio.com/',
            icon: 'fa-code',
            uploadDate: new Date().toISOString()
        },
        {
            id: 2,
            name: 'Figma',
            description: '现代化的界面设计工具，支持实时协作',
            version: '116.0.0',
            category: '设计工具',
            link: 'https://www.figma.com/',
            icon: 'fa-palette',
            uploadDate: new Date().toISOString()
        },
        {
            id: 3,
            name: 'Git',
            description: '分布式版本控制系统，用于跟踪代码变更',
            version: '2.43.0',
            category: '开发工具',
            link: 'https://git-scm.com/',
            icon: 'fa-download',
            uploadDate: new Date().toISOString()
        },
        {
            id: 4,
            name: 'Notion',
            description: '全能型笔记和知识管理工具',
            version: '2.0.0',
            category: '效率工具',
            link: 'https://www.notion.so/',
            icon: 'fa-folder',
            uploadDate: new Date().toISOString()
        },
        {
            id: 5,
            name: 'MDN Web Docs',
            description: 'Web开发权威文档和学习资源',
            version: '1.0.0',
            category: '学习资源',
            link: 'https://developer.mozilla.org/',
            icon: 'fa-book',
            uploadDate: new Date().toISOString()
        },
        {
            id: 6,
            name: 'Postman',
            description: 'API开发和测试工具',
            version: '10.10.0',
            category: '开发工具',
            link: 'https://www.postman.com/',
            icon: 'fa-tools',
            uploadDate: new Date().toISOString()
        }
    ];
}

function saveToolsToStorage(tools) {
    localStorage.setItem('uploadedTools', JSON.stringify(tools));
}

function displayTools(tools, filter = 'all') {
    const toolsList = document.getElementById('toolsList');
    if (!toolsList) return;
    
    toolsList.innerHTML = '';
    
    const filteredTools = filter === 'all' 
        ? tools 
        : tools.filter(tool => tool.category === filter);
    
    if (filteredTools.length === 0) {
        toolsList.innerHTML = `
            <div class="no-tools" style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-muted);">
                <i class="fas fa-folder-open" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <p>暂无工具</p>
            </div>
        `;
        return;
    }
    
    filteredTools.forEach(tool => {
        const toolItem = document.createElement('div');
        toolItem.className = 'tool-item';
        toolItem.innerHTML = `
            <div class="tool-item-header">
                <div class="tool-item-icon">
                    <i class="fas ${tool.icon}"></i>
                </div>
                <div class="tool-item-info">
                    <div class="tool-item-name">${tool.name}</div>
                    <div class="tool-item-version">v${tool.version}</div>
                </div>
            </div>
            <div class="tool-item-description">${tool.description}</div>
            <div class="tool-item-footer">
                <span class="tool-item-category">${tool.category}</span>
                <div class="tool-item-actions">
                    <a href="${tool.link}" target="_blank" class="btn-download">
                        <i class="fas fa-download"></i>
                        <span>下载</span>
                    </a>
                    <button class="btn-delete" onclick="deleteTool(${tool.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        toolsList.appendChild(toolItem);
    });
}

function initUploadForm() {
    const uploadForm = document.getElementById('uploadForm');
    if (!uploadForm) return;
    
    uploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const toolName = document.getElementById('toolName').value.trim();
        const toolDescription = document.getElementById('toolDescription').value.trim();
        const toolVersion = document.getElementById('toolVersion').value.trim();
        const toolCategory = document.getElementById('toolCategory').value;
        const toolLink = document.getElementById('toolLink').value.trim();
        const toolIcon = document.getElementById('toolIcon').value;
        
        if (!toolName || !toolDescription || !toolVersion || !toolCategory || !toolLink || !toolIcon) {
            showNotification('请填写所有必填项', 'error');
            return;
        }
        
        const newTool = {
            id: Date.now(),
            name: toolName,
            description: toolDescription,
            version: toolVersion,
            category: toolCategory,
            link: toolLink,
            icon: toolIcon,
            uploadDate: new Date().toISOString()
        };
        
        const storedTools = localStorage.getItem('uploadedTools');
        let tools = [];
        
        if (storedTools) {
            try {
                tools = JSON.parse(storedTools);
            } catch (error) {
                console.error('Error loading tools:', error);
            }
        }
        
        tools.unshift(newTool);
        saveToolsToStorage(tools);
        
        displayTools(tools);
        uploadForm.reset();
        
        showNotification('工具上传成功！', 'success');
    });
}

function initFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (!filterButtons.length) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            const storedTools = localStorage.getItem('uploadedTools');
            let tools = [];
            
            if (storedTools) {
                try {
                    tools = JSON.parse(storedTools);
                } catch (error) {
                    console.error('Error loading tools:', error);
                }
            }
            
            if (tools.length === 0) {
                tools = getDefaultTools();
            }
            
            displayTools(tools, filter);
        });
    });
}

function deleteTool(toolId) {
    if (!confirm('确定要删除这个工具吗？')) {
        return;
    }
    
    const storedTools = localStorage.getItem('uploadedTools');
    let tools = [];
    
    if (storedTools) {
        try {
            tools = JSON.parse(storedTools);
        } catch (error) {
            console.error('Error loading tools:', error);
        }
    }
    
    tools = tools.filter(tool => tool.id !== toolId);
    saveToolsToStorage(tools);
    
    const activeFilter = document.querySelector('.filter-btn.active');
    const filter = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';
    displayTools(tools, filter);
    
    showNotification('工具删除成功！', 'success');
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    const color = type === 'success' ? 'var(--success)' : '#FF0055';
    
    notification.innerHTML = `
        <i class="fas ${icon}" style="color: ${color}; font-size: 1.25rem;"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}