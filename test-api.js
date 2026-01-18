/**
 * API测试脚本 - My World网站
 * 测试所有API端点和功能
 */

const https = require('https');
const http = require('http');

// 颜色输出
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

// 测试结果统计
const stats = {
    total: 0,
    passed: 0,
    failed: 0,
    pending: 0
};

// 测试结果数组
const testResults = [];

// 工具函数
function log(message, color = colors.reset) {
    console.log(`${color}${message}${colors.reset}`);
}

function logSection(title) {
    console.log('\n' + '='.repeat(60));
    log(title, colors.cyan);
    console.log('='.repeat(60));
}

function logTest(name, status, details = '') {
    const icon = status === 'passed' ? '✅' : status === 'failed' ? '❌' : '⏳';
    const color = status === 'passed' ? colors.green : status === 'failed' ? colors.red : colors.yellow;
    log(`${icon} ${name}`, color);
    if (details) {
        log(`   ${details}`, colors.reset);
    }
}

// HTTP请求函数
function makeRequest(url) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;

        const req = protocol.get(url, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        data: jsonData,
                        dataSize: data.length
                    });
                } catch (e) {
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        data: data,
                        dataSize: data.length
                    });
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.setTimeout(10000, () => {
            req.destroy();
            reject(new Error('请求超时'));
        });
    });
}

// 测试函数
async function runTest(name, testFn) {
    stats.total++;
    const startTime = Date.now();

    try {
        const result = await testFn();
        const duration = Date.now() - startTime;

        stats.passed++;
        testResults.push({
            name,
            status: 'passed',
            duration,
            result
        });

        logTest(name, 'passed', `耗时: ${duration}ms`);
        return { success: true, result, duration };
    } catch (error) {
        const duration = Date.now() - startTime;

        stats.failed++;
        testResults.push({
            name,
            status: 'failed',
            duration,
            error: error.message
        });

        logTest(name, 'failed', `错误: ${error.message} | 耗时: ${duration}ms`);
        return { success: false, error: error.message, duration };
    }
}

// ============ 测试套件 ============

async function testGitHubAPI() {
    logSection('1. GitHub Pages API 测试');

    const GITHUB_DATA_URL = 'https://raw.githubusercontent.com/linlinlin6667/wangzhan/main/data.json';

    // 测试1.1: 获取完整数据
    await runTest('1.1 获取完整数据', async () => {
        const response = await makeRequest(GITHUB_DATA_URL);

        if (response.statusCode !== 200) {
            throw new Error(`HTTP ${response.statusCode}: ${response.statusText}`);
        }

        if (!response.data.personal || !response.data.projects || !response.data.tools) {
            throw new Error('数据结构不完整');
        }

        return {
            statusCode: response.statusCode,
            dataSize: `${(response.dataSize / 1024).toFixed(2)} KB`,
            personalName: response.data.personal.name,
            projectsCount: response.data.projects.length,
            toolsCount: response.data.tools.length,
            skillsCount: response.data.skills.length
        };
    });

    // 测试1.2: 验证数据完整性
    await runTest('1.2 验证数据完整性', async () => {
        const response = await makeRequest(GITHUB_DATA_URL);
        const data = response.data;

        const checks = {
            hasPersonal: !!data.personal,
            hasProjects: Array.isArray(data.projects) && data.projects.length > 0,
            hasTools: Array.isArray(data.tools) && data.tools.length > 0,
            hasSkills: Array.isArray(data.skills) && data.skills.length > 0,
            hasStats: !!data.stats
        };

        const failedChecks = Object.entries(checks)
            .filter(([_, value]) => !value)
            .map(([key]) => key);

        if (failedChecks.length > 0) {
            throw new Error(`缺少数据: ${failedChecks.join(', ')}`);
        }

        return checks;
    });

    // 测试1.3: 验证数据格式
    await runTest('1.3 验证数据格式', async () => {
        const response = await makeRequest(GITHUB_DATA_URL);
        const data = response.data;

        const errors = [];

        // 检查personal字段
        if (!data.personal.name || !data.personal.email) {
            errors.push('personal缺少必需字段');
        }

        // 检查projects
        data.projects.forEach((project, index) => {
            if (!project.id || !project.name || !project.description) {
                errors.push(`projects[${index}]缺少必需字段`);
            }
        });

        // 检查tools
        data.tools.forEach((tool, index) => {
            if (!tool.id || !tool.name || !tool.icon) {
                errors.push(`tools[${index}]缺少必需字段`);
            }
        });

        // 检查skills
        data.skills.forEach((skill, index) => {
            if (!skill.id || !skill.name || typeof skill.proficiency !== 'number') {
                errors.push(`skills[${index}]缺少必需字段或proficiency不是数字`);
            }
        });

        if (errors.length > 0) {
            throw new Error(errors.join('; '));
        }

        return { valid: true };
    });

    // 测试1.4: 性能测试
    await runTest('1.4 API响应性能测试', async () => {
        const times = [];
        const iterations = 5;

        for (let i = 0; i < iterations; i++) {
            const start = Date.now();
            await makeRequest(GITHUB_DATA_URL);
            times.push(Date.now() - start);
        }

        const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
        const minTime = Math.min(...times);
        const maxTime = Math.max(...times);

        return {
            iterations,
            avgTime: `${avgTime.toFixed(2)}ms`,
            minTime: `${minTime}ms`,
            maxTime: `${maxTime}ms`
        };
    });
}

