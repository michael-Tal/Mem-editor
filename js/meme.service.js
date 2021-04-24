
'use strict'

const IMGS_KEY = 'images'
const MEMES_KEY = 'memes'

const gTouchEvs = ['touchstart', 'touchmove', 'touchend']
var gId = 1;
var gImgs;
var gMeme;
var gCurrImg;
var gSortedImgs;
var gMemes;
var gStartPos;
var gKeyWords = { 'funny': 25, 'animal': 19, 'men': 10, 'women': 17, 'comic': 6, 'smile': 3, 'random': 20 ,'kuki':6,'poki':12,'toki':19,'rooki':10,'sdv':13,'dfgh':20,'dsfgfhg':17,'sdafdgfh':18,'sdsfdg':10}

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

function getKeywords(){
    return gKeyWords;
}

function getKeywordsLength(){
    var count = 0
    for (var key in gKeyWords){
        count++;
    }
    return count;
}

function getImgs() {
    if (gSortedImgs) return gSortedImgs;
    return gImgs;
}

function getMemes(){
    gMemes = loadFromStorage(MEMES_KEY)
    if (!gMemes) return;
    return gMemes;
}

function memeClick(memeId) {
    var meme = getMemeById(memeId);
    drawImageOnCanvas(meme);
}

function imgClick(imgId) {
    var img = getImgById(imgId);
    drawImageOnCanvas(img);
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

function lineInput(val) {
    if (!gMeme) return;
    var line = getLine();
    if (!gMeme.lines.length) {
        line = addLine();
    }
    line.txt = val;
    line.width = gCtx.measureText(val).width;
    renderCanvas();
}

function addLine() {
    if (!gMeme) return;
    var line = createLine();
    gMeme.lines.push(line);
    MoveBetweenLins();
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
        stroke: 'black',
        width: 0,
        fontSize: 30,
        isDragging: false,
        pos: getPos(),
        font: 'Ariel',
        isDragging: false,
    }
    return line;
}



function onDown(ev) {
    const pos = getEvPos(ev);
    if(!selectTheCorectLine(pos)) return;
    var line= getLine();
    if(!line) return;
    line.isDragging = true;
    gStartPos = pos;
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

function selectTheCorectLine(clickedPos) {
    const minLimit = 50
    var minDistance = Infinity;
    var idx;
    var distance;
    for (var i =0 ; i<gMeme.lines.length; i++){
        var line = gMeme.lines[i];
        const pos = line.pos;
        distance = Math.sqrt((pos.x - clickedPos.x) ** 2 + (pos.y - clickedPos.y) ** 2)
        if (distance < minDistance){
            minDistance = distance; 
            idx = i
        }
    }
    if (minDistance < minLimit) {
        gMeme.selectedLineIdx = idx;
        return true
    }
    return false;

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
        x: 150,
        y: 150
    }
    if (!gMeme.lines.length) {
        pos.x = 150;
        pos.y = 50;
    } else if (gMeme.lines.length === 1) {
        pos.x = 150;
        pos.y = 250;
    }
    return pos
}



function renderLines() {
    return gMeme.lines.forEach(line => {
        gCtx.beginPath();
        gCtx.textAlign = line.align;
        gCtx.fillStyle = line.color;
        gCtx.strokeStyle = line.stroke;
        gCtx.font = (line.fontSize + 'px ' + line.font);
        gCtx.strokeText(line.txt, line.pos.x, line.pos.y);
        gCtx.fillText(line.txt, line.pos.x, line.pos.y);
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
    renderCanvas()
}

function smallerFont() {
    if (!gMeme) return;
    var line = getLine();
    if (line.fontSize <= 15) return
    line.fontSize -= 5;
    renderCanvas();
}

function directionLtr() {
    if (!gMeme) return;
    var line = getLine();
    line.align = 'right'
    renderCanvas();
}

function directionCenter() {
    if (!gMeme) return;
    var line = getLine();
    line.align = 'center'
    renderCanvas();
}

function directionRtl() {
    if (!gMeme) return;
    var line = getLine();
    line.align = 'left'
    renderCanvas();
}

function setFont(font) {
    if (!gMeme) return;
    var line = getLine();
    line.font = font;
    renderCanvas();

}

function fillText(color) {
    if (!gMeme) return;
    var line = getLine();
    line.stroke='';
    line.color = color;
    renderCanvas();
}

function strokeWords(color){
    if (!gMeme) return;
    var line = getLine();
    line.fill='';
    line.stroke = color;
    renderCanvas();
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