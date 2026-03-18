/**
 * ✨ 追星物料 AI 生成器 - 按钮修复最终版
 */

// 1. 数据配置
const baseTemplates = [
    { id: 1, name: '甜酷风吧唧1', category: 'badge', style: 'sweet', url: 'image/sweet_baji.jpg' },
   
    { id: 2, name: '横板黑粉爱心小卡1', category: 'photocard', style: 'ins', url: 'image/hengbanxiaoka 1.2.png' },
    { id: 3, name: '横板黑粉爱心小卡2', category: 'photocard', style: 'ins', url: 'image/横板 1.1.png' },
    { id: 4, name: '横板黑粉爱心小卡3', category: 'photocard', style: 'ins', url: 'image/横板 2.1 框.png' },
    { id: 5, name: '横板黑粉爱心小卡4', category: 'photocard', style: 'ins', url: 'image/横板 2.1.png' },
    { id: 6, name: '横板黑粉爱心小卡5', category: 'photocard', style: 'ins', url: 'image/横板 2.2.png' },
    { id: 7, name: '横板黑粉爱心小卡6', category: 'photocard', style: 'ins', url: 'image/横板 3.1.png' },
    { id: 8, name: '横板黑粉爱心小卡7', category: 'photocard', style: 'ins', url: 'image/横板 3.2.png' },
    { id: 9, name: 'ins风吧唧1', category: 'badge', style: 'ins', url: 'image/吧唧1cai.png' },
    { id: 10, name: 'ins风吧唧2', category: 'badge', style: 'ins', url: 'image/吧唧2cai.png' },
    { id: 11, name: '甜酷风吧唧2', category: 'badge', style: 'sweet', url: 'image/蛋糕吧唧1.png' },
    { id: 12, name: '甜酷风吧唧3', category: 'badge', style: 'sweet', url: 'image/蛋糕吧唧2.png' }

];

const stickerTemplates = [
    { id: 1, name: 'ins贴纸', url: 'image/sticker_ins.jpg' },
    { id: 2, name: '甜美风贴纸1', url: 'image/yinfu.png' },
    { id: 3, name: '贴纸2', url: 'image/1Stan海外素材.png' },
    { id: 4, name: '贴纸3', url: 'image/2Stan海外素材.png' },
    { id: 5, name: '贴纸4', url: 'image/3Stan海外素材.png' },
    { id: 6, name: '贴纸5', url: 'image/4Stan海外素材.png' },
    { id: 7, name: '贴纸6', url: 'image/5Stan海外素材.png' },
    { id: 8, name: '贴纸7', url: 'image/6Stan海外素材.png' },
    { id: 9, name: '贴纸8', url: 'image/7Stan海外素材.png' },
    { id: 10, name: '贴纸9', url: 'image/8Stan海外素材.png' }
];

const REMOVE_BG_API_KEY = 'fnxGBUBXD2ekaF6KjQecrdYV'; 

let canvas;
let pendingFile = null; 
let currentCategory = 'all';
let currentStyle = 'all';

/**
 * 2. 初始化入口
 */
function init() {
    console.log("初始化开始...");
    canvas = new fabric.Canvas('preview-canvas', {
        width: 800,
        height: 800,
        backgroundColor: '#ffffff',
        preserveObjectStacking: true 
    });

    renderUI();           
    setupFilterEvents();  
    setupUpload();        
    setupLayerControls(); 

    document.getElementById('generate-btn').onclick = handleGenerate;
    document.getElementById('download-btn').onclick = download;
    document.getElementById('reset-btn').onclick = () => location.reload();
}

/**
 * 3. 【修复重点】按钮点击事件
 */
function setupFilterEvents() {
    // 类型按钮监听
    const typeBtns = document.querySelectorAll('.filter-btn');
    typeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            console.log("点击了类型:", this.getAttribute('data-category'));
            currentCategory = this.getAttribute('data-category');
            
            // 样式切换
            typeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            renderUI(); // 重新渲染列表
        });
    });

    // 风格按钮监听
    const styleBtns = document.querySelectorAll('.style-btn');
    styleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            console.log("点击了风格:", this.getAttribute('data-style'));
            currentStyle = this.getAttribute('data-style');
            
            // 样式切换
            styleBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            renderUI(); // 重新渲染列表
        });
    });
}

/**
 * 4. 渲染 UI
 */