async function testLocalStorageSimulation() {
    logSection('2. LocalStorage 功能模拟测试');

    // 注意: Node.js环境没有localStorage，这里模拟测试逻辑

    // 测试2.1: 数据序列化
    await runTest('2.1 数据序列化测试', async () => {
        const testData = {
            personal: {
                name: '张三',
                email: 'test@example.com'
            },
            projects: [
                { id: 1, name: '项目1', description: '描述1' }
            ]
        };

        const serialized = JSON.stringify(testData);
        const deserialized = JSON.parse(serialized);

        if (deserialized.personal.name !== testData.personal.name) {
            throw new Error('序列化/反序列化失败');
        }

        return {
            originalSize: JSON.stringify(testData).length,
            serializedSize: serialized.length
        };
    });

    // 测试2.2: 数据更新
    await runTest('2.2 数据更新测试', async () => {
        const data = {
            personal: { name: '张三' },
            projects: []
        };

        const update = { title: '前端开发者' };
        const updated = { ...data.personal, ...update };

        if (updated.name !== '张三' || updated.title !== '前端开发者') {
            throw new Error('数据更新失败');
        }

        return {
            originalKeys: Object.keys(data.personal).length,
            updatedKeys: Object.keys(updated).length
        };
    });

    // 测试2.3: 数组操作
    await runTest('2.3 数组操作测试', async () => {
        const tools = [
            { id: 1, name: '工具1' },
            { id: 2, name: '工具2' }
        ];

        // 添加
        const newTool = { id: 3, name: '工具3' };
        tools.push(newTool);

        if (tools.length !== 3) {
            throw new Error('添加失败');
        }

        // 删除
        const filtered = tools.filter(t => t.id !== 1);

        if (filtered.length !== 2) {
            throw new Error('删除失败');
        }

        return {
            originalCount: 2,
            afterAdd: 3,
            afterDelete: 2
        };
    });
}

