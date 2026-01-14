// 模拟数据，替代 API 请求
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