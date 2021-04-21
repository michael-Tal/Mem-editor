
'use strict'

const IMGS_KEY = 'images'
const MEMES_KEY = 'memes'

const gTouchEvs = ['touchstart', 'touchmove', 'touchend']
var gCanvas;
var gCtx;
var gId = 1;
var gImgs;
var gMeme;
var gCurrImg;
var gSortedImgs;
var gMemes;
// var gLineSize;
var gStartPos;
var gKeyWords = { 'funny': 25, 'animal': 19, 'men': 10, 'women': 17, 'comic': 6, 'smile': 3, 'random': 20 }

createImgs()

function createImgs() {
    gImgs = loadFromStorage(IMGS_KEY)
    if (gImgs) return
    gImgs = [];
    createImg('img/1.jpg', 'funny')
    createImg('img/2.jpg', 'animal')
    createImg('img/3.jpg', 'animal')
    createImg('img/4.jpg', 'animal')
    createImg('img/5.jpg', 'funny')
    createImg('img/6.jpg', 'comic')
    createImg('img/7.jpg', 'smile')
    createImg('img/8.jpg', 'funny')
    createImg('img/9.jpg', 'funny')
    createImg('img/10.jpg', 'funny')
    createImg('img/11.jpg', 'funny')
    createImg('img/12.jpg', 'funny')
    createImg('img/13.jpg', 'funny')
    createImg('img/14.jpg', 'funny')
    createImg('img/15.jpg', 'funny')
    createImg('img/16.jpg', 'funny')
    createImg('img/17.jpg', 'funny')
    createImg('img/18.jpg', 'funny')
    saveToStorage(IMGS_KEY, gImgs);
}

function createImg(url = 'img/1.jpg', keywords = 'random') {
    var img = {
        id: gId++,
        url,
        keywords
    }
    gImgs.push(img);

}

function getImgs() {
    if (gSortedImgs) return gSortedImgs;
    return gImgs;
}

function getMemes(){
    gMemes = loadFromStorage(MEMES_KEY)
    if (!gMemes) return
    return gMemes;
}

function memeClick(memeId) {
    var meme = getMemeById(memeId);
    var image = new Image();
    image.src = meme.url;
    image.onload = () => {
        gCtx.drawImage(image, 0, 0, gCanvas.width, gCanvas.height);
    }
    gCurrImg = image;
    createMeme(meme);
}

function imgClick(imgId) {
    var img = getImgById(imgId);
    var image = new Image();
    image.src = img.url;
    image.onload = () => {
        gCtx.drawImage(image, 0, 0, gCanvas.width, gCanvas.height);
    }
    gCurrImg = image;
    createMeme(img);

}

function createMeme(img) {
    var meme = {
        selectedImgId: img.id,
        selectedLineIdx: 0,
        lines: [],
    }
    gMeme = meme;
    renderCanvas();
}

// function lineSize() {
//     var line = getLine();
//     var size = {
//         height: line.height,
//         width: line.width
//     }
//     gLineSize = size;
// }

function lineInput(val) {
    if (!gMeme) return;
    var line = getLine();
    if (!gMeme.lines.length) {
        line = addLine();
    }
    line.txt = val;
    line.width = gCtx.measureText(val).width
    gCtx.beginPath();
    gCtx.textAlign = line.align;
    gCtx.fillStyle = line.color;
    gCtx.font = (line.fontSize + 'px ' + line.font);
    gCtx.fillText(line.txt, line.pos.x, line.pos.y);
    gCtx.closePath();
    renderCanvas()
}

function addLine() {
    if (!gMeme) return;
    var line = createLine();
    gMeme.lines.push(line);
    return line;
}

function removeLine() {
    if (!gMeme) return;
    gMeme.lines.splice(gMeme.selectedLineIdx, 1);
    renderCanvas();
}

function createLine() {
    var line = {
        txt: '',
        height: 30,
        align: 'center',
        color: 'red',
        width: 0,
        stroke: false,
        fontSize: 30,
        isDragging: false,
        pos: getPos(),
        font: 'Ariel',
        isDragging: false,
    }
    return line
}

function addListeners() {
    addMouseListeners()
    addTouchListeners()
    window.addEventListener('resize', () => {
        resizeCanvas()
        renderCanvas()
    })
}

function addMouseListeners() {
    gCanvas.addEventListener('mousemove', onMove)
    gCanvas.addEventListener('mousedown', onDown)
    gCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    gCanvas.addEventListener('touchmove', onMove)
    gCanvas.addEventListener('touchstart', onDown)
    gCanvas.addEventListener('touchend', onUp)
}

function onDown(ev) {
    var line= getLine();
    if(!line) return
    const pos = getEvPos(ev)
    if (!isLineClicked(pos)) return
    line.isDragging = true
    gStartPos = pos
    document.body.style.cursor = 'grabbing'
}

