/**
 * My World - Performance Monitoring
 * Core Web Vitals Tracking and Analysis
 * 
 * Features:
 * - Core Web Vitals Monitoring (FCP, LCP, FID, CLS, TTI)
 * - Custom Performance Metrics
 * - Real-time Performance Dashboard
 * - Performance Reporting
 * - Performance Budget Validation
 */

// ============================================
// Configuration
// ============================================
const PERFORMANCE_CONFIG = {
    // Core Web Vitals Thresholds
    FCP: {
        good: 1800,
        needsImprovement: 3000,
        poor: 3000
    },
    LCP: {
        good: 2500,
        needsImprovement: 4000,
        poor: 4000
    },
    FID: {
        good: 100,
        needsImprovement: 300,
        poor: 300
    },
    CLS: {
        good: 0.1,
        needsImprovement: 0.25,
        poor: 0.25
    },
    TTI: {
        good: 3900,
        needsImprovement: 7300,
        poor: 7300
    },
    
    // Performance Budgets
    budgets: {
        totalSize: 2500000, // 2.5MB
        jsSize: 500000, // 500KB
        cssSize: 100000, // 100KB
        imageSize: 1000000, // 1MB
        fontCount: 4,
        requestCount: 50
    },
    
    // Monitoring Settings
    sampleRate: 1.0, // 100% sampling
    reportThreshold: 0.1, // Report if 10% of users experience issues
    debugMode: false,
    logToConsole: true,
    showDashboard: false
};

// ============================================
// Performance Metrics Storage
// ============================================
const performanceMetrics = {
    fcp: null,
    lcp: null,
    fid: null,
    cls: 0,
    tti: null,
    tbt: null,
    fmp: null,
    ttfb: null,
    domContentLoaded: null,
    loadComplete: null,
    firstPaint: null,
    navigationTiming: null,
    resourceTiming: [],
    longTasks: [],
    memoryUsage: null
};

// ============================================
// Utility Functions
// ============================================

/**
 * Get performance rating
 * @param {number} value - Metric value
 * @param {Object} thresholds - Threshold object
 * @returns {string} Rating (good, needs-improvement, poor)
 */
const getRating = (value, thresholds) => {
    if (value <= thresholds.good) return 'good';
    if (value <= thresholds.needsImprovement) return 'needs-improvement';
    return 'poor';
};

/**
 * Format metric value
 * @param {number} value - Metric value
 * @param {string} unit - Unit (ms, score)
 * @returns {string} Formatted value
 */
const formatMetric = (value, unit = 'ms') => {
    if (unit === 'score') {
        return value.toFixed(3);
    }
    if (value >= 1000) {
        return `${(value / 1000).toFixed(2)}s`;
    }
    return `${Math.round(value)}ms`;
};

/**
 * Log metric to console
 * @param {string} name - Metric name
 * @param {number} value - Metric value
 * @param {string} rating - Performance rating
 */
const logMetric = (name, value, rating) => {
    if (!PERFORMANCE_CONFIG.logToConsole) return;
    
    const emoji = rating === 'good' ? '✅' : rating === 'needs-improvement' ? '⚠️' : '❌';
    console.log(`${emoji} ${name}: ${formatMetric(value)} (${rating})`);
};

// ============================================
// Core Web Vitals Monitoring
// ============================================

/**
 * Monitor First Contentful Paint (FCP)
 */
const monitorFCP = () => {
    if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
            
            if (fcpEntry) {
                performanceMetrics.fcp = fcpEntry.startTime;
                const rating = getRating(performanceMetrics.fcp, PERFORMANCE_CONFIG.FCP);
                
                logMetric('FCP', performanceMetrics.fcp, rating);
                updateMetricDisplay('fcp', performanceMetrics.fcp, rating);
                
                observer.disconnect();
            }
        });
        
        observer.observe({ entryTypes: ['paint'] });
    }
};

/**
 * Monitor Largest Contentful Paint (LCP)
 */
const monitorLCP = () => {
    if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lcpEntry = entries[entries.length - 1];
            
            performanceMetrics.lcp = lcpEntry.startTime;
            const rating = getRating(performanceMetrics.lcp, PERFORMANCE_CONFIG.LCP);
            
            logMetric('LCP', performanceMetrics.lcp, rating);
            updateMetricDisplay('lcp', performanceMetrics.lcp, rating);
        });
        
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
};

/**
 * Monitor First Input Delay (FID)
 */
