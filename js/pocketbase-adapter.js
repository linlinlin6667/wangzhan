/**
 * PocketBase API 适配器
 * 
 * 此文件提供与 PocketBase 后台交互的 JavaScript 接口
 * 用于替代现有的 Cloudflare Worker API
 */

class PocketBaseAdapter {
    constructor(baseUrl = 'http://localhost:8090') {
        this.baseUrl = baseUrl;
        this.apiEndpoint = `${baseUrl}/api/collections`;
    }

    /**
     * 获取所有数据
     * @param {string} collection - 集合名称
     * @returns {Promise<Object>} 返回数据对象
     */
    async getAll(collection) {
        try {
            const response = await fetch(`${this.apiEndpoint}/${collection}/records`);
            if (!response.ok) {
                throw new Error(`获取 ${collection} 数据失败: ${response.statusText}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`获取 ${collection} 数据错误:`, error);
            throw error;
        }
    }

    /**
     * 获取单条记录
     * @param {string} collection - 集合名称
     * @param {string} id - 记录ID
     * @returns {Promise<Object>} 返回记录对象
     */
    async getById(collection, id) {
        try {
            const response = await fetch(`${this.apiEndpoint}/${collection}/records/${id}`);
            if (!response.ok) {
                throw new Error(`获取 ${collection} 记录失败: ${response.statusText}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`获取 ${collection} 记录错误:`, error);
            throw error;
        }
    }

    /**
     * 创建记录
     * @param {string} collection - 集合名称
     * @param {Object} data - 记录数据
     * @returns {Promise<Object>} 返回创建的记录
     */
    async create(collection, data) {
        try {
            const response = await fetch(`${this.apiEndpoint}/${collection}/records`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error(`创建 ${collection} 记录失败: ${response.statusText}`);
            }
            const result = await response.json();
            return result;
        } catch (error) {
            console.error(`创建 ${collection} 记录错误:`, error);
            throw error;
        }
    }

    /**
     * 更新记录
     * @param {string} collection - 集合名称
     * @param {string} id - 记录ID
     * @param {Object} data - 更新的数据
     * @returns {Promise<Object>} 返回更新后的记录
     */
    async update(collection, id, data) {
        try {
            const response = await fetch(`${this.apiEndpoint}/${collection}/records/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error(`更新 ${collection} 记录失败: ${response.statusText}`);
            }
            const result = await response.json();
            return result;
        } catch (error) {
            console.error(`更新 ${collection} 记录错误:`, error);
            throw error;
        }
    }

    /**
     * 删除记录
     * @param {string} collection - 集合名称
     * @param {string} id - 记录ID
     * @returns {Promise<Object>} 返回删除结果
     */
    async delete(collection, id) {
        try {
            const response = await fetch(`${this.apiEndpoint}/${collection}/records/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error(`删除 ${collection} 记录失败: ${response.statusText}`);
            }
            const result = await response.json();
            return result;
        } catch (error) {
            console.error(`删除 ${collection} 记录错误:`, error);
            throw error;
        }
    }

    /**
     * 获取所有数据（兼容旧API）
     * @param {string} action - 数据类型
     * @returns {Promise<Object>} 返回所有数据
     */
    async getAllData(action = 'all') {
        try {
            const collections = ['personal', 'projects', 'experiences', 'skills', 'tools'];
            const result = {};

            if (action === 'all') {
                for (const collection of collections) {
                    const data = await this.getAll(collection);
                    result[collection] = data.items || [];
                }
            } else if (collections.includes(action)) {
                const data = await this.getAll(action);
                result[action] = data.items || [];
            } else {
                throw new Error(`不支持的数据类型: ${action}`);
            }

            return {
                success: true,
                data: result
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    /**
     * 更新数据（兼容旧API）
     * @param {string} action - 数据类型
     * @param {Object} data - 更新的数据
     * @returns {Promise<Object>} 返回更新后的数据
     */
    async updateData(action, data) {
        try {
            const collections = ['personal', 'projects', 'experiences', 'skills', 'tools'];
            
            if (!collections.includes(action)) {
                throw new Error(`不支持的数据类型: ${action}`);
            }

            let result;
            if (data.id) {
                result = await this.update(action, data.id, data);
            } else {
                result = await this.create(action, data);
            }

            return {
                success: true,
                data: result
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    /**
     * 上传文件
     * @param {File} file - 要上传的文件
     * @returns {Promise<Object>} 返回上传结果
     */
    async uploadFile(file) {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${this.baseUrl}/api/files/upload`, {
                method: 'POST',
                body: formData
            });
            if (!response.ok) {
                throw new Error(`上传文件失败: ${response.statusText}`);
            }
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('上传文件错误:', error);
            throw error;
        }
    }

    /**
     * 健康检查
     * @returns {Promise<boolean>} 返回服务是否健康
     */
    async healthCheck() {
        try {
            const response = await fetch(`${this.baseUrl}/api/health`);
            return response.ok;
        } catch (error) {
            console.error('健康检查失败:', error);
            return false;
        }
    }
}

// 创建全局实例
const pocketbase = new PocketBaseAdapter();

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PocketBaseAdapter;
} else if (typeof window !== 'undefined') {
    window.PocketBaseAdapter = PocketBaseAdapter;
    window.pocketbase = pocketbase;
}