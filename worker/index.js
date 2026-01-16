export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders,
      });
    }

    try {
      const url = new URL(request.url);
      const action = url.searchParams.get('action') || 'all';
      
      const hasD1 = !!env.DB;
      
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
        
        const requestBody = await request.json();
        const result = await handlePostRequest(env.DB, action, requestBody);
        
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
      
      let data = mockData;

      if (hasD1) {
        try {
          data = await getDataFromD1(env.DB, action);
        } catch (dbError) {
          console.error('D1数据库错误:', dbError);
        }
      }

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

async function getDataFromD1(db, action) {
  const result = {};
  
  await initDatabase(db);
  
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
      result.personal = await getPersonalData(db);
      result.projects = await getProjectsData(db);
      result.experiences = await getExperiencesData(db);
      result.skills = await getSkillsData(db);
      result.tools = await getToolsData(db);
      break;
  }
  
  return result;
}

async function initDatabase(db) {
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
  
  await db.exec(`
    CREATE TABLE IF NOT EXISTS experiences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      start_date TEXT,
      end_date TEXT,
      description TEXT
    );
  `);
  
  await db.exec(`
    CREATE TABLE IF NOT EXISTS skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      icon TEXT,
      proficiency INTEGER DEFAULT 0,
      sort_order INTEGER DEFAULT 0
    );
  `);
  
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
  
  const personalCount = await db.prepare('SELECT COUNT(*) as count FROM personal').first();
  if (!personalCount || personalCount.count === 0) {
    await db.prepare(`
      INSERT INTO personal (name, introduction, avatar, email, phone, github, weibo)
      VALUES (?, ?, ?, ?, ?, ?)
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

async function getPersonalData(db) {
  const personal = await db.prepare('SELECT * FROM personal ORDER BY id DESC LIMIT 1').first();
  return personal || null;
}

async function getProjectsData(db) {
  const projects = await db.prepare('SELECT * FROM projects ORDER BY sort_order ASC').all();
  return projects.results.map(project => ({
    ...project,
    tags: project.tags ? JSON.parse(project.tags) : []
  }));
}

async function getExperiencesData(db) {
  const experiences = await db.prepare('SELECT * FROM experiences ORDER BY id ASC').all();
  return experiences.results;
}

async function getSkillsData(db) {
  const skills = await db.prepare('SELECT * FROM skills ORDER BY sort_order ASC').all();
  return skills.results;
}

async function getToolsData(db) {
  const tools = await db.prepare('SELECT * FROM tools ORDER BY id ASC').all();
  return tools.results.map(tool => ({
    ...tool,
    tags: tool.tags ? JSON.parse(tool.tags) : []
  }));
}

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

async function updatePersonalData(db, data) {
  if (data.id) {
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
    await db.exec('DELETE FROM personal');
    
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

async function updateProjectData(db, data) {
  const tagsJson = JSON.stringify(data.tags || []);
  
  if (data.id) {
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

async function updateExperienceData(db, data) {
  if (data.id) {
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

async function updateSkillData(db, data) {
  if (data.id) {
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

async function updateToolData(db, data) {
  const tagsJson = JSON.stringify(data.tags || []);
  
  if (data.id) {
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