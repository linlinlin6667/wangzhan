export default {
  async fetch(request, env) {
    // 设置CORS头
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // 处理OPTIONS请求
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders,
      });
    }

    try {
      const url = new URL(request.url);
      const action = url.searchParams.get('action') || 'all';
      
      // 检查是否配置了D1数据库
      const hasD1 = !!env.DB;
      
      // 处理POST请求（数据更新）
      if (request.method === 'POST') {
        if (!hasD1) {
          return new Response(JSON.stringify({
            success: false,
            message: 'D1数据库未配置，无法更新数据'
          }), {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          });
        }
        
        // 解析请求体
        const requestBody = await request.json();
        
        // 执行数据更新
        const result = await handlePostRequest(env.DB, action, requestBody);
        
        // 返回响应
        return new Response(JSON.stringify({
          success: true,
          data: result
        }), {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }

      // 模拟数据（作为回退）
      const mockData = {
        personal: {
          id: 1,
          name: '张三',
          introduction: '你好，我是张三，一名前端开发者',
          avatar: 'https://picsum.photos/seed/avatar/300/300',
          email: 'zhangsan@example.com',
          phone: '13800138000',
          github: 'https://github.com',
          weibo: 'https://weibo.com'
        },
        projects: [
          {
            id: 1,
            name: '项目名称1',
            description: '这是一个项目描述，介绍项目的功能和特点。',
            image: 'https://picsum.photos/seed/project1/600/400',
            category_id: 1,
            category_name: 'Web 开发',
            sort_order: 1,
            tags: ['前端开发', 'HTML', 'CSS', 'JavaScript']
          },
          {
            id: 2,
            name: '项目名称2',
            description: '这是一个项目描述，介绍项目的功能和特点。',
            image: 'https://picsum.photos/seed/project2/600/400',
            category_id: 2,
            category_name: '移动应用',
            sort_order: 2,
            tags: ['React Native', '移动开发', 'JavaScript']
          },
          {
            id: 3,
            name: '项目名称3',
            description: '这是一个项目描述，介绍项目的功能和特点。',
            image: 'https://picsum.photos/seed/project3/600/400',
            category_id: 1,
            category_name: 'Web 开发',
            sort_order: 3,
            tags: ['Vue.js', '前端开发', 'UI/UX']
          }
        ],
        experiences: [
          {
            id: 1,
            title: '前端开发者',
            start_date: '2020年',
            end_date: '至今',
            description: '在公司负责前端开发工作，参与了多个大型项目的开发，包括电商平台、企业管理系统等。'
          },
          {
            id: 2,
            title: '计算机科学与技术专业',
            start_date: '2016年',
            end_date: '2020年',
            description: '在大学期间学习了计算机相关课程，包括数据结构、算法、操作系统、计算机网络等。'
          }
        ],
        skills: [
          {
            id: 1,
            name: 'HTML5',
            icon: 'html5',
            proficiency: 95,
            sort_order: 1
          },
          {
            id: 2,
            name: 'CSS3',
            icon: 'css3-alt',
            proficiency: 90,
            sort_order: 2
          },
          {
            id: 3,
            name: 'JavaScript',
            icon: 'js',
            proficiency: 85,
            sort_order: 3
          },
          {
            id: 4,
            name: 'React',
            icon: 'react',
            proficiency: 80,
            sort_order: 4
          },
          {
            id: 5,
            name: 'Vue',
            icon: 'vuejs',
            proficiency: 75,
            sort_order: 5
          }
        ],
        tools: [
          {
            id: 1,
            name: '前端开发工具包',
            description: '包含各种前端开发常用工具和资源，包括HTML、CSS、JavaScript等方面的工具。',
            category: 'software',
            type: 'file',
            url: 'https://example.com/tools/frontend-dev-pack.zip',
            size: '15.2 MB',
            downloads: 234,
            created_at: '2023-12-01',
            tags: ['前端开发', 'HTML', 'CSS', 'JavaScript']
          },
          {
            id: 2,
            name: '设计资源库',
            description: '包含大量设计资源，包括图标、模板、字体等，适合UI/UX设计师使用。',
            category: 'document',
            type: 'file',
            url: 'https://example.com/tools/design-resources.zip',
            size: '8.7 MB',
            downloads: 189,
            created_at: '2023-11-25',
            tags: ['设计', 'UI', 'UX', '资源库']
          },
          {
            id: 3,
            name: '在线代码编辑器',
            description: '一个功能强大的在线代码编辑器，支持多种编程语言，提供实时预览和调试功能。',
            category: 'website',
            type: 'website',
            url: 'https://example.com/online-editor',
            size: '在线工具',
            downloads: 567,
            created_at: '2023-11-20',
            tags: ['在线工具', '代码编辑器', '编程']
          },
          {
            id: 4,
            name: 'Markdown编辑器',
            description: '简洁高效的Markdown编辑器，支持实时预览和多种导出格式。',
            category: 'software',
            type: 'file',
            url: 'https://example.com/tools/markdown-editor.exe',
            size: '3.5 MB',
            downloads: 98,
            created_at: '2023-11-15',
            tags: ['Markdown', '编辑器', '写作']
          },
          {
            id: 5,
            name: '色彩搭配工具',
            description: '帮助设计师和开发者选择和谐色彩搭配的在线工具，提供多种配色方案。',
            category: 'website',
            type: 'website',
            url: 'https://example.com/color-picker',
            size: '在线工具',
            downloads: 342,
            created_at: '2023-11-10',
            tags: ['设计', '色彩', '配色', '在线工具']
          },
          {
            id: 6,
            name: '性能优化指南',
            description: '网站性能优化的详细指南，包含各种优化技巧和最佳实践。',
            category: 'document',
            type: 'file',
            url: 'https://example.com/tools/performance-guide.pdf',
            size: '1.2 MB',
            downloads: 156,
            created_at: '2023-11-05',
            tags: ['性能优化', '网站优化', '指南', 'PDF']
          }
        ]
      };

      // 初始化数据对象
      let data = mockData;

      // 使用D1数据库获取数据（如果可用）
      if (hasD1) {
        try {
          // 使用D1数据库获取数据
          data = await getDataFromD1(env.DB, action);
        } catch (dbError) {
          // 数据库错误时回退到模拟数据
          console.error('D1数据库错误:', dbError);
        }
      }

      // 根据action参数返回不同数据
      let responseData;
      switch (action) {
        case 'personal':
          responseData = data.personal;
          break;
        case 'projects':
          responseData = data.projects;
          break;
        case 'experiences':
          responseData = data.experiences;
          break;
        case 'skills':
          responseData = data.skills;
          break;
        case 'tools':
          responseData = data.tools;
          break;
        case 'all':
        default:
          responseData = data;
          break;
      }

      // 返回JSON响应
      return new Response(JSON.stringify({
        success: true,
        data: responseData
      }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    } catch (error) {
      // 返回错误响应
      return new Response(JSON.stringify({
        success: false,
        message: error.message
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
  }
};

// 从D1数据库获取数据
async function getDataFromD1(db, action) {
  // 初始化结果对象
  const result = {};
  
  // 检查数据库表是否存在，不存在则创建
  await initDatabase(db);
  
  // 根据action获取数据
  switch (action) {
    case 'personal':
      result.personal = await getPersonalData(db);
      break;
    case 'projects':
      result.projects = await getProjectsData(db);
      break;
    case 'experiences':
      result.experiences = await getExperiencesData(db);
      break;
    case 'skills':
      result.skills = await getSkillsData(db);
      break;
    case 'tools':
      result.tools = await getToolsData(db);
      break;
    case 'all':
    default:
      // 获取所有数据
      result.personal = await getPersonalData(db);
      result.projects = await getProjectsData(db);
      result.experiences = await getExperiencesData(db);
      result.skills = await getSkillsData(db);
      result.tools = await getToolsData(db);
      break;
  }
  
  return result;
}

// 初始化数据库（创建表和初始数据）
async function initDatabase(db) {
  // 创建personal表
  await db.exec(`
    CREATE TABLE IF NOT EXISTS personal (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      introduction TEXT,
      avatar TEXT,
      email TEXT,
      phone TEXT,
      github TEXT,
      weibo TEXT
    );
  `);
  
  // 创建projects表
  await db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      image TEXT,
      category_id INTEGER,
      category_name TEXT,
      sort_order INTEGER DEFAULT 0,
      tags TEXT
    );
  `);
  
  // 创建experiences表
  await db.exec(`
    CREATE TABLE IF NOT EXISTS experiences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      start_date TEXT,
      end_date TEXT,
      description TEXT
    );
  `);
  
  // 创建skills表
  await db.exec(`
    CREATE TABLE IF NOT EXISTS skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      icon TEXT,
      proficiency INTEGER DEFAULT 0,
      sort_order INTEGER DEFAULT 0
    );
  `);
  
  // 创建tools表
  await db.exec(`
    CREATE TABLE IF NOT EXISTS tools (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      category TEXT,
      type TEXT,
      url TEXT,
      size TEXT,
      downloads INTEGER DEFAULT 0,
      created_at TEXT,
      tags TEXT
    );
  `);
  
  // 检查personal表是否有数据，没有则插入初始数据
  const personalCount = await db.prepare('SELECT COUNT(*) as count FROM personal').first();
  if (!personalCount || personalCount.count === 0) {
    await db.prepare(`
      INSERT INTO personal (name, introduction, avatar, email, phone, github, weibo)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      '张三',
      '你好，我是张三，一名前端开发者',
      'https://picsum.photos/seed/avatar/300/300',
      'zhangsan@example.com',
      '13800138000',
      'https://github.com',
      'https://weibo.com'
    ).run();
  }
}

// 获取个人资料数据
async function getPersonalData(db) {
  const personal = await db.prepare('SELECT * FROM personal ORDER BY id DESC LIMIT 1').first();
  return personal || null;
}

// 获取作品数据
async function getProjectsData(db) {
  const projects = await db.prepare('SELECT * FROM projects ORDER BY sort_order ASC').all();
  // 解析tags字符串为数组
  return projects.results.map(project => ({
    ...project,
    tags: project.tags ? JSON.parse(project.tags) : []
  }));
}

// 获取经历数据
async function getExperiencesData(db) {
  const experiences = await db.prepare('SELECT * FROM experiences ORDER BY id ASC').all();
  return experiences.results;
}

// 获取技能数据
async function getSkillsData(db) {
  const skills = await db.prepare('SELECT * FROM skills ORDER BY sort_order ASC').all();
  return skills.results;
}

// 获取工具数据
async function getToolsData(db) {
  const tools = await db.prepare('SELECT * FROM tools ORDER BY id ASC').all();
  // 解析tags字符串为数组
  return tools.results.map(tool => ({
    ...tool,
    tags: tool.tags ? JSON.parse(tool.tags) : []
  }));
}

// 处理POST请求（数据更新）
async function handlePostRequest(db, action, data) {
  let result;
  
  switch (action) {
    case 'personal':
      result = await updatePersonalData(db, data);
      break;
    case 'projects':
      result = await updateProjectData(db, data);
      break;
    case 'experiences':
      result = await updateExperienceData(db, data);
      break;
    case 'skills':
      result = await updateSkillData(db, data);
      break;
    case 'tools':
      result = await updateToolData(db, data);
      break;
    default:
      throw new Error(`不支持的action: ${action}`);
  }
  
  return result;
}

// 更新个人资料数据
async function updatePersonalData(db, data) {
  // 如果有id则更新，否则插入
  if (data.id) {
    // 更新现有数据
    await db.prepare(`
      UPDATE personal SET 
        name = ?, 
        introduction = ?, 
        avatar = ?, 
        email = ?, 
        phone = ?, 
        github = ?, 
        weibo = ?
      WHERE id = ?
    `).bind(
      data.name,
      data.introduction,
      data.avatar,
      data.email,
      data.phone,
      data.github,
      data.weibo,
      data.id
    ).run();
    
    return await getPersonalData(db);
  } else {
    // 删除现有数据（只保留最新的一条）
    await db.exec('DELETE FROM personal');
    
    // 插入新数据
    await db.prepare(`
      INSERT INTO personal (name, introduction, avatar, email, phone, github, weibo)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      data.name,
      data.introduction,
      data.avatar,
      data.email,
      data.phone,
      data.github,
      data.weibo
    ).run();
    
    return await getPersonalData(db);
  }
}

// 更新作品数据
async function updateProjectData(db, data) {
  // 处理tags数组，转换为JSON字符串
  const tagsJson = JSON.stringify(data.tags || []);
  
  if (data.id) {
    // 更新现有作品
    await db.prepare(`
      UPDATE projects SET 
        name = ?, 
        description = ?, 
        image = ?, 
        category_id = ?, 
        category_name = ?, 
        sort_order = ?, 
        tags = ?
      WHERE id = ?
    `).bind(
      data.name,
      data.description,
      data.image,
      data.category_id,
      data.category_name,
      data.sort_order || 0,
      tagsJson,
      data.id
    ).run();
    
    return await getProjectsData(db);
  } else {
    // 插入新作品
    await db.prepare(`
      INSERT INTO projects (name, description, image, category_id, category_name, sort_order, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      data.name,
      data.description,
      data.image,
      data.category_id,
      data.category_name,
      data.sort_order || 0,
      tagsJson
    ).run();
    
    return await getProjectsData(db);
  }
}

// 更新经历数据
async function updateExperienceData(db, data) {
  if (data.id) {
    // 更新现有经历
    await db.prepare(`
      UPDATE experiences SET 
        title = ?, 
        start_date = ?, 
        end_date = ?, 
        description = ?
      WHERE id = ?
    `).bind(
      data.title,
      data.start_date,
      data.end_date,
      data.description,
      data.id
    ).run();
    
    return await getExperiencesData(db);
  } else {
    // 插入新经历
    await db.prepare(`
      INSERT INTO experiences (title, start_date, end_date, description)
      VALUES (?, ?, ?, ?)
    `).bind(
      data.title,
      data.start_date,
      data.end_date,
      data.description
    ).run();
    
    return await getExperiencesData(db);
  }
}

// 更新技能数据
async function updateSkillData(db, data) {
  if (data.id) {
    // 更新现有技能
    await db.prepare(`
      UPDATE skills SET 
        name = ?, 
        icon = ?, 
        proficiency = ?, 
        sort_order = ?
      WHERE id = ?
    `).bind(
      data.name,
      data.icon,
      data.proficiency || 0,
      data.sort_order || 0,
      data.id
    ).run();
    
    return await getSkillsData(db);
  } else {
    // 插入新技能
    await db.prepare(`
      INSERT INTO skills (name, icon, proficiency, sort_order)
      VALUES (?, ?, ?, ?)
    `).bind(
      data.name,
      data.icon,
      data.proficiency || 0,
      data.sort_order || 0
    ).run();
    
    return await getSkillsData(db);
  }
}

// 更新工具数据
async function updateToolData(db, data) {
  // 处理tags数组，转换为JSON字符串
  const tagsJson = JSON.stringify(data.tags || []);
  
  if (data.id) {
    // 更新现有工具
    await db.prepare(`
      UPDATE tools SET 
        name = ?, 
        description = ?, 
        category = ?, 
        type = ?, 
        url = ?, 
        size = ?, 
        downloads = ?, 
        created_at = ?, 
        tags = ?
      WHERE id = ?
    `).bind(
      data.name,
      data.description,
      data.category,
      data.type,
      data.url,
      data.size,
      data.downloads || 0,
      data.created_at,
      tagsJson,
      data.id
    ).run();
    
    return await getToolsData(db);
  } else {
    // 插入新工具
    await db.prepare(`
      INSERT INTO tools (name, description, category, type, url, size, downloads, created_at, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      data.name,
      data.description,
      data.category,
      data.type,
      data.url,
      data.size,
      data.downloads || 0,
      data.created_at,
      tagsJson
    ).run();
    
    return await getToolsData(db);
  }
}