const monitorFID = () => {
    if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const fidEntry = entries[0];
            
            if (fidEntry) {
                performanceMetrics.fid = fidEntry.processingStart - fidEntry.startTime;
                const rating = getRating(performanceMetrics.fid, PERFORMANCE_CONFIG.FID);
                
                logMetric('FID', performanceMetrics.fid, rating);
                updateMetricDisplay('fid', performanceMetrics.fid, rating);
                
                observer.disconnect();
            }
        });
        
        observer.observe({ entryTypes: ['first-input'] });
    }
};

/**
 * Monitor Cumulative Layout Shift (CLS)
 */
const monitorCLS = () => {
    if ('PerformanceObserver' in window) {
        let clsValue = 0;
        let sessionValue = 0;
        let sessionEntries = [];
        
        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
                // Only count layout shifts without recent user input
                if (!entry.hadRecentInput) {
                    const firstSessionEntry = sessionEntries[0];
                    const lastSessionEntry = sessionEntries[sessionEntries.length - 1];
                    
                    // If entries are too far apart, start a new session
                    if (sessionValue && 
                        (entry.startTime - lastSessionEntry.startTime) > 1000 &&
                        (entry.startTime - firstSessionEntry.startTime) > 5000) {
                        sessionValue = 0;
                        sessionEntries = [];
                    }
                    
                    sessionValue += entry.value;
                    sessionEntries.push(entry);
                    
                    // If session value exceeds threshold, update CLS
                    if (sessionValue > clsValue) {
                        clsValue = sessionValue;
                        performanceMetrics.cls = clsValue;
                        const rating = getRating(performanceMetrics.cls, PERFORMANCE_CONFIG.CLS);
                        
                        logMetric('CLS', performanceMetrics.cls, rating);
                        updateMetricDisplay('cls', performanceMetrics.cls, rating);
                    }
                }
            });
        });
        
        observer.observe({ entryTypes: ['layout-shift'] });
    }
};

/**
 * Monitor Time to Interactive (TTI)
 */
const monitorTTI = () => {
    // TTI calculation requires more complex logic
    // This is a simplified version
    if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            
            // Find the last long task before FCP
            const fcp = performanceMetrics.fcp || 0;
            const longTasksAfterFCP = entries.filter(entry => 
                entry.startTime > fcp && entry.duration >= 50
            );
            
            if (longTasksAfterFCP.length > 0) {
                const lastLongTask = longTasksAfterFCP[longTasksAfterFCP.length - 1];
                performanceMetrics.tti = lastLongTask.startTime + lastLongTask.duration;
                const rating = getRating(performanceMetrics.tti, PERFORMANCE_CONFIG.TTI);
                
                logMetric('TTI', performanceMetrics.tti, rating);
                updateMetricDisplay('tti', performanceMetrics.tti, rating);
            }
        });
        
        observer.observe({ entryTypes: ['longtask'] });
    }
};

// ============================================
// Additional Performance Metrics
// ============================================

/**
 * Monitor Total Blocking Time (TBT)
 */
const monitorTBT = () => {
    if ('PerformanceObserver' in window) {
        let tbt = 0;
        const fcp = performanceMetrics.fcp || 0;
        
        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
                if (entry.startTime > fcp) {
                    tbt += Math.max(0, entry.duration - 50);
                    performanceMetrics.tbt = tbt;
                }
            });
        });
        
        observer.observe({ entryTypes: ['longtask'] });
    }
};

/**
 * Monitor First Meaningful Paint (FMP)
 */
const monitorFMP = () => {
    // FMP is deprecated, but we can estimate it
    const timing = performance.timing;
    if (timing) {
        performanceMetrics.fmp = timing.domInteractive - timing.navigationStart;
        logMetric('FMP (estimated)', performanceMetrics.fmp, 'good');
    }
};

/**
 * Monitor Time to First Byte (TTFB)
 */
const monitorTTFB = () => {
    const timing = performance.timing;
    if (timing) {
        performanceMetrics.ttfb = timing.responseStart - timing.navigationStart;
        const rating = getRating(performanceMetrics.ttfb, { good: 600, needsImprovement: 1000, poor: 1000 });
        logMetric('TTFB', performanceMetrics.ttfb, rating);
        updateMetricDisplay('ttfb', performanceMetrics.ttfb, rating);
    }
};

/**
 * Monitor Navigation Timing
 */
