/**
 * PocketBase 数据库初始化脚本
 * 
 * 此脚本用于初始化个人网站所需的数据表结构
 * 将此文件保存为 pb_hooks.js 并放在 pocketbase 目录中
 */

// 集合定义
const collections = [
    {
        name: 'personal',
        type: 'base',
        schema: [
            {
                name: 'name',
                type: 'text',
                required: true,
                options: {
                    min: 1,
                    max: 100
                }
            },
            {
                name: 'introduction',
                type: 'editor',
                required: false,
                options: {
                    max: 2000
                }
            },
            {
                name: 'avatar',
                type: 'url',
                required: false
            },
            {
                name: 'email',
                type: 'email',
                required: false
            },
            {
                name: 'phone',
                type: 'text',
                required: false,
                options: {
                    pattern: '^\\d{11}$'
                }
            },
            {
                name: 'github',
                type: 'url',
                required: false
            },
            {
                name: 'weibo',
                type: 'url',
                required: false
            }
        ]
    },
    {
        name: 'projects',
        type: 'base',
        schema: [
            {
                name: 'name',
                type: 'text',
                required: true,
                options: {
                    min: 1,
                    max: 200
                }
            },
            {
                name: 'description',
                type: 'editor',
                required: false,
                options: {
                    max: 5000
                }
            },
            {
                name: 'image',
                type: 'url',
                required: false
            },
            {
                name: 'category_id',
                type: 'number',
                required: true,
                options: {
                    min: 1
                }
            },
            {
                name: 'category_name',
                type: 'text',
                required: true,
                options: {
                    max: 50
                }
            },
            {
                name: 'sort_order',
                type: 'number',
                required: false,
                options: {
                    min: 0,
                    default: 0
                }
            },
            {
                name: 'tags',
                type: 'json',
                required: false
            }
        ]
    },
    {
        name: 'experiences',
        type: 'base',
        schema: [
            {
                name: 'title',
                type: 'text',
                required: true,
                options: {
                    min: 1,
                    max: 200
                }
            },
            {
                name: 'start_date',
                type: 'text',
                required: true,
                options: {
                    pattern: '^\\d{4}年$'
                }
            },
            {
                name: 'end_date',
                type: 'text',
                required: false,
                options: {
                    pattern: '^\\d{4}年$|^至今$'
                }
            },
            {
                name: 'description',
                type: 'editor',
                required: false,
                options: {
                    max: 5000
                }
            }
        ]
    },
    {
        name: 'skills',
        type: 'base',
        schema: [
            {
                name: 'name',
                type: 'text',
                required: true,
                options: {
                    min: 1,
                    max: 50
                }
            },
            {
                name: 'icon',
                type: 'text',
                required: true,
                options: {
                    max: 50
                }
            },
            {
                name: 'proficiency',
                type: 'number',
                required: true,
                options: {
                    min: 0,
                    max: 100
                }
            },
            {
                name: 'sort_order',
                type: 'number',
                required: false,
                options: {
                    min: 0,
                    default: 0
                }
            }
        ]
    },
    {
        name: 'tools',
        type: 'base',
        schema: [
            {
                name: 'name',
                type: 'text',
                required: true,
                options: {
                    min: 1,
                    max: 200
                }
            },
            {
                name: 'description',
                type: 'editor',
                required: false,
                options: {
                    max: 5000
                }
            },
            {
                name: 'category',
                type: 'select',
                required: true,
                options: {
                    values: ['software', 'document', 'website', 'other']
                }
            },
            {
                name: 'type',
                type: 'select',
                required: true,
                options: {
                    values: ['file', 'folder', 'archive', 'link']
                }
            },
            {
                name: 'url',
                type: 'url',
                required: false
            },
            {
                name: 'size',
                type: 'text',
                required: false,
                options: {
                    max: 50
                }
            },
            {
                name: 'downloads',
                type: 'number',
                required: false,
                options: {
                    min: 0,
                    default: 0
                }
            },
            {
                name: 'created_at',
                type: 'text',
                required: false,
                options: {
                    pattern: '^\\d{4}-\\d{2}-\\d{2}$'
                }
            },
            {
                name: 'tags',
                type: 'json',
                required: false
            }
        ]
    }
];

// 初始化函数
function initCollections() {
    console.log('开始初始化 PocketBase 集合...');
    
    collections.forEach(collection => {
        try {
            const existingCollection = $app.findCollectionByName(collection.name);
            
            if (existingCollection) {
                console.log(`集合 ${collection.name} 已存在，跳过创建`);
                return;
            }
            
            const result = $app.createCollection(collection);
            console.log(`成功创建集合: ${collection.name}`);
        } catch (error) {
            console.error(`创建集合 ${collection.name} 失败:`, error.message);
        }
    });
    
    console.log('集合初始化完成！');
}

// 导出函数
module.exports = {
    initCollections: initCollections
};