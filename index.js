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

window.addEventListener("wheel", function(event) {
    if (event.ctrlKey) {
        event.preventDefault();
    }
}, { passive: false });


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


function DisplayFile(ext, path){

    if(opened){
        document.getElementById("fileFrame").remove();
    }
    
    CreateFrame();

    let image = document.createElement("img");
    image.src = path;
    image.alt = path;
    image.style.transition = "transform 0.2s ease";
    image.style.display = "block";

    let scale = 1;
    let translateX = 0;
    let translateY = 0;

    const updateTransform = () => {
        image.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
    };

    image.addEventListener("wheel", (event) => {
    if (event.ctrlKey) {
        event.preventDefault();
        if (event.deltaY > 0) {
            scale = Math.max(0.1, scale - 0.08);
        }
        else {
            scale = Math.min(5, scale + 0.08);
        }
    } else if (event.shiftKey) {
        event.preventDefault();
        if (event.deltaY > 0) {
            translateX -= 40;
        }
        else {
            translateX += 40;
        }
    } else {
        event.preventDefault();
        if (event.deltaY > 0) {
            translateY -= 40;
        }
        else {
            translateY += 40;
        }
    }

    updateTransform();
    }, { passive: false });

    document.getElementById("content").appendChild(image);

}


function GetFileName(path) {
    if (!path) 
        return "";

    const parts = path.split(/[/\\]/);
    return parts.pop();
}



function CreateFrame(){
    opened = true;
    let div = document.createElement("div");
    div.id = "fileFrame";
    div.style.userSelect = "none";
    div.style.fontFamily = "Arial";
    div.style.position = "fixed";
    div.style.top = 0;
    div.style.left = 0;
    div.style.height = "100vh";
    div.style.width = "100vw";
    div.style.zIndex = 1000;
    div.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
    div.style.display = "flex";
    div.style.flexDirection = "column";
    div.style.overflow = "hidden";

    let nav = document.createElement("nav");
    nav.style.width = "100vw";
    nav.style.margin = "0 auto";
    nav.style.background = "rgba(0, 0, 0, 0.6)";
    nav.style.padding = "1%";
    nav.style.userSelect = "none";
    nav.innerHTML = "<b class=\"x\">FilesJS</b>";

    let content = document.createElement("main");
    content.id = "content";
    content.style.flex = "1";
    content.style.overflow = "auto";
    content.style.width = "100vw";
    content.style.display = "flex";
    content.style.alignItems = "center";
    content.style.justifyContent = "center";
    content.style.userSelect = "none";
    content.style.background = "rgba(255, 255, 255, 0.1)";


    let footer = document.createElement("footer");
    footer.style.height = "13vh";
    footer.style.width = "100vw";
    footer.style.background = "rgba(0, 0, 0, 0.8)";
    footer.style.color = "white";
    footer.style.display = "flex";
    footer.style.alignItems = "center";
    footer.style.userSelect = "none";
    footer.style.justifyContent = "center";
    
    libElements.forEach(el => {
        let item = document.createElement("a");
        item.style.textAlign = "center";
        item.style.display = "inline-block";
        item.style.margin = "0 1%";
        item.style.cursor = "pointer";
        item.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" height="20%" fill="currentColor" class="bi bi-file-earmark-fill" viewBox="0 0 16 16"><path d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2m5.5 1.5v2a1 1 0 0 0 1 1h2z"/></svg>
                <br />
                ${GetFileName(el.getAttribute("data-filesjs"))}
            `
        item.width = "70%";
        item.height = "70%";

        item.setAttribute("data-filesjs", el)
        item.addEventListener("click", () => {
            ElementClicked(el);
        });

        footer.style.overflowY = "auto";
        footer.style.maxWidth = "100vw";
        footer.appendChild(item);
    });

    div.appendChild(nav);
    div.appendChild(content);
    div.appendChild(footer);
    document.body.appendChild(div);
}









