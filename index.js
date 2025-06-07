/* ---------------------------------------- */
/*                                          */
/*                  FilesJS                 */
/*                                          */
/*              by Mikolaj0524              */
/*                                          */
/*              Copyright 2025              */
/*                                          */
/* ---------------------------------------- */

window.addEventListener("load", ()=>{
    let script = document.createElement("script");
    script.src = "./lib/prism.js";
    script.onload = () => {
        window.prismLoaded = true;
    };
    document.body.appendChild(script);

    let script2 = document.createElement("script");
    script2.src = "https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js";
    document.body.appendChild(script2);

    let style = document.createElement("link");
    style.rel = "stylesheet";
    style.href = "./lib/prism.css";
    document.head.appendChild(style);

    /* xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx */
    document.querySelectorAll("a")[0].click();
});

class Extentions{
    static audio = [".mp3", ".wav", ".ogg", ".aac", ".opus", ".webm"];
    static video = [".mp4", ".webm", ".ogv"];
    static office = [".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".odt", ".ods", ".odp", ".rtf", ".docm", ".dotx", ".xlsm", ".xltx", ".pptm", ".potx", ".pdf", ".xps"];
    static image = [".jpg", ".jpeg", ".jfif", ".pjpeg", ".pjp", ".png", ".gif", ".svg", ".apng", ".webp", ".avif", ".bmp", ".ico", ".cur"];
    static text = [".txt", ".csv", ".log", ".xml", ".json", ".html", ".htm", ".css", ".js", ".ts", ".tsx", ".jsx", ".md", ".bat", ".cmd", ".ini", ".conf", ".yml", ".yaml", ".toml", ".reg", ".py", ".java", ".c", ".cpp", ".h", ".hpp", ".rb", ".php", ".sh", ".pl", ".asm", ".sql", ".ps1", ".cfg", ".dockerfile", ".gitignore", ".gitattributes", ".env", ".tex"];

    static getCategory(ext){
        if(this.audio.includes(ext)){
            return "audio";
        }
        else if(this.video.includes(ext)){
            return "video";
        }
        else if(this.office.includes(ext)){
            return "office";
        }
        else if(this.image.includes(ext)){
            return "image";
        }
        else if(this.text.includes(ext)){
            return "text";
        }
        else{
            return "N/A";
        }
    }
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

async function DisplayFile(ext, path) {
    if (opened) document.getElementById("fileFrame").remove();
    CreateFrame();
    let content = document.getElementById("content");
    let fileType = Extentions.getCategory(ext);
    let name = GetFileName(path);
    let element = document.createElement("div");
    let element2 = null
    let title = document.createElement("p");
    title.style.color = "#d3d3d3";
    title.style.textAlign = "center";
    title.innerText = name;
    element.appendChild(title);
    element.style = `
        display: block;
        user-select: none;
        position: absolute;
        z-index: 999;
        width: 100%;
    `;

    switch(fileType){
        case "audio":
            element2 = document.createElement("audio");
            element2.controls = true;
            element2.src = path;
            element2.alt = path;
            break;
        case "video":
            element2 = document.createElement("video");
            element2.controls = true;
            element2.src = path;
            element2.alt = path;
            break;
        case "office":
            if(ext == ".pdf"){
                element2 = document.createElement("iframe");
                element2.src = path;
                element2.style.width = "100%";
                element2.style.height = "75vh";
            }
            else if(ext == ".xlsx"){
                element2 = document.createElement("div");

                let element3 = document.createElement("div");

                setTimeout(()=>{LoadSheet(0);}, 200)
                
                element2.style.height = "75vh";
                element2.style.overflowY = "scroll";

                function LoadSheet(index){
                    fetch(path)
                        .then(r => r.arrayBuffer())
                        .then(buf => {
                            let wb = XLSX.read(new Uint8Array(buf), {type:'array'});
                            let ws = wb.Sheets[wb.SheetNames[index]];
                            let data = XLSX.utils.sheet_to_json(ws, {defval:''});
                            if (data.length){
                            let keys = Object.keys(data[0]);
                            let html = `
                                <table style="border-collapse: collapse; border: 1px solid black; background-color: #d3d3d3;">
                                    <thead>
                                        <tr style="border: 1px solid black; background-color: #5f5f5f; color: white; text-align: center;">
                                            <td style="padding: 10px 15px; border: 1px solid black; font-weight: bolder;">#</td>
                                            ${keys.map((_, colIndex) => `<td style="padding: 10px 15px; border: 1px solid black; font-weight: bolder;">${GetLetter(colIndex)}</td>`).join('')}
                                        </tr>
                                    </thead>
                                    <tbody style="border: 1px solid black;">
                                        ${
                                            data.map((row, x) =>
                                                `<tr><td style="background-color: #5f5f5f; color: white; padding: 10px 15px; border: 1px solid black; font-weight: bolder; text-align: center;">${x + 1}</td>` +
                                                keys.map(k => `<td style="border: 1px solid black; padding: 10px 15px;">${row[k]}</td>`).join('') +
                                                '</tr>'
                                            ).join('')
                                        }
                                    </tbody>
                                </table>
                            `;
                            element3.innerHTML = html;

                            let element4 = document.createElement("div");
                            element4.style.textAlign = "center";
                            Object.keys(wb.Sheets).forEach((el,i) =>{
                                let span = document.createElement('span');
                                span.innerText = ` [${el}] `
                                if(i == index){
                                    span.style.color = "#8888ff";
                                }
                                else{
                                    span.style.color = "#d3d3d3";
                                }
                                span.addEventListener("click", ()=>{
                                    LoadSheet(i);
                                });
                                element4.appendChild(span);
                            });
                            element2.appendChild(element3);
                            element3.prepend(element4);
                        }
                        else{ return element3.textContent = 'No data'; }
                    }).catch(e => element3.textContent = 'Error: ' + e.message);
                }
                function GetLetter(num) {
                    let result = '';
                    while (num >= 0) {
                        result = String.fromCharCode((num % 26) + 97) + result;
                        num = Math.floor(num / 26) - 1;
                    }
                    return result;
                }
            }
            else if(ext == ".docx"){
                
            }

            break;
        case "image":
            element2 = document.createElement("img");
            element2.src = path;
            element2.alt = name;
            break;
        case "text":
            element2 = document.createElement("div");
            element2.style.maxWidth = "85%";

            let element3 = document.createElement("pre");

            fetch(path)
            .then(response => response.text())
            .then(text => {
                const codeText = text
                .replaceAll("&", "&amp;")
                .replaceAll("<", "&lt;")
                .replaceAll(">", "&gt;")
                .replaceAll("\"", "&quot;")
                .replaceAll("'", "&#39;");
                element3.innerHTML = `<code class="language-${ext.replace(".", "")}">${codeText}</code>`;
                
                window.Prism.highlightAll();
            });
            element2.style.height = "75vh";
            element2.style.overflowY = "scroll";
            element2.appendChild(element3);
            break;
        case "N/A":
            element2 = document.createElement("a");
            element2.href = path;
            element2.innerText = "Download";
            element2.download = name;
            element2.style = `
                padding: 0.6% 2%;
                display: block;
                background: #4F80FF;
                text-decoration: none;
                color: white;
                font-size: 1.2em;
                border-radius: 10px;
                width: fit-content;
            `;
            break;
    }
    
    element2.style.margin = "0 auto";
    element2.style.display = "block";
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

    element.style.cursor = "grab";
    element.addEventListener("mousedown", (event) => {
        if(fileType == "image"){
            element.style.transition = "transform 0s";
            isDragging = true;
            startX = event.clientX - currentX;
            startY = event.clientY - currentY;
            element.style.cursor = "grabbing";
        }
    });

    document.addEventListener("mouseup", () => {
        if(fileType == "image"){
            isDragging = false;
            element.style.cursor = "grab";
        }
    });

    document.addEventListener("mousemove", (event) => {
        if(fileType == "image"){
            if (!isDragging) return;
            currentX = event.clientX - startX;
            currentY = event.clientY - startY;
            updateTransform();
        }
    });
    element.addEventListener("dragstart", (e) => {
        if(fileType == "image"){
            e.preventDefault();
        }
    });
    
    element.appendChild(element2);
    content.appendChild(element);
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
        justify-content: space-evenly;  /* <-- changed from center */
        z-index: 1010;
        overflow-y: auto;
        max-width: 100vw;
        padding: 0 1vw;  /* optional, add side padding */
    `;


    
    libElements.forEach(el => {
        let item = document.createElement("a");

        item.style = `
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            width: 8vw;      /* fixed width for equal spacing */
            height: 100%;
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









