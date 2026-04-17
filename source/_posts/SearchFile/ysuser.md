---
title: 个人使用软件
cover: "https://api.kdcc.cn/img/?rand=85155"
tag: 软件
permalink: SearchFile/ysuser.html
---

<style>
.tab-nav {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 20px;
}

.tab-btn {
    display: inline-block;
    padding: 12px 24px;
    font-size: 14px;
    font-weight: 600;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    color: white;
    border: none;
    outline: none;
}

.tab-btn:nth-child(1) { background: linear-gradient(135deg, #667eea, #764ba2); }
.tab-btn:nth-child(2) { background: linear-gradient(135deg, #11998e, #38ef7d); }
.tab-btn:nth-child(3) { background: linear-gradient(135deg, #f093fb, #f5576c); }
.tab-btn:nth-child(4) { background: linear-gradient(135deg, #4facfe, #00f2fe); }
.tab-btn:nth-child(5) { background: linear-gradient(135deg, #ff9a9e, #fecfef); }
.tab-btn:nth-child(6) { background: linear-gradient(135deg, #a18cd1, #fbc2eb); }


.tab-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.2);
}

.tab-btn.active {
    transform: scale(1.05);
    box-shadow: 0 5px 20px rgba(0,0,0,0.3);
}

.iframe-wrapper {
    width: 100%;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 10px 40px rgba(0,0,0,0.15);
    background: white;
}

.iframe-wrapper iframe {
    width: 100%;
    min-height: 700px;
    border: none;
}
</style>

<div class="tab-nav">
    <button class="tab-btn active" onclick="switchTab(this, '/tools/ysuser/browser.html')">🌐 浏览器工具</button>
    <button class="tab-btn" onclick="switchTab(this, '/tools/ysuser/gameart.html')">🎨 游戏美术</button>
    <button class="tab-btn" onclick="switchTab(this, '/tools/ysuser/sound.html')">🎵 音效库</button>
    <button class="tab-btn" onclick="switchTab(this, '/tools/ysuser/fonts.html')">🔠 字体资源</button>
    <button class="tab-btn" onclick="switchTab(this, '/tools/ysuser/tools.html')">⚡ 效率神器</button>
    <button class="tab-btn" onclick="switchTab(this, '/tools/ysuser/site.html')">🌐 网站资源</button>
</div>

<div class="iframe-wrapper">
    <iframe id="content-frame" src="/tools/ysuser/browser.html" scrolling="auto"></iframe>
</div>

<script>
function switchTab(btn, url) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('content-frame').src = url;
}
</script>
