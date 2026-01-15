// 后台管理页面JavaScript

// API基础URL - 与现有前端代码保持一致
const API_URL = 'https://personal-website-api.1950837615.workers.dev/';

// 现有的API使用action参数，不是RESTful API
// 我们需要调整API调用方式以兼容现有结构

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化模块切换
    initModuleSwitching();
    
    // 初始化个人资料表单
    initProfileForm();
    
    // 初始化作品管理
    initProjectManagement();
    
    // 初始化经历管理
    initExperienceManagement();
    
    // 初始化技能管理
    initSkillManagement();
    
    // 初始化工具管理
    initToolManagement();
    
    // 初始化工具类型切换
    initToolTypeSwitch();
});

// 初始化模块切换
function initModuleSwitching() {
    const navItems = document.querySelectorAll('.nav-item');
    const modules = document.querySelectorAll('.module');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除所有活动状态
            navItems.forEach(nav => nav.classList.remove('active'));
            modules.forEach(module => module.classList.remove('active'));
            
            // 添加当前活动状态
            this.classList.add('active');
            const moduleId = this.dataset.module;
            const currentModule = document.getElementById(moduleId);
            if (currentModule) {
                currentModule.classList.add('active');
                
                // 根据模块加载数据
                switch(moduleId) {
                    case 'projects':
                        loadProjects();
                        break;
                    case 'experiences':
                        loadExperiences();
                        break;
                    case 'skills':
                        loadSkills();
                        break;
                    case 'tools':
                        loadTools();
                        break;
                    case 'profile':
                        loadProfile();
                        break;
                }
            }
        });
    });
}

// 初始化个人资料表单
function initProfileForm() {
    const profileForm = document.getElementById('profile-form');
    const profileResetBtn = document.getElementById('profile-reset');
    
    // 加载个人资料
    loadProfile();
    
    // 提交表单
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveProfile();
        });
    }
    
    // 重置表单
    if (profileResetBtn) {
        profileResetBtn.addEventListener('click', function() {
            loadProfile();
        });
    }
}

// 加载个人资料
function loadProfile() {
    // 从API获取数据
    apiRequest('personal')
        .then(data => {
            const profile = data.data;
            
            // 填充表单
            document.getElementById('profile-name').value = profile.name;
            document.getElementById('profile-email').value = profile.email;
            document.getElementById('profile-phone').value = profile.phone;
            document.getElementById('profile-introduction').value = profile.introduction;
        })
        .catch(error => {
            console.error('加载个人资料失败:', error);
        });
}

// 保存个人资料
function saveProfile() {
    const form = document.getElementById('profile-form');
    const profileData = {
        name: document.getElementById('profile-name').value,
        email: document.getElementById('profile-email').value,
        phone: document.getElementById('profile-phone').value,
        introduction: document.getElementById('profile-introduction').value
    };
    
    // 发送到API保存
    apiRequest('personal', profileData, 'POST')
        .then(data => {
            // 显示成功消息
            showMessage('个人资料保存成功', 'success');
        })
        .catch(error => {
            console.error('保存个人资料失败:', error);
            showMessage('保存个人资料失败: ' + error.message, 'error');
        });
}

// 初始化作品管理
function initProjectManagement() {
    const addProjectBtn = document.getElementById('add-project');
    const projectForm = document.getElementById('project-form');
    
    // 加载作品列表
    loadProjects();
    
    // 打开新增作品模态框
    if (addProjectBtn) {
        addProjectBtn.addEventListener('click', function() {
            openProjectModal();
        });
    }
    
    // 提交作品表单
    if (projectForm) {
        projectForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveProject();
        });
    }
}

// 加载作品列表
function loadProjects() {
    const projectsList = document.getElementById('projects-list');
    
    // 显示加载状态
    projectsList.innerHTML = '<div class="loading">加载中...</div>';
    
    // 从API获取数据
    apiRequest('projects')
        .then(data => {
            const projects = data.data;
            // 渲染作品列表
            renderProjects(projects);
        })
        .catch(error => {
            console.error('加载作品列表失败:', error);
            projectsList.innerHTML = '<div class="text-center py-4 text-muted">加载失败，请重试</div>';
        });
}

