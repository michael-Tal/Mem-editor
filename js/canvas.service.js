init();

var gCanvas;
var gCtx;

function init(){
    gCanvas = document.querySelector('.main-canvas');
    gCtx = gCanvas.getContext('2d');
    addListeners()
}

function onSaveCanvas(){
    convertCanvasToImg();
    renderMemes()
}

function downloadCanvas(elLink) {
    var meme = getMeme()
    const data = gCanvas.toDataURL()
    elLink.href = data
    elLink.download = 'my-meme' + meme.selectedImgId + '.jpg'
}

function drawImageOnCanvas(img){
    var image = new Image();
    image.src = img.url;
    image.onload = () => {
        gCtx.drawImage(image, 0, 0, gCanvas.width, gCanvas.height);
    }
    gCurrImg = image;
    createMeme(img);
}

function addListeners() {
    addMouseListeners();
    addTouchListeners();
    window.addEventListener('resize', () => {
        resizeCanvas();
        renderCanvas();
    })
}

function addMouseListeners() {
    gCanvas.addEventListener('mousemove', onMove);
    gCanvas.addEventListener('mousedown', onDown);
    gCanvas.addEventListener('mouseup', onUp);
}

function addTouchListeners() {
    gCanvas.addEventListener('touchmove', onMove);
    gCanvas.addEventListener('touchstart', onDown);
    gCanvas.addEventListener('touchend', onUp);
}

function resizeCanvas() {
    const elContainer = document.querySelector('.main-canvas')
    gCanvas.width = elContainer.width
    gCanvas.height = elContainer.height
}

function renderCanvas() {
    gCtx.save()
    gCtx.drawImage(gCurrImg, 0, 0, gCanvas.width, gCanvas.height);
    gCtx.restore()
    if (gMeme.lines.length) renderLines()
}

function renderLines() {
    return gMeme.lines.forEach(line => {
        console.log(line);
        gCtx.beginPath();
        gCtx.font = (line.fontSize + 'px ' + line.font);
        console.log(gCtx.font);
        gCtx.textAlign = line.align;
        gCtx.fillStyle = line.color;
        gCtx.strokeStyle = line.stroke;
        gCtx.strokeText(line.txt, line.pos.x, line.pos.y);
        gCtx.fillText(line.txt, line.pos.x, line.pos.y);
        gCtx.closePath();
    });
}