const monitorNavigationTiming = () => {
    window.addEventListener('load', () => {
        const timing = performance.timing;
        if (timing) {
            performanceMetrics.navigationTiming = {
                dns: timing.domainLookupEnd - timing.domainLookupStart,
                tcp: timing.connectEnd - timing.connectStart,
                ttfb: timing.responseStart - timing.requestStart,
                download: timing.responseEnd - timing.responseStart,
                domProcessing: timing.domComplete - timing.domLoading,
                domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
                loadComplete: timing.loadEventEnd - timing.navigationStart
            };
            
            performanceMetrics.domContentLoaded = performanceMetrics.navigationTiming.domContentLoaded;
            performanceMetrics.loadComplete = performanceMetrics.navigationTiming.loadComplete;
            
            logMetric('DOM Content Loaded', performanceMetrics.domContentLoaded, 'good');
            logMetric('Load Complete', performanceMetrics.loadComplete, 'good');
        }
    });
};

/**
 * Monitor Resource Timing
 */
const monitorResourceTiming = () => {
    window.addEventListener('load', () => {
        const resources = performance.getEntriesByType('resource');
        performanceMetrics.resourceTiming = resources.map(resource => ({
            name: resource.name,
            duration: resource.duration,
            size: resource.transferSize,
            type: resource.initiatorType
        }));
        
        // Calculate total size
        const totalSize = resources.reduce((sum, resource) => sum + (resource.transferSize || 0), 0);
        console.log(`Total resource size: ${(totalSize / 1024 / 1024).toFixed(2)}MB`);
        
        // Check performance budgets
        checkPerformanceBudgets(totalSize, resources);
    });
};

/**
 * Monitor Long Tasks
 */
const monitorLongTasks = () => {
    if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
                performanceMetrics.longTasks.push({
                    duration: entry.duration,
                    startTime: entry.startTime
                });
                
                if (PERFORMANCE_CONFIG.debugMode) {
                    console.warn(`Long task detected: ${entry.duration}ms at ${entry.startTime}ms`);
                }
            });
        });
        
        observer.observe({ entryTypes: ['longtask'] });
    }
};

/**
 * Monitor Memory Usage
 */
const monitorMemoryUsage = () => {
    if (window.performance && window.performance.memory) {
        const checkMemory = () => {
            const memory = window.performance.memory;
            performanceMetrics.memoryUsage = {
                usedJSHeapSize: memory.usedJSHeapSize,
                totalJSHeapSize: memory.totalJSHeapSize,
                jsHeapSizeLimit: memory.jsHeapSizeLimit
            };
            
            if (PERFORMANCE_CONFIG.debugMode) {
                console.log('Memory usage:', {
                    used: `${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`,
                    total: `${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB`,
                    limit: `${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`
                });
            }
        };
        
        // Check memory periodically
        setInterval(checkMemory, 5000);
        checkMemory();
    }
};

// ============================================
// Performance Budget Validation
// ============================================

/**
 * Check performance budgets
 * @param {number} totalSize - Total resource size
 * @param {Array} resources - Resource entries
 */
const checkPerformanceBudgets = (totalSize, resources) => {
    const budgets = PERFORMANCE_CONFIG.budgets;
    const violations = [];
    
    // Check total size
    if (totalSize > budgets.totalSize) {
        violations.push({
            type: 'totalSize',
            limit: `${(budgets.totalSize / 1024 / 1024).toFixed(2)}MB`,
            actual: `${(totalSize / 1024 / 1024).toFixed(2)}MB`,
            exceeded: true
        });
    }
    
    // Check JS size
    const jsSize = resources
        .filter(r => r.initiatorType === 'script')
        .reduce((sum, r) => sum + (r.size || 0), 0);
    
    if (jsSize > budgets.jsSize) {
        violations.push({
            type: 'jsSize',
            limit: `${(budgets.jsSize / 1024).toFixed(2)}KB`,
            actual: `${(jsSize / 1024).toFixed(2)}KB`,
            exceeded: true
        });
    }
    
    // Check CSS size
    const cssSize = resources
        .filter(r => r.initiatorType === 'link')
        .reduce((sum, r) => sum + (r.size || 0), 0);
    
    if (cssSize > budgets.cssSize) {
        violations.push({
            type: 'cssSize',
            limit: `${(budgets.cssSize / 1024).toFixed(2)}KB`,
            actual: `${(cssSize / 1024).toFixed(2)}KB`,
            exceeded: true
        });
    }
    
    // Check image size
    const imageSize = resources
        .filter(r => r.initiatorType === 'img')
        .reduce((sum, r) => sum + (r.size || 0), 0);
    
    if (imageSize > budgets.imageSize) {
        violations.push({
            type: 'imageSize',
            limit: `${(budgets.imageSize / 1024 / 1024).toFixed(2)}MB`,
            actual: `${(imageSize / 1024 / 1024).toFixed(2)}MB`,
            exceeded: true
        });
    }
    
    // Check request count
    if (resources.length > budgets.requestCount) {
        violations.push({
            type: 'requestCount',
            limit: budgets.requestCount,
            actual: resources.length,
            exceeded: true
        });
    }
    
    // Log violations
    if (violations.length > 0) {
        console.warn('Performance budget violations:', violations);
        showPerformanceAlert(violations);
    }
};