// 渲染作品列表
function renderProjects(projects) {
    const projectsList = document.getElementById('projects-list');
    
    if (projects.length === 0) {
        projectsList.innerHTML = '<div class="text-center py-4 text-muted">暂无作品</div>';
        return;
    }
    
    let html = '';
    projects.forEach(project => {
        html += `
            <div class="item-card">
                <div class="item-info">
                    <h3 class="item-title">${project.name}</h3>
                    <div class="item-meta">
                        <span class="badge bg-secondary">${project.category_name}</span>
                    </div>
                    <p class="item-description">${project.description}</p>
                    <div class="item-image-preview">
                        <img src="${project.image}" alt="${project.name}" style="max-width: 100px; max-height: 100px; border-radius: 4px;">
                    </div>
                </div>
                <div class="item-actions">
                    <button class="btn btn-sm btn-primary" onclick="editProject(${project.id})">
                        <i class="fas fa-edit"></i> 编辑
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteProject(${project.id})">
                        <i class="fas fa-trash"></i> 删除
                    </button>
                </div>
            </div>
        `;
    });
    
    projectsList.innerHTML = html;
}

// 打开作品模态框
function openProjectModal(project = null) {
    const modal = new bootstrap.Modal(document.getElementById('project-modal'));
    const modalTitle = document.getElementById('project-modal-label');
    const projectForm = document.getElementById('project-form');
    
    // 重置表单
    projectForm.reset();
    document.getElementById('project-id').value = '';
    
    if (project) {
        // 编辑模式
        modalTitle.textContent = '编辑作品';
        document.getElementById('project-id').value = project.id;
        document.getElementById('project-name').value = project.name;
        document.getElementById('project-category').value = project.category;
        document.getElementById('project-description').value = project.description;
        document.getElementById('project-link').value = project.link;
    } else {
        // 新增模式
        modalTitle.textContent = '新增作品';
    }
    
    modal.show();
}

// 编辑作品
function editProject(id) {
    // 这里应该从API获取作品详情，暂时使用模拟数据
    const mockProject = {
        id: id,
        name: `项目名称${id}`,
        category: 'Web开发',
        description: `这是项目${id}的描述`,
        link: '#'
    };
    
    openProjectModal(mockProject);
}

// 保存作品
function saveProject() {
    const formData = new FormData(document.getElementById('project-form'));
    const projectId = document.getElementById('project-id').value;
    
    // 这里应该发送到API，暂时模拟保存
    console.log(projectId ? '更新作品:' : '新增作品:', Object.fromEntries(formData));
    
    // 关闭模态框
    const modal = bootstrap.Modal.getInstance(document.getElementById('project-modal'));
    modal.hide();
    
    // 重新加载作品列表
    loadProjects();
    
    // 显示成功消息
    showMessage(projectId ? '作品更新成功' : '作品添加成功', 'success');
}

// 删除作品
function deleteProject(id) {
    if (confirm('确定要删除这个作品吗？')) {
        // 这里应该发送到API，暂时模拟删除
        console.log('删除作品:', id);
        
        // 重新加载作品列表
        loadProjects();
        
        // 显示成功消息
        showMessage('作品删除成功', 'success');
    }
}

// 初始化经历管理
function initExperienceManagement() {
    const addExperienceBtn = document.getElementById('add-experience');
    const experienceForm = document.getElementById('experience-form');
    
    // 加载经历列表
    loadExperiences();
    
    // 打开新增经历模态框
    if (addExperienceBtn) {
        addExperienceBtn.addEventListener('click', function() {
            openExperienceModal();
        });
    }
    
    // 提交经历表单
    if (experienceForm) {
        experienceForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveExperience();
        });
    }
}

// 加载经历列表
function loadExperiences() {
    const experiencesList = document.getElementById('experiences-list');
    
    // 显示加载状态
    experiencesList.innerHTML = '<div class="loading">加载中...</div>';
    
    // 从API获取数据
    apiRequest('experiences')
        .then(data => {
            const experiences = data.data;
            // 渲染经历列表
            renderExperiences(experiences);
        })
        .catch(error => {
            console.error('加载经历列表失败:', error);
            experiencesList.innerHTML = '<div class="text-center py-4 text-muted">加载失败，请重试</div>';
        });
}

// 渲染经历列表
function renderExperiences(experiences) {
    const experiencesList = document.getElementById('experiences-list');
    
    if (experiences.length === 0) {
        experiencesList.innerHTML = '<div class="text-center py-4 text-muted">暂无经历</div>';
        return;
    }
    
    let html = '';
    experiences.forEach(experience => {
        html += `
            <div class="item-card">
                <div class="item-info">
                    <h3 class="item-title">${experience.title}</h3>
                    <div class="item-meta">
                        <span>${experience.start_date} - ${experience.end_date}</span>
                    </div>
                    <p class="item-description">${experience.description}</p>
                </div>
                <div class="item-actions">
                    <button class="btn btn-sm btn-primary" onclick="editExperience(${experience.id})">
                        <i class="fas fa-edit"></i> 编辑
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteExperience(${experience.id})">
                        <i class="fas fa-trash"></i> 删除
                    </button>
                </div>
            </div>
        `;
    });
    
    experiencesList.innerHTML = html;
}

