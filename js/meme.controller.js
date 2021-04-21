'use strict'


function onInit() {
    gCanvas = document.querySelector('.main-canvas');
    gCtx = gCanvas.getContext('2d');
    renderImgs()
    addListeners()
}

function renderImgs() {
    var imgs = getImgs()

    var strHtml = imgs.map(img => {
        return `
        <img src=${img.url} onclick="onImgClick(${img.id})">
        `
    }).join('');
    var gallery = document.querySelector('.gallery')
    gallery.innerHTML = strHtml;
}

function onSaveCanvas(){
    convertCanvasToImg();
    renderMemes()
}

function renderMemes() {
    var memes = getMemes()
    var strHtml = memes.map(meme => {
        return `
        <img src=${meme.url} onclick="onMemeClicked(${meme.id})">
        `
    }).join('');
    var elMemeContainer = document.querySelector('.memes-container')
    elMemeContainer.innerHTML = strHtml;
}

function onMemeClicked(memeId) {
    var elGallery = document.querySelector('.main-gallery');
    elGallery.style.display = 'none';
    var elEditor = document.querySelector('.editor-page');
    elEditor.style.display = 'flex';
    var elMemes = document.querySelector('.memes-container');
    elMemes.style.display = 'none';
    memeClick(memeId);
    renderMemes();
}

function onImgClick(imgId) {
    imgClick(imgId);
    var elGallery = document.querySelector('.main-gallery');
    elGallery.style.display = 'none';
    var elEditor = document.querySelector('.editor-page');
    elEditor.style.display = 'flex';
    var elMemes = document.querySelector('.memes-container');
    elMemes.style.display = 'none';
}

function onLineInput(val) {
    lineInput(val);
    var line = getLine();
    if (!line) return;
    document.querySelector('.aditor-input').value = line.txt;
}

function onAddLine() {
    addLine();
}

function onMoveBetweenLins() {
    MoveBetweenLins();
    var line = getLine();
    if (!line) return
    document.querySelector('.aditor-input').value = line.txt;
}

function onRemoveLine() {
    removeLine();
}

function onBiggerFont() {
    biggerFont()
}

function onSmallerFont() {
    smallerFont();
}

function onDirectionLtr() {
    directionLtr();
}

function onDirectionCenter() {
    directionCenter()
}

function onDirectionRtl() {
    directionRtl()
}

function onSetFont() {
    var font = document.querySelector('.font-family').value;
    setFont(font);
}

function onFill(color) {
    fillText(color);
}

function onStrokeWords(){
    strokeWords()
}

function downloadCanvas(elLink) {
    var meme = getMeme()
    const data = gCanvas.toDataURL()
    elLink.href = data
    elLink.download = 'my-meme' + meme.selectedImgId + '.jpg'
}

function onImgInput(ev) {
    document.querySelector('.share-container').innerHTML = ''
    loadImageFromInput(ev, renderImgs)
}

function onSortBy(el){
    var sortTxt = el.innerText.toLowerCase();
    var fontSize = sortImg(sortTxt)
    el.style.fontSize = fontSize+'px'
    console.log(fontSize);
    renderImgs();
}

function onMemesClicked(){
    var elGallery = document.querySelector('.main-gallery');
    elGallery.style.display = 'none';
    var elEditor = document.querySelector('.editor-page');
    elEditor.style.display = 'none';
    var elMemes = document.querySelector('.memes-container');
    elMemes.style.display = 'grid';
    renderMemes();
}

function onGalleryClicked(){
    var elGallery = document.querySelector('.main-gallery');
    elGallery.style.display = 'block';
    var elEditor = document.querySelector('.editor-page');
    elEditor.style.display = 'none';
    var elMemes = document.querySelector('.memes-container');
    elMemes.style.display = 'none';
    renderImgs();
}
