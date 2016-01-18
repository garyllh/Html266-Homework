var canvas, context, canvaso, contexto;
var isDrawing = false;

var offsetX,offsetY;
var statX,startY;

var useType;  
var customColor;

var previousToolElement = null;
var previousThicknessElement = null;
var previousFillStatus = 0;
var previousColorElement = null;

var isFill = false;
var selectColorOrFill = "color";


window.onload = function() {
    canvaso = document.getElementById("drawingCanvas");
    contexto = canvaso.getContext('2d');

    var container = canvaso.parentNode;

    //虛擬canvas
    canvas = document.createElement('canvas');
    canvas.id = 'imageTemp';
    canvas.width = canvaso.width;
    canvas.height = canvaso.height;
    container.appendChild(canvas);

    context = canvas.getContext('2d');

    //畫布在滑鼠左鍵壓下的時候 = 開始繪圖
    canvas.onmousedown = startDrawing;
    canvas.onmouseup = stopDrawing;
    canvas.onmouseout = stopDrawing;
    canvas.onmousemove = draw;

    offsetX = canvas.offsetLeft;
    offsetY = canvas.offsetTop;

    //自訂顏色
    customColor = document.getElementById("pcolor");
    customColor.addEventListener("change", function(e) {
        if (selectColorOrFill == "color") {
            context.strokeStyle = customColor.value;
             document.getElementById("curcolor").style.background = customColor.value;
        } else {
            context.fillStyle = customColor.value;
            document.getElementById("curfill").style.background = customColor.value;
        }
    }, false);

};

// update to real canvas
function img_update() {
    contexto.drawImage(canvas, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
}


function startDrawing(e) { //down
    isDrawing = true;
    canvas.style.cursor = "crosshair";
    startX = e.pageX - offsetX;
    startY = e.pageY - offsetY;
}

function stopDrawing(e) { //up
    isDrawing = false;
    canvas.style.cursor = "default";
    img_update();
}


function draw(e) { //move
    if (isDrawing) {
        var mouseX = e.pageX  - offsetX;
        var mouseY = e.pageY - offsetY;
        context.strokeStyle = document.getElementById("curcolor").style.background;
        context.fillStyle = document.getElementById("curfill").style.background;
        if (useType == "pen") {
            context.beginPath();
            context.moveTo(startX, startY);
            context.lineTo(mouseX, mouseY);
            context.stroke();
            startX = mouseX;
            startY = mouseY;
        } else if (useType == "line") {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.beginPath();
            context.moveTo(startX, startY);
            context.lineTo(mouseX, mouseY);
            context.stroke();
        } else if (useType == "square") {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.beginPath();
            context.rect(startX, startY, mouseX - startX, mouseY - startY);
            if (isFill) {
                context.fill();
             } 
             context.stroke();
        } else if (useType == "circle") {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.beginPath();
            context.moveTo(startX, startY + (mouseY - startY) / 2);
            context.bezierCurveTo(startX, startY, mouseX, startY, mouseX, startY + (mouseY - startY) / 2);
            context.bezierCurveTo(mouseX, mouseY, startX, mouseY, startX, startY + (mouseY - startY) / 2);
            context.closePath();
            if (isFill) {
                context.fill();
             } 
             context.stroke();
        } else if(useType == "text") {
            var text = document.getElementById("text").value;
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.font = document.getElementById("textsize").value+"px 'Arial'"; 
            if (isFill) {
                context.fillText(text,mouseX,mouseY);
             } else {
             context.strokeText(text,mouseX,mouseY);
            }
            
        }

    }
}

//parent object
function changePty(selectElement,previousElement) {
    if (selectElement !== null) {
        selectElement.className += " Selected";
    }
    if (previousElement !== null && previousElement != selectElement) {
        previousElement.classList.remove("Selected");
    }
}

//變更粗細
function changeThickness(thickness, selectElement) {
    changePty.call(this, selectElement,previousThicknessElement);
    context.lineWidth = thickness;
    previousThicknessElement = selectElement;
}

//點選顏色
function clickColorBox(selectElement) {
    changePty.call(this, selectElement,previousColorElement);
    previousColorElement = selectElement;
    if (selectColorOrFill == "color") {
        //document.getElementById("curcolor").style.background=selectElement.dataset.tag;
        document.getElementById("curcolor").style.background=selectElement.style.background;
    } else {
        //document.getElementById("curfill").style.background=selectElement.dataset.tag;
        document.getElementById("curfill").style.background=selectElement.style.background;
    }
}

//變更工具
function changeType(tool, selectElement) {
    changePty.call(this, selectElement,previousToolElement);
    useType = tool;
    previousToolElement = selectElement;
}

//框線顏色及充填顏色
function clickFill(selectElement,nowselect) {
    if (nowselect=="color") {
        selectColorOrFill = "color";
    } else {
        if (isFill) {
            changePty.call(this, null,selectElement);
            isFill = false;
            selectColorOrFill = "color";
            document.getElementById("filltitle").style.color = "black";
        } else {
            changePty.call(this, selectElement,null);
            context.fillStyle= document.getElementById("curfill").style.background;
            isFill = true;
            selectColorOrFill = "fill";
            document.getElementById("filltitle").style.color = "red";
        }
    }
}


//清除動作
function clearCanvas() {
    contexto.clearRect(0, 0, canvas.width, canvas.height);
}

//存檔動作
function saveCanvas() {
    var imageCopy = document.getElementById('savedImageCopy');
    imageCopy.src = canvaso.toDataURL();
    var imgContainer = document.getElementById("savedCopyContainer");
    imgContainer.style.display = "block";
}