// 打开经历模态框
function openExperienceModal(experience = null) {
    const modal = new bootstrap.Modal(document.getElementById('experience-modal'));
    const modalTitle = document.getElementById('experience-modal-label');
    const experienceForm = document.getElementById('experience-form');
    
    // 重置表单
    experienceForm.reset();
    document.getElementById('experience-id').value = '';
    
    if (experience) {
        // 编辑模式
        modalTitle.textContent = '编辑经历';
        document.getElementById('experience-id').value = experience.id;
        document.getElementById('experience-title').value = experience.title;
        document.getElementById('experience-company').value = experience.company;
        document.getElementById('experience-start').value = experience.start_date;
        document.getElementById('experience-end').value = experience.end_date;
        document.getElementById('experience-description').value = experience.description;
    } else {
        // 新增模式
        modalTitle.textContent = '新增经历';
    }
    
    modal.show();
}

// 编辑经历
function editExperience(id) {
    // 这里应该从API获取经历详情，暂时使用模拟数据
    const mockExperience = {
        id: id,
        title: '前端开发者',
        company: '某科技公司',
        start_date: '2020年',
        end_date: '至今',
        description: '负责公司前端开发工作'
    };
    
    openExperienceModal(mockExperience);
}

// 保存经历
function saveExperience() {
    const formData = new FormData(document.getElementById('experience-form'));
    const experienceId = document.getElementById('experience-id').value;
    
    // 这里应该发送到API，暂时模拟保存
    console.log(experienceId ? '更新经历:' : '新增经历:', Object.fromEntries(formData));
    
    // 关闭模态框
    const modal = bootstrap.Modal.getInstance(document.getElementById('experience-modal'));
    modal.hide();
    
    // 重新加载经历列表
    loadExperiences();
    
    // 显示成功消息
    showMessage(experienceId ? '经历更新成功' : '经历添加成功', 'success');
}

// 删除经历
function deleteExperience(id) {
    if (confirm('确定要删除这个经历吗？')) {
        // 这里应该发送到API，暂时模拟删除
        console.log('删除经历:', id);
        
        // 重新加载经历列表
        loadExperiences();
        
        // 显示成功消息
        showMessage('经历删除成功', 'success');
    }
}

// 初始化技能管理
function initSkillManagement() {
    const addSkillBtn = document.getElementById('add-skill');
    const skillForm = document.getElementById('skill-form');
    
    // 加载技能列表
    loadSkills();
    
    // 打开新增技能模态框
    if (addSkillBtn) {
        addSkillBtn.addEventListener('click', function() {
            openSkillModal();
        });
    }
    
    // 提交技能表单
    if (skillForm) {
        skillForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveSkill();
        });
    }
}

// 加载技能列表
function loadSkills() {
    const skillsList = document.getElementById('skills-list');
    
    // 显示加载状态
    skillsList.innerHTML = '<div class="loading">加载中...</div>';
    
    // 从API获取数据
    apiRequest('skills')
        .then(data => {
            const skills = data.data;
            // 渲染技能列表
            renderSkills(skills);
        })
        .catch(error => {
            console.error('加载技能列表失败:', error);
            skillsList.innerHTML = '<div class="text-center py-4 text-muted">加载失败，请重试</div>';
        });
}

// 渲染技能列表
function renderSkills(skills) {
    const skillsList = document.getElementById('skills-list');
    
    if (skills.length === 0) {
        skillsList.innerHTML = '<div class="text-center py-4 text-muted">暂无技能</div>';
        return;
    }
    
    // 按排序号排序
    skills.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    
    let html = '';
    skills.forEach(skill => {
        html += `
            <div class="item-card">
                <div class="item-info">
                    <h3 class="item-title">
                        ${skill.icon ? `<i class="fab fa-${skill.icon}" style="margin-right: 0.5rem; color: #6c63ff;"></i>` : ''}
                        ${skill.name}
                    </h3>
                    <div class="item-meta">
                        <span>熟练度: ${skill.proficiency}%</span>
                    </div>
                    <div class="progress" style="height: 8px; margin-top: 0.5rem;">
                        <div class="progress-bar" role="progressbar" style="width: ${skill.proficiency}%; background-color: #6c63ff;" aria-valuenow="${skill.proficiency}" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                </div>
                <div class="item-actions">
                    <button class="btn btn-sm btn-primary" onclick="editSkill(${skill.id})">
                        <i class="fas fa-edit"></i> 编辑
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteSkill(${skill.id})">
                        <i class="fas fa-trash"></i> 删除
                    </button>
                </div>
            </div>
        `;
    });
    
    skillsList.innerHTML = html;
}