function onMove(ev) {
    var line= getLine();
    if(!line) return
    if (line.isDragging) {
        const pos = getEvPos(ev)
        const dx = pos.x - gStartPos.x
        const dy = pos.y - gStartPos.y
        
        line.pos.x += dx
        line.pos.y += dy
        
        gStartPos = pos
        renderCanvas()
    }
}

function onUp() {
    var line= getLine();
    if(!line) return
    line.isDragging = false
    document.body.style.cursor = 'grab'
}

function isLineClicked(clickedPos) {
    var line = getLine();
    const pos = line.pos;
    const distance = Math.sqrt((pos.x - clickedPos.x) ** 2 + (pos.y - clickedPos.y) ** 2)
    return distance <= line.width;
}

function getEvPos(ev) {
    var pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    if (gTouchEvs.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop
        }
    }
    return pos
}

function resizeCanvas() {
    const elContainer = document.querySelector('.main-canvas')
    console.dir(elContainer);
    gCanvas.width = elContainer.width
    gCanvas.height = elContainer.height
}

function getImgById(imgId) {
    return gImgs.find(img => {
        return img.id === imgId;
    })
}

function getMemeById(memeId) {
    return gMemes.find(meme => {
        return meme.id === memeId;
    })
}

function getPos() {

    var pos = {
        x: 200,
        y: 200
    }
    if (!gMeme.lines.length) {
        pos.x = 200;
        pos.y = 50;
    } else if (gMeme.lines.length === 1) {
        pos.x = 200;
        pos.y = 350;
    }
    return pos
}

function renderCanvas() {
    gCtx.save()
    gCtx.drawImage(gCurrImg, 0, 0, gCanvas.width, gCanvas.height);
    gCtx.restore()
    if (gMeme.lines.length) renderLines()
}

function renderLines() {
    return gMeme.lines.forEach(line => {
        gCtx.beginPath();
        gCtx.textAlign = line.align;
        gCtx.fillStyle = line.color;
        gCtx.strokeStyle = line.color
        gCtx.font = (line.fontSize + 'px ' + line.font);
        if (line.stroke) gCtx.strokeText(line.txt, line.pos.x, line.pos.y);
        else gCtx.fillText(line.txt, line.pos.x, line.pos.y);
        gCtx.closePath();
    });
}

function MoveBetweenLins() {
    if (!gMeme) return;
    if (gMeme.selectedLineIdx === gMeme.lines.length - 1) gMeme.selectedLineIdx = 0;
    else gMeme.selectedLineIdx++
}

function biggerFont() {
    if (!gMeme) return;
    var line = getLine();
    if (line.fontSize > 220) return
    line.fontSize += 5;
    lineInput(line.txt);
    console.log(gMeme.lines[gMeme.selectedLineIdx]);
    // renderCanvas();
}

function smallerFont() {
    if (!gMeme) return;
    var line = getLine();
    if (line.fontSize <= 15) return
    line.fontSize -= 5;
    lineInput(line.txt);
    // renderCanvas();
}

function directionLtr() {
    if (!gMeme) return;
    var line = getLine();
    line.align = 'right'
    lineInput(line.txt);
    // renderCanvas();
}

function directionCenter() {
    if (!gMeme) return;
    var line = getLine();
    line.align = 'center'
    lineInput(line.txt);
    // renderCanvas();
}

function directionRtl() {
    if (!gMeme) return;
    var line = getLine();
    line.align = 'left'
    lineInput(line.txt);
    // renderCanvas();
}

function setFont(font) {
    if (!gMeme) return;
    var line = getLine();
    line.font = font;
    lineInput(line.txt);
    // renderCanvas();

}

function fillText(color) {
    if (!gMeme) return;
    var line = getLine();
    line.color = color;
    lineInput(line.txt);
    // renderCanvas();
}

function strokeWords(){
    if (!gMeme) return;
    var line = getLine();
    line.stroke = true;
    lineInput(line.txt);
}

function getLine() {
    if (!gMeme) return
    return gMeme.lines[gMeme.selectedLineIdx]
}

function getMeme() {
    if (gMeme) return gMeme
}

function loadImageFromInput(ev, onImageReady) {
    var reader = new FileReader()
    reader.onload = function (event) {
        var img = new Image()
        img.onload = onImageReady.bind(null, img)
        img.src = event.target.result
        createImg(img.src);
    }
    reader.readAsDataURL(ev.target.files[0])
    saveToStorage(IMGS_KEY, gImgs);
}

function sortImg(sortBy) {
    gKeyWords[sortBy]++;
    var sortedImgs = gImgs.filter(img => {
        return img.keywords === sortBy;
    })
    gSortedImgs = sortedImgs;
    return gKeyWords[sortBy]
}

function convertCanvasToImg(){
    const dataUrl = gCanvas.toDataURL();
    var meme = {
        id: gMeme.selectedImgId,
        url: dataUrl,
    }
    if(!gMemes) gMemes=[];
    gMemes.push(meme);
    saveToStorage(MEMES_KEY, gMemes);
}