/**
 * Show performance alert
 * @param {Array} violations - Budget violations
 */
const showPerformanceAlert = (violations) => {
    const alert = document.createElement('div');
    alert.className = 'performance-alert';
    alert.innerHTML = `
        <div class="performance-alert-content">
            <h3>Performance Budget Violations</h3>
            <ul>
                ${violations.map(v => `
                    <li>
                        <strong>${v.type}:</strong> 
                        ${v.actual} exceeds limit of ${v.limit}
                    </li>
                `).join('')}
            </ul>
            <button onclick="this.parentElement.parentElement.remove()">Close</button>
        </div>
    `;
    
    alert.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 10000;
        background: rgba(255, 0, 85, 0.9);
        color: white;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        max-width: 400px;
    `;
    
    document.body.appendChild(alert);
};

// ============================================
// Performance Dashboard
// ============================================

/**
 * Update metric display
 * @param {string} metricName - Metric name
 * @param {number} value - Metric value
 * @param {string} rating - Performance rating
 */
const updateMetricDisplay = (metricName, value, rating) => {
    if (!PERFORMANCE_CONFIG.showDashboard) return;
    
    const display = document.getElementById(`perf-${metricName}`);
    if (display) {
        display.textContent = formatMetric(value, metricName === 'cls' ? 'score' : 'ms');
        display.className = `performance-metric ${rating}`;
    }
};

/**
 * Create performance dashboard
 */
const createPerformanceDashboard = () => {
    if (!PERFORMANCE_CONFIG.showDashboard) return;
    
    const dashboard = document.createElement('div');
    dashboard.className = 'performance-dashboard';
    dashboard.id = 'performance-dashboard';
    
    dashboard.innerHTML = `
        <div class="performance-header">
            <h3>Performance Metrics</h3>
            <button onclick="togglePerformanceDashboard()">Toggle</button>
        </div>
        <div class="performance-metrics">
            <div class="metric-group">
                <h4>Core Web Vitals</h4>
                <div class="metric">
                    <label>FCP</label>
                    <span id="perf-fcp" class="performance-metric">-</span>
                </div>
                <div class="metric">
                    <label>LCP</label>
                    <span id="perf-lcp" class="performance-metric">-</span>
                </div>
                <div class="metric">
                    <label>FID</label>
                    <span id="perf-fid" class="performance-metric">-</span>
                </div>
                <div class="metric">
                    <label>CLS</label>
                    <span id="perf-cls" class="performance-metric">-</span>
                </div>
                <div class="metric">
                    <label>TTI</label>
                    <span id="perf-tti" class="performance-metric">-</span>
                </div>
            </div>
            <div class="metric-group">
                <h4>Additional Metrics</h4>
                <div class="metric">
                    <label>TTFB</label>
                    <span id="perf-ttfb" class="performance-metric">-</span>
                </div>
                <div class="metric">
                    <label>TBT</label>
                    <span id="perf-tbt" class="performance-metric">-</span>
                </div>
                <div class="metric">
                    <label>DOM Content Loaded</label>
                    <span id="perf-domContentLoaded" class="performance-metric">-</span>
                </div>
                <div class="metric">
                    <label>Load Complete</label>
                    <span id="perf-loadComplete" class="performance-metric">-</span>
                </div>
            </div>
        </div>
    `;
    
    dashboard.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        font-family: monospace;
        font-size: 12px;
        max-width: 300px;
        display: none;
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .performance-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        .performance-header h3 {
            margin: 0;
            font-size: 14px;
        }
        .performance-header button {
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            cursor: pointer;
        }
        .performance-metrics {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        .metric-group h4 {
            margin: 0 0 10px 0;
            font-size: 12px;
            color: #888;
        }
        .metric {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
        }
        .metric label {
            color: #888;
        }
        .performance-metric {
            font-weight: bold;
        }
        .performance-metric.good {
            color: #00FF94;
        }
        .performance-metric.needs-improvement {
            color: #FFD600;
        }
        .performance-metric.poor {
            color: #FF0055;
        }
        .performance-dashboard.visible {
            display: block;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(dashboard);
};

/**
 * Toggle performance dashboard
 */
const togglePerformanceDashboard = () => {
    const dashboard = document.getElementById('performance-dashboard');
    if (dashboard) {
        dashboard.classList.toggle('visible');
    }
};

// ============================================
// Performance Reporting
// ============================================

/**
 * Generate performance report
 * @returns {Object} Performance report
 */
const generatePerformanceReport = () => {
    return {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        viewport: {
            width: window.innerWidth,
            height: window.innerHeight
        },
        connection: navigator.connection ? {
            effectiveType: navigator.connection.effectiveType,
            downlink: navigator.connection.downlink,
            rtt: navigator.connection.rtt
        } : null,
        metrics: {
            fcp: performanceMetrics.fcp,
            lcp: performanceMetrics.lcp,
            fid: performanceMetrics.fid,
            cls: performanceMetrics.cls,
            tti: performanceMetrics.tti,
            ttfb: performanceMetrics.ttfb,
            tbt: performanceMetrics.tbt,
            domContentLoaded: performanceMetrics.domContentLoaded,
            loadComplete: performanceMetrics.loadComplete
        },
        ratings: {
            fcp: performanceMetrics.fcp ? getRating(performanceMetrics.fcp, PERFORMANCE_CONFIG.FCP) : null,
            lcp: performanceMetrics.lcp ? getRating(performanceMetrics.lcp, PERFORMANCE_CONFIG.LCP) : null,
            fid: performanceMetrics.fid ? getRating(performanceMetrics.fid, PERFORMANCE_CONFIG.FID) : null,
            cls: getRating(performanceMetrics.cls, PERFORMANCE_CONFIG.CLS),
            tti: performanceMetrics.tti ? getRating(performanceMetrics.tti, PERFORMANCE_CONFIG.TTI) : null
        },
        longTasks: performanceMetrics.longTasks,
        memoryUsage: performanceMetrics.memoryUsage
    };
};

/**
 * Send performance report to analytics
 * @param {Object} report - Performance report
 */
const sendPerformanceReport = (report) => {
    // Send to analytics service
    // Example: Google Analytics, Custom Analytics, etc.
    if (PERFORMANCE_CONFIG.debugMode) {
        console.log('Performance report:', report);
    }
    
    // Send to your analytics endpoint
    // fetch('/api/performance', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(report)
    // });
};

/**
 * Schedule performance report
 */
const schedulePerformanceReport = () => {
    // Send report after page load
    window.addEventListener('load', () => {
        setTimeout(() => {
            const report = generatePerformanceReport();
            sendPerformanceReport(report);
        }, 5000);
    });
};

// ============================================
// Initialization
// ============================================

/**
 * Initialize performance monitoring
 */
const initPerformanceMonitoring = () => {
    // Create dashboard if enabled
    if (PERFORMANCE_CONFIG.showDashboard) {
        createPerformanceDashboard();
    }
    
    // Monitor Core Web Vitals
    monitorFCP();
    monitorLCP();
    monitorFID();
    monitorCLS();
    monitorTTI();
    
    // Monitor additional metrics
    monitorTBT();
    monitorFMP();
    monitorTTFB();
    monitorNavigationTiming();
    monitorResourceTiming();
    monitorLongTasks();
    monitorMemoryUsage();
    
    // Schedule reporting
    schedulePerformanceReport();
    
    console.log('Performance monitoring initialized');
};

// ============================================
// Export Functions
// ============================================

// Export to global scope
window.PerformanceMonitor = {
    init: initPerformanceMonitoring,
    getReport: generatePerformanceReport,
    getMetrics: () => performanceMetrics,
    toggleDashboard: togglePerformanceDashboard,
    config: PERFORMANCE_CONFIG
};

// Auto-initialize if enabled
if (PERFORMANCE_CONFIG.sampleRate > Math.random()) {
    initPerformanceMonitoring();
}

// ============================================
// Module Export
// ============================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initPerformanceMonitoring,
        generatePerformanceReport,
        getMetrics: () => performanceMetrics,
        PERFORMANCE_CONFIG
    };
}