// 打开技能模态框
function openSkillModal(skill = null) {
    const modal = new bootstrap.Modal(document.getElementById('skill-modal'));
    const modalTitle = document.getElementById('skill-modal-label');
    const skillForm = document.getElementById('skill-form');
    
    // 重置表单
    skillForm.reset();
    document.getElementById('skill-id').value = '';
    
    if (skill) {
        // 编辑模式
        modalTitle.textContent = '编辑技能';
        document.getElementById('skill-id').value = skill.id;
        document.getElementById('skill-name').value = skill.name;
        document.getElementById('skill-proficiency').value = skill.proficiency;
        document.getElementById('skill-icon').value = skill.icon;
        document.getElementById('skill-sort').value = skill.sort_order;
    } else {
        // 新增模式
        modalTitle.textContent = '新增技能';
    }
    
    modal.show();
}

// 编辑技能
function editSkill(id) {
    // 这里应该从API获取技能详情，暂时使用模拟数据
    const mockSkill = {
        id: id,
        name: `技能${id}`,
        proficiency: 80 + id * 2,
        icon: 'code',
        sort_order: id
    };
    
    openSkillModal(mockSkill);
}

// 保存技能
function saveSkill() {
    const formData = new FormData(document.getElementById('skill-form'));
    const skillId = document.getElementById('skill-id').value;
    
    // 这里应该发送到API，暂时模拟保存
    console.log(skillId ? '更新技能:' : '新增技能:', Object.fromEntries(formData));
    
    // 关闭模态框
    const modal = bootstrap.Modal.getInstance(document.getElementById('skill-modal'));
    modal.hide();
    
    // 重新加载技能列表
    loadSkills();
    
    // 显示成功消息
    showMessage(skillId ? '技能更新成功' : '技能添加成功', 'success');
}

// 删除技能
function deleteSkill(id) {
    if (confirm('确定要删除这个技能吗？')) {
        // 这里应该发送到API，暂时模拟删除
        console.log('删除技能:', id);
        
        // 重新加载技能列表
        loadSkills();
        
        // 显示成功消息
        showMessage('技能删除成功', 'success');
    }
}

// 初始化工具管理
function initToolManagement() {
    const addToolBtn = document.getElementById('add-tool');
    const toolForm = document.getElementById('tool-form');
    
    // 加载工具列表
    loadTools();
    
    // 打开新增工具模态框
    if (addToolBtn) {
        addToolBtn.addEventListener('click', function() {
            openToolModal();
        });
    }
    
    // 提交工具表单
    if (toolForm) {
        toolForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveTool();
        });
    }
}

// 加载工具列表
function loadTools() {
    const toolsList = document.getElementById('tools-list');
    
    // 显示加载状态
    toolsList.innerHTML = '<div class="loading">加载中...</div>';
    
    // 从API获取数据
    apiRequest('tools')
        .then(data => {
            const tools = data.data;
            // 渲染工具列表
            renderTools(tools);
        })
        .catch(error => {
            console.error('加载工具列表失败:', error);
            toolsList.innerHTML = '<div class="text-center py-4 text-muted">加载失败，请重试</div>';
        });
}

// 渲染工具列表
function renderTools(tools) {
    const toolsList = document.getElementById('tools-list');
    
    if (tools.length === 0) {
        toolsList.innerHTML = '<div class="text-center py-4 text-muted">暂无工具</div>';
        return;
    }
    
    let html = '';
    tools.forEach(tool => {
        html += `
            <div class="item-card ${tool.type}">
                <div class="item-info">
                    <h3 class="item-title">${tool.name}</h3>
                    <div class="item-meta">
                        <span class="badge bg-secondary">${tool.type}</span> | 
                        <span class="badge bg-primary">${tool.category}</span> | 
                        <span>${tool.size}</span> | 
                        <span>${tool.downloads} 次下载</span> | 
                        <span>${tool.created_at}</span>
                    </div>
                    <p class="item-description">${tool.description}</p>
                </div>
                <div class="item-actions">
                    <button class="btn btn-sm btn-primary" onclick="editTool(${tool.id})">
                        <i class="fas fa-edit"></i> 编辑
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteTool(${tool.id})">
                        <i class="fas fa-trash"></i> 删除
                    </button>
                </div>
            </div>
        `;
    });
    
    toolsList.innerHTML = html;
}