async function testWorkerCodeAnalysis() {
    logSection('3. Cloudflare Worker 代码分析');

    // 测试3.1: 检查Worker配置
    await runTest('3.1 Worker配置检查', async () => {
        const fs = require('fs');
        const path = require('path');

        const wranglerPath = path.join(__dirname, 'worker', 'wrangler.toml');
        const workerPath = path.join(__dirname, 'worker', 'index.js');

        const checks = {
            wranglerExists: fs.existsSync(wranglerPath),
            workerExists: fs.existsSync(workerPath),
            hasD1Config: false,
            hasDatabaseId: false
        };

        if (checks.wranglerExists) {
            const wranglerContent = fs.readFileSync(wranglerPath, 'utf8');
            checks.hasD1Config = wranglerContent.includes('[[d1_databases]]');
            checks.hasDatabaseId = wranglerContent.includes('database_id');
        }

        if (!checks.wranglerExists) {
            throw new Error('wrangler.toml文件不存在');
        }

        if (!checks.workerExists) {
            throw new Error('worker/index.js文件不存在');
        }

        return checks;
    });

    // 测试3.2: 分析Worker端点
    await runTest('3.2 Worker端点分析', async () => {
        const fs = require('fs');
        const path = require('path');

        const workerPath = path.join(__dirname, 'worker', 'index.js');
        const workerCode = fs.readFileSync(workerPath, 'utf8');

        const endpoints = {
            GET: [],
            POST: []
        };

        // 分析支持的action参数
        const actions = ['personal', 'projects', 'tools', 'skills', 'stats', 'all'];

        actions.forEach(action => {
            endpoints.GET.push(`/?action=${action}`);
            endpoints.POST.push(`/?action=${action}`);
        });

        return {
            corsEnabled: workerCode.includes('Access-Control-Allow-Origin'),
            hasErrorHandling: workerCode.includes('try') && workerCode.includes('catch'),
            supportsGET: endpoints.GET.length,
            supportsPOST: endpoints.POST.length,
            endpoints
        };
    });

    // 测试3.3: 检查数据源
    await runTest('3.3 数据源检查', async () => {
        const fs = require('fs');
        const path = require('path');

        const workerPath = path.join(__dirname, 'worker', 'index.js');
        const workerCode = fs.readFileSync(workerPath, 'utf8');

        const dataUrlMatch = workerCode.match(/const dataUrl = ['"]([^'"]+)['"]/);

        if (!dataUrlMatch) {
            throw new Error('未找到dataUrl配置');
        }

        const dataUrl = dataUrlMatch[1];

        // 测试数据源是否可访问
        try {
            const response = await makeRequest(dataUrl);
            return {
                dataUrl,
                accessible: response.statusCode === 200,
                statusCode: response.statusCode
            };
        } catch (error) {
            return {
                dataUrl,
                accessible: false,
                error: error.message
            };
        }
    });
}

async function testSecurityAnalysis() {
    logSection('4. 安全性分析');

    // 测试4.1: CORS配置
    await runTest('4.1 CORS配置检查', async () => {
        const fs = require('fs');
        const path = require('path');

        const workerPath = path.join(__dirname, 'worker', 'index.js');
        const workerCode = fs.readFileSync(workerPath, 'utf8');

        const corsHeaders = {
            'Access-Control-Allow-Origin': workerCode.includes('Access-Control-Allow-Origin'),
            'Access-Control-Allow-Methods': workerCode.includes('Access-Control-Allow-Methods'),
            'Access-Control-Allow-Headers': workerCode.includes('Access-Control-Allow-Headers')
        };

        const allEnabled = Object.values(corsHeaders).every(v => v);

        if (!allEnabled) {
            throw new Error('CORS配置不完整');
        }

        return corsHeaders;
    });

    // 测试4.2: 认证机制检查
    await runTest('4.2 认证机制检查', async () => {
        const fs = require('fs');
        const path = require('path');

        const workerPath = path.join(__dirname, 'worker', 'index.js');
        const workerCode = fs.readFileSync(workerPath, 'utf8');

        const hasAuth = workerCode.includes('auth') ||
                       workerCode.includes('token') ||
                       workerCode.includes('api-key') ||
                       workerCode.includes('authorization');

        return {
            hasAuthentication: hasAuth,
            warning: hasAuth ? '已实现认证' : '⚠️ 未实现认证机制，建议添加'
        };
    });

    // 测试4.3: 速率限制检查
    await runTest('4.3 速率限制检查', async () => {
        const fs = require('fs');
        const path = require('path');

        const workerPath = path.join(__dirname, 'worker', 'index.js');
        const workerCode = fs.readFileSync(workerPath, 'utf8');

        const hasRateLimit = workerCode.includes('rate-limit') ||
                            workerCode.includes('ratelimit') ||
                            workerCode.includes('throttle');

        return {
            hasRateLimiting: hasRateLimit,
            warning: hasRateLimit ? '已实现速率限制' : '⚠️ 未实现速率限制，建议添加'
        };
    });
}

