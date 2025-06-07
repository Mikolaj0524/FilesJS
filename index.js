window.addEventListener("load", ()=>{
    document.querySelectorAll("a")[0].click();
});
/* ---------------------------------------- */
/*                                          */
/*                  FilesJS                 */
/*                                          */
/*              by Mikolaj0524              */
/*                                          */
/*              Copyright 2025              */
/*                                          */
/* ---------------------------------------- */


class Extentions{
    audio = [".mp3", ".wav", ".ogg", ".aac", ".opus", ".webm"];
    video = [".mp4", ".webm", ".ogv"];
    office = [".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".odt", ".ods", ".odp", ".rtf", ".docm", ".dotx", ".xlsm", ".xltx", ".pptm", ".potx", ".pdf", ".xps"];
    image = [".jpg", ".jpeg", ".jfif", ".pjpeg", ".pjp", ".png", ".gif", ".svg", ".apng", ".webp", ".avif", ".bmp", ".ico", ".cur"];
    text = [".txt", ".csv", ".log", ".xml", ".json", ".html", ".htm", ".css", ".js", ".ts", ".tsx", ".jsx", ".md", ".bat", ".cmd", ".ini", ".conf", ".yml", ".yaml", ".toml", ".reg", ".py", ".java", ".c", ".cpp", ".h", ".hpp", ".rb", ".php", ".sh", ".pl", ".asm", ".sql", ".ps1", ".cfg", ".dockerfile", ".gitignore", ".gitattributes", ".env", ".tex"];
}

let elements = document.querySelectorAll('a');
let libElements = [];
let opened = false;
elements.forEach(el => {
    if (el.hasAttribute("data-filesjs") && el.getAttribute("data-filesjs") != "" && el.getAttribute("data-filesjs") != null) {
        libElements.push(el);
    }
});
libElements.forEach(el => {
    el.addEventListener("click", () => {
        ElementClicked(el);
    });
});
window.addEventListener("wheel", function(event) {
    if (event.ctrlKey) {
        event.preventDefault();
    }
}, { passive: false });

function ElementClicked(el){
    let path = el.getAttribute("data-filesjs");
    let extention = "";
    if (path){
        const parts = path.split('.');
        if (parts.length !== 1){
            extention = "." + parts.pop().toLowerCase();
            DisplayFile(extention, path);
        }
        
    }
}

function GetFileName(path) {
    if (!path) 
        return "";

    const parts = path.split(/[/\\]/);
    return parts.pop();
}

function DisplayFile(ext, path) {
    if (opened) {
        document.getElementById("fileFrame").remove();
    }

    CreateFrame();

    let element = document.createElement("img");
    element.src = path;
    element.alt = path;
    element.style = `
        display: block;
        user-select: none;
        cursor: grab;
        position: absolute;
        z-index: 999;
    `;

    
    let startX, startY, currentX = 0, currentY = 0, isDragging = false, scale = 1;
    function updateTransform() {
        element.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale})`;
    }
    element.addEventListener("wheel", (event) => {
        if (event.ctrlKey) {
            element.style.transition = "transform 0.2s ease";
            event.preventDefault();
            if (event.deltaY > 0) {
                scale = Math.max(0.1, scale - 0.08);
            } else {
                scale = Math.min(5, scale + 0.08);
            }
            updateTransform();
        }
    });
    element.addEventListener("mousedown", (event) => {
        element.style.transition = "transform 0s";
        isDragging = true;
        startX = event.clientX - currentX;
        startY = event.clientY - currentY;
        element.style.cursor = "grabbing";
    });
    document.addEventListener("mousemove", (event) => {
        if (!isDragging) return;
        currentX = event.clientX - startX;
        currentY = event.clientY - startY;
        updateTransform();
    });
    document.addEventListener("mouseup", () => {
        isDragging = false;
        element.style.cursor = "grab";
    });
    element.addEventListener("dragstart", (e) => {
        e.preventDefault();
    });
    document.getElementById("content").appendChild(element);
}


function CreateFrame(){
    opened = true;
    let div = document.createElement("div");
    div.id = "fileFrame";
    div.style = `
        user-select: none;
        font-family: Arial, Helvetica, sans-serif;
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        width: 100vw;
        z-index: 1000;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        flex-direction: column;
        overflow: hidden;
    `;

    let nav = document.createElement("nav");
    nav.innerHTML = "<b class=\"x\">FilesJS</b>";
    nav.style = `
        width: 100vw;
        margin: 0 auto;
        background: rgba(0, 0, 0, 0.6);
        padding: 1%;
        user-select: none;
        z-index: 1010;
    `;

    let content = document.createElement("main");
    content.id = "content";
    content.style = `
        flex: 1;
        display: flex;
        overflow: hidden;
        width: 100vw;
        align-items: center;
        justify-content: center;
        user-select: none;
        background: rgba(255, 255, 255, 0.1);
        z-index: 1001;
    `;


    let footer = document.createElement("footer");
    footer.style = `
        height: 13vh;
        width: 100vw;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        display: flex;
        align-items: center;
        user-select: none;
        justify-content: center;
        z-index: 1010;
        overflow-y: auto;
        max-width: 100vw;
    `;
    
    libElements.forEach(el => {
        let item = document.createElement("a");
        item.style = `
            text-align: center;
            display: inline-block;
            margin: 0 1%;
            cursor: pointer;
            width: 70%;
            height: 70%;
        `;
        item.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" height="20%" fill="currentColor" class="bi bi-file-earmark-fill" viewBox="0 0 16 16"><path d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2m5.5 1.5v2a1 1 0 0 0 1 1h2z"/></svg>
                <br />
                ${GetFileName(el.getAttribute("data-filesjs"))}
            `
        item.setAttribute("data-filesjs", el)
        item.addEventListener("click", () => {
            ElementClicked(el);
        });

        footer.appendChild(item);
    });

    div.appendChild(nav);
    div.appendChild(content);
    div.appendChild(footer);
    document.body.appendChild(div);
}