// 打开工具模态框
function openToolModal(tool = null) {
    const modal = new bootstrap.Modal(document.getElementById('tool-modal'));
    const modalTitle = document.getElementById('tool-modal-label');
    const toolForm = document.getElementById('tool-form');
    
    // 重置表单
    toolForm.reset();
    document.getElementById('tool-id').value = '';
    
    // 确保正确显示文件/链接输入框
    initToolTypeSwitch();
    
    if (tool) {
        // 编辑模式
        modalTitle.textContent = '编辑工具';
        document.getElementById('tool-id').value = tool.id;
        document.getElementById('tool-name').value = tool.name;
        document.getElementById('tool-type').value = tool.type;
        document.getElementById('tool-category').value = tool.category;
        document.getElementById('tool-description').value = tool.description;
        
        // 根据工具类型设置相应的输入
        if (tool.type === 'link') {
            document.getElementById('tool-url').value = tool.url;
        }
        
        // 触发类型切换
        initToolTypeSwitch();
    } else {
        // 新增模式
        modalTitle.textContent = '新增工具';
    }
    
    modal.show();
}

// 编辑工具
function editTool(id) {
    // 这里应该从API获取工具详情，暂时使用模拟数据
    const mockTool = {
        id: id,
        name: `工具${id}`,
        type: id % 4 === 0 ? 'link' : id % 4 === 1 ? 'file' : id % 4 === 2 ? 'folder' : 'archive',
        category: 'software',
        description: `这是工具${id}的描述`,
        size: `${id * 2.5} MB`,
        downloads: id * 50,
        created_at: '2023-12-01',
        url: id % 4 === 0 ? 'https://example.com' : ''
    };
    
    openToolModal(mockTool);
}

// 保存工具
function saveTool() {
    const formData = new FormData(document.getElementById('tool-form'));
    const toolId = document.getElementById('tool-id').value;
    
    // 这里应该发送到API，暂时模拟保存
    console.log(toolId ? '更新工具:' : '新增工具:', Object.fromEntries(formData));
    
    // 关闭模态框
    const modal = bootstrap.Modal.getInstance(document.getElementById('tool-modal'));
    modal.hide();
    
    // 重新加载工具列表
    loadTools();
    
    // 显示成功消息
    showMessage(toolId ? '工具更新成功' : '工具添加成功', 'success');
}

// 删除工具
function deleteTool(id) {
    if (confirm('确定要删除这个工具吗？')) {
        // 这里应该发送到API，暂时模拟删除
        console.log('删除工具:', id);
        
        // 重新加载工具列表
        loadTools();
        
        // 显示成功消息
        showMessage('工具删除成功', 'success');
    }
}

// 初始化工具类型切换
function initToolTypeSwitch() {
    const toolTypeSelect = document.getElementById('tool-type');
    const fileGroup = document.getElementById('tool-file-group');
    const urlGroup = document.getElementById('tool-url-group');
    
    if (toolTypeSelect && fileGroup && urlGroup) {
        // 设置初始状态
        function updateToolInputs() {
            const currentType = toolTypeSelect.value;
            if (currentType === 'link') {
                // 链接类型，显示URL输入框
                fileGroup.style.display = 'none';
                urlGroup.style.display = 'block';
            } else {
                // 文件/文件夹/压缩包类型，显示文件上传框
                fileGroup.style.display = 'block';
                urlGroup.style.display = 'none';
            }
        }
        
        // 初始调用
        updateToolInputs();
        
        // 监听类型变化
        toolTypeSelect.addEventListener('change', updateToolInputs);
    }
}

// 显示消息提示
function showMessage(message, type = 'info') {
    // 创建消息元素
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    // 添加到页面
    const adminContent = document.querySelector('.admin-content');
    adminContent.insertBefore(messageDiv, adminContent.firstChild);
    
    // 3秒后自动移除
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// 使用fetch发送请求的封装函数，兼容现有API结构
function apiRequest(action, data = null, method = 'GET') {
    // 构建URL
    const url = `${API_URL}?action=${action}`;
    
    // 构建请求配置
    const config = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    // 添加请求体
    if (data && method !== 'GET') {
        config.body = JSON.stringify(data);
    }
    
    // 发送请求
    return fetch(url, config)
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                throw new Error(data.message || '请求失败');
            }
            return data;
        })
        .catch(error => {
            console.error('API请求错误:', error);
            showMessage('请求失败: ' + error.message, 'error');
            throw error;
        });
}