function renderUI() {
    const filteredTemplates = baseTemplates.filter(item => {
        const catMatch = (currentCategory === 'all' || item.category === currentCategory);
        const styleMatch = (currentStyle === 'all' || item.style === currentStyle);
        return catMatch && styleMatch;
    });

    const tGrid = document.getElementById('template-grid');
    if (tGrid) {
        tGrid.innerHTML = '';
        filteredTemplates.forEach(t => {
            const div = document.createElement('div');
            div.className = 'template-card';
            div.innerHTML = `<img src="${t.url}"><p>${t.name}</p>`;
            div.onclick = () => loadTemplate(t.url);
            tGrid.appendChild(div);
        });
    }

    const sGrid = document.getElementById('sticker-grid');
    if (sGrid) {
        sGrid.innerHTML = '';
        stickerTemplates.forEach(s => {
            const div = document.createElement('div');
            div.className = 'template-card';
            div.innerHTML = `<img src="${s.url}"><p>${s.name}</p>`;
            div.onclick = () => addStickerToCanvas(s.url);
            sGrid.appendChild(div);
        });
    }
}

// ... (以下是 loadTemplate, handleGenerate, addStickerToCanvas, setupLayerControls 等函数，保持不变)
// 为了篇幅，建议你直接延用之前的这些函数代码，
// 只要确保 setupFilterEvents 像上面那样写，按钮就一定能点动。

function loadTemplate(url) {
    fabric.Image.fromURL(url, (img) => {
        const imgRatio = img.width / img.height;
        let newWidth = 800;
        let newHeight = 800 / imgRatio;
        if (imgRatio < 0.8) { newWidth = 638; newHeight = 1016; }
        canvas.setDimensions({ width: newWidth, height: newHeight });
        canvas.getObjects().forEach(obj => { if (obj.isTemplate) canvas.remove(obj); });
        img.set({ left: 0, top: 0, scaleX: newWidth / img.width, scaleY: newHeight / img.height, selectable: true, isTemplate: true, borderColor: '#ff69b4', cornerColor: '#ff69b4', cornerSize: 12 });
        canvas.add(img);
        img.sendToBack(); 
        canvas.setActiveObject(img);
        canvas.renderAll();
        document.getElementById('template-name').innerText = url.split('/').pop();
    }, { crossOrigin: 'anonymous' });
}

async function handleGenerate() {
    if (!pendingFile) return;
    const loading = document.getElementById('loading-status');
    const genBtn = document.getElementById('generate-btn');
    loading.style.display = 'block';
    genBtn.disabled = true;
    try {
        const formData = new FormData();
        formData.append('image_file', pendingFile);
        const res = await fetch('https://api.remove.bg/v1.0/removebg', { method: 'POST', headers: { 'X-Api-Key': REMOVE_BG_API_KEY }, body: formData });
        if(!res.ok) throw new Error("抠图失败");
        const blob = await res.blob();
        const faceURL = URL.createObjectURL(blob);
        fabric.Image.fromURL(faceURL, (img) => {
            img.scaleToWidth(400);
            img.set({ left: canvas.width / 2, top: canvas.height / 2, originX: 'center', originY: 'center', borderColor: '#ff69b4', cornerColor: '#ff69b4', cornerSize: 12 });
            canvas.add(img);
            img.bringToFront();
            canvas.setActiveObject(img);
            canvas.renderAll();
        }, { crossOrigin: 'anonymous' });
    } catch (err) { alert(err.message); } finally { loading.style.display = 'none'; genBtn.disabled = false; }
}

function addStickerToCanvas(url) {
    fabric.Image.fromURL(url, (img) => {
        img.scaleToWidth(150);
        img.set({ left: 100, top: 100, borderColor: '#00bfff', cornerColor: '#00bfff', cornerSize: 12 });
        canvas.add(img);
        img.bringToFront();
        canvas.setActiveObject(img);
        canvas.renderAll();
    }, { crossOrigin: 'anonymous' });
}

function setupLayerControls() {
    document.getElementById('btn-bring-front').onclick = () => { const o = canvas.getActiveObject(); if(o){o.bringToFront(); canvas.renderAll();} };
    document.getElementById('btn-forward').onclick = () => { const o = canvas.getActiveObject(); if(o){o.bringForward(); canvas.renderAll();} };
    document.getElementById('btn-backward').onclick = () => { const o = canvas.getActiveObject(); if(o){o.sendBackwards(); canvas.renderAll();} };
    document.getElementById('btn-send-back').onclick = () => { const o = canvas.getActiveObject(); if(o){o.sendToBack(); canvas.renderAll();} };
    document.getElementById('delete-btn').onclick = () => { const o = canvas.getActiveObject(); if(o){canvas.remove(o); canvas.discardActiveObject(); canvas.renderAll();} };
}

function setupUpload() {
    const area = document.getElementById('upload-area');
    const input = document.getElementById('photo-upload');
    area.onclick = () => input.click();
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            pendingFile = file;
            area.querySelector('p').innerText = `✅ 已选：${file.name}`;
            document.getElementById('generate-btn').disabled = false;
        }
    };
}

function download() {
    const dataURL = canvas.toDataURL({ format: 'png', quality: 1 });
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'star.png';
    link.click();
}

document.addEventListener('DOMContentLoaded', init);