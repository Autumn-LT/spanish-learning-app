// ============================================================
// 百度智能云 OCR 本地代理服务器
// 用途：解决浏览器 CORS 跨域限制，中转请求到百度 API
// 启动方式：node proxy.js
// ============================================================

const http = require('http');
const https = require('https');
const url = require('url');

const PORT = 3456;
const BAIDU_TOKEN_URL = 'https://aip.baidubce.com/oauth/2.0/token';
const BAIDU_TABLE_OCR_URL = 'https://aip.baidubce.com/rest/2.0/ocr/v1/table';

// ===== 百度 API 配置（从 index.html 传入）=====
// 代理启动时可通过环境变量覆盖，默认值留空由前端传参
const API_KEY = process.env.BAIDU_API_KEY || '';
const SECRET_KEY = process.env.BAIDU_SECRET_KEY || '';

// ===== 缓存 access_token =====
let cachedToken = null;
let tokenExpiry = 0;

// ===== 获取 access_token =====
function getAccessToken(apiKey, secretKey) {
    return new Promise((resolve, reject) => {
        const query = `grant_type=client_credentials&client_id=${encodeURIComponent(apiKey)}&client_secret=${encodeURIComponent(secretKey)}`;
        const reqUrl = `${BAIDU_TOKEN_URL}?${query}`;

        https.get(reqUrl, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (json.access_token) {
                        resolve(json);
                    } else {
                        reject(new Error(json.error_description || '获取 token 失败'));
                    }
                } catch (e) {
                    reject(new Error('解析 token 响应失败: ' + e.message));
                }
            });
        }).on('error', reject);
    });
}

// ===== 调用百度表格文字识别 =====
function callBaiduTableOCR(token, base64Image) {
    return new Promise((resolve, reject) => {
        const postData = `image=${encodeURIComponent(base64Image)}&result_type=json`;
        const parsed = new URL(BAIDU_TABLE_OCR_URL);
        // 追加 access_token 作为 query 参数
        const reqUrl = `${BAIDU_TABLE_OCR_URL}?access_token=${token}`;

        const options = {
            hostname: parsed.hostname,
            path: parsed.pathname + `?access_token=${token}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(new Error('解析 OCR 响应失败: ' + e.message));
                }
            });
        });

        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

// ===== 创建 HTTP 服务器 =====
const server = http.createServer(async (req, res) => {
    // 设置 CORS 头（允许来自任何来源的请求 - 仅本地使用）
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // 处理预检请求
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // ===== 健康检查 =====
    if (req.method === 'GET' && pathname === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', server: 'baidu-ocr-proxy', port: PORT }));
        return;
    }

    // ===== 获取 access_token =====
    if (req.method === 'GET' && pathname === '/token') {
        const apiKey = parsedUrl.query.api_key || API_KEY;
        const secretKey = parsedUrl.query.secret_key || SECRET_KEY;

        if (!apiKey || !secretKey) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: '缺少 api_key 或 secret_key 参数' }));
            return;
        }

        try {
            const result = await getAccessToken(apiKey, secretKey);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
        } catch (err) {
            console.error('获取 token 失败:', err.message);
            res.writeHead(502, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
        }
        return;
    }

    // ===== 表格文字识别 =====
    if (req.method === 'POST' && pathname === '/ocr/table') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const params = new URLSearchParams(body);
                const token = params.get('access_token');
                const image = params.get('image');

                if (!token) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: '缺少 access_token' }));
                    return;
                }
                if (!image) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: '缺少 image (base64)' }));
                    return;
                }

                console.log(`[OCR] 调用百度表格识别 API (图片大小: ${Math.round(image.length / 1024)}KB)`);
                const result = await callBaiduTableOCR(token, image);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));

            } catch (err) {
                console.error('[OCR] 错误:', err.message);
                res.writeHead(502, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
            }
        });
        return;
    }

    // ===== 综合接口：自动获取 token + 识别 =====
    if (req.method === 'POST' && pathname === '/ocr/table/auto') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const params = new URLSearchParams(body);
                const apiKey = params.get('api_key') || API_KEY;
                const secretKey = params.get('secret_key') || SECRET_KEY;
                const image = params.get('image');

                if (!apiKey || !secretKey) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: '缺少 api_key 或 secret_key' }));
                    return;
                }
                if (!image) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: '缺少 image (base64)' }));
                    return;
                }

                // 获取 token
                const tokenResult = await getAccessToken(apiKey, secretKey);
                const token = tokenResult.access_token;
                console.log(`[OCR] 获取 token 成功，调用表格识别 (图片: ${Math.round(image.length / 1024)}KB)`);

                // 调用识别
                const result = await callBaiduTableOCR(token, image);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    ...result,
                    _token_info: { expires_in: tokenResult.expires_in }
                }));

            } catch (err) {
                console.error('[OCR] 错误:', err.message);
                res.writeHead(502, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
            }
        });
        return;
    }

    // ===== 未知路由 =====
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: '未知路由', available: ['/health', '/token', '/ocr/table', '/ocr/table/auto'] }));
});

// ===== 启动服务器 =====
server.listen(PORT, '127.0.0.1', () => {
    console.log('==========================================');
    console.log('  百度智能云 OCR 本地代理服务器');
    console.log(`  地址: http://127.0.0.1:${PORT}`);
    console.log(`  健康检查: http://127.0.0.1:${PORT}/health`);
    console.log('==========================================');
    console.log('');
    console.log('前端使用方式:');
    console.log(`  index.html 中的 JavaScript 会请求 http://127.0.0.1:${PORT}/ocr/table/auto`);
    console.log('');
    console.log('独立调用示例:');
    console.log(`  # 获取 token:`);
    console.log(`  curl http://127.0.0.1:${PORT}/token?api_key=xxx&secret_key=xxx`);
    console.log('');
    console.log(`  # 表格识别（需先获取 token）:`);
    console.log(`  curl -X POST http://127.0.0.1:${PORT}/ocr/table \\`);
    console.log(`    -d "access_token=xxx" \\`);
    console.log(`    -d "image=base64编码的图片数据"`);
    console.log('');
});