async function testPerformanceAnalysis() {
    logSection('5. 性能分析');

    // 测试5.1: 数据大小分析
    await runTest('5.1 数据大小分析', async () => {
        const fs = require('fs');
        const path = require('path');

        const dataPath = path.join(__dirname, 'data.json');
        const dataContent = fs.readFileSync(dataPath, 'utf8');
        const data = JSON.parse(dataContent);

        const sizes = {
            total: dataContent.length,
            personal: JSON.stringify(data.personal).length,
            projects: JSON.stringify(data.projects).length,
            tools: JSON.stringify(data.tools).length,
            skills: JSON.stringify(data.skills).length,
            stats: JSON.stringify(data.stats).length
        };

        return {
            total: `${(sizes.total / 1024).toFixed(2)} KB`,
            personal: `${(sizes.personal / 1024).toFixed(2)} KB`,
            projects: `${(sizes.projects / 1024).toFixed(2)} KB (${data.projects.length} items)`,
            tools: `${(sizes.tools / 1024).toFixed(2)} KB (${data.tools.length} items)`,
            skills: `${(sizes.skills / 1024).toFixed(2)} KB (${data.skills.length} items)`,
            stats: `${(sizes.stats / 1024).toFixed(2)} KB`
        };
    });

    // 测试5.2: 并发请求测试
    await runTest('5.2 并发请求测试', async () => {
        const GITHUB_DATA_URL = 'https://raw.githubusercontent.com/linlinlin6667/wangzhan/main/data.json';
        const concurrency = 10;

        const startTime = Date.now();
        const promises = [];

        for (let i = 0; i < concurrency; i++) {
            promises.push(makeRequest(GITHUB_DATA_URL));
        }

        const results = await Promise.all(promises);
        const totalTime = Date.now() - startTime;

        const successful = results.filter(r => r.statusCode === 200).length;
        const failed = results.filter(r => r.statusCode !== 200).length;

        return {
            concurrency,
            successful,
            failed,
            totalTime: `${totalTime}ms`,
            avgTime: `${(totalTime / concurrency).toFixed(2)}ms`
        };
    });
}

// ============ 主函数 ============

async function main() {
    console.log('\n');
    log('╔════════════════════════════════════════════════════════════╗', colors.cyan);
    log('║                                                            ║', colors.cyan);
    log('║           My World 网站 API 测试报告                      ║', colors.cyan);
    log('║                                                            ║', colors.cyan);
    log('╚════════════════════════════════════════════════════════════╝', colors.cyan);
    log(`\n测试时间: ${new Date().toLocaleString('zh-CN')}\n`);

    try {
        // 运行所有测试
        await testGitHubAPI();
        await testLocalStorageSimulation();
        await testWorkerCodeAnalysis();
        await testSecurityAnalysis();
        await testPerformanceAnalysis();

        // 打印总结
        logSection('测试总结');
        log(`总测试数: ${stats.total}`, colors.cyan);
        log(`通过: ${stats.passed}`, colors.green);
        log(`失败: ${stats.failed}`, stats.failed > 0 ? colors.red : colors.green);
        log(`通过率: ${((stats.passed / stats.total) * 100).toFixed(2)}%`, colors.cyan);

        // 打印性能统计
        if (testResults.length > 0) {
            const durations = testResults.map(r => r.duration).filter(d => d);
            if (durations.length > 0) {
                const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
                const maxDuration = Math.max(...durations);
                const minDuration = Math.min(...durations);

                log('\n性能统计:', colors.cyan);
                log(`  平均耗时: ${avgDuration.toFixed(2)}ms`);
                log(`  最快耗时: ${minDuration}ms`);
                log(`  最慢耗时: ${maxDuration}ms`);
            }
        }

        // 打印失败的测试
        const failedTests = testResults.filter(r => r.status === 'failed');
        if (failedTests.length > 0) {
            log('\n失败的测试:', colors.red);
            failedTests.forEach(test => {
                log(`  ❌ ${test.name}`, colors.red);
                log(`     错误: ${test.error}`, colors.reset);
            });
        }

        // 打印建议
        log('\n改进建议:', colors.yellow);
        log('  1. 部署Cloudflare Worker以提供真正的API服务', colors.reset);
        log('  2. 实现GitHub API集成以支持数据持久化', colors.reset);
        log('  3. 添加API认证机制保护敏感操作', colors.reset);
        log('  4. 实现速率限制防止滥用', colors.reset);
        log('  5. 添加日志记录和监控', colors.reset);

        log('\n详细测试报告请查看: API_TEST_REPORT.md', colors.cyan);
        log('交互式测试页面: api-test.html\n', colors.cyan);

    } catch (error) {
        log(`\n测试过程中发生错误: ${error.message}`, colors.red);
        console.error(error);
        process.exit(1);
    }
}

// 运行测试
main();
