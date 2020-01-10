var LANGS_NAME = {
    "apache": "Apache",
    "css": "CSS",
    "xml": "HTML, XML",
    "kotlin": "Kotlin",
    "markdown": "Markdown",
    "perl": "Perl",
    "rust": "Rust",
    "ini": "ini, TOML",
    "bash": "Bash",
    "coffeescript": "CoffeeScript",
    "http": "HTTP",
    "less": "Less",
    "nginx": "Nginx",
    "properties": "Properties",
    "scss": "SCSS",
    "typescript": "TypeScript",
    "cs": "C#",
    "diff": "Diff",
    "json": "JSON",
    "lua": "Lua",
    "objectivec": "Objective C",
    "python": "Python",
    "sql": "SQL",
    "yml": "YAML",
    "cpp": "C++",
    "go": "Go",
    "java": "Java",
    "javascript": "JavaScript",
    "makefile": "Makefile",
    "php": "PHP",
    "ruby": "Ruby",
    "swift": "Swift",
    "plaintext": "Plaintext",
    "autohotkey": "AutoHotkey",
    "dos": "CMD",
    "mathematica": "Mathematica",
    "r": "R",
    "asciidoc": "AsciiDoc",
    "matlab": "Matlab",
    "tex": "TeX",
};
var LANGS_FONT = {
    "apache": "devicon-apache-line",
    "css": "devicon-css3-plain",
    "xml": "devicon-html5-plain",
    "coffeescript": "devicon-coffeescript-original",
    "less": "devicon-less-plain-wordmark",
    "nginx": "devicon-nginx-original",
    "properties": "devicon-java-plain",
    "scss": "devicon-sass-original",
    "typescript": "devicon-typescript-plain",
    "cs": "devicon-csharp-plain",
    "diff": "devicon-git-plain",
    "objectivec": "devicon-apple-original",
    "python": "devicon-python-plain",
    "sql": "devicon-mysql-plain",
    "cpp": "devicon-cplusplus-plain",
    "go": "devicon-go-plain",
    "java": "devicon-java-plain",
    "javascript": "devicon-javascript-plain",
    "makefile": "devicon-linux-plain",
    "php": "devicon-php-plain",
    "ruby": "devicon-ruby-plain",
    "swift": "devicon-swift-plain",
    "dos": "devicon-windows8-original"
};
var LANGS_LOGO = {
    "kotlin": "",
    "markdown": "",
    "perl": "",
    "rust": "",
    "ini": "",
    "bash": "",
    "http": "",
    "json": "",
    "lua": "",
    "yml": "",
    "plaintext": "",
    "autohotkey": "",
    "mathematica": "",
    "R": "",
    "AsciiDoc": "",
    "matlab": "",
    "tex": ""
};

var dom_sidebar = document.getElementById("sidebar");
var dom_overlay = document.getElementById("background_overlay");
var dom_totop = document.getElementById("to_top_button");
window.onscroll = function () { scrollFunction() };
scrollFunction();

function sidebar_toggle() {
    dom_sidebar.classList.toggle("active");
    dom_overlay.classList.toggle("active");
}
function scroll_to_top() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}
function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        dom_totop.classList.add("active");
    } else {
        dom_totop.classList.remove("active");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("div.tt_article_useless_p_margin").forEach(element => {
        let html = element.innerHTML;
        element.parentElement.innerHTML = html;
    });
    document.querySelectorAll("figure.imageblock").forEach(element => {
        let img = element.querySelector("span[data-lightbox] img");
        element.prepend(img);
    });
    document.querySelectorAll("article.single").forEach(element => {
        let toc_warp = element.querySelector(".toc_wrapper");
        let article_warp = element.querySelector(".artlcle_wrapper");
        let heading = article_warp.querySelectorAll('H1, H2, H3');
        let toc = '';
        heading.forEach(head => {
            let title = head.innerHTML;
            let tagname = head.tagName;
            let href = encodeURI(`${tagname}-${title}`);
            head.id = href;
            toc += `<li class="${tagname}"><a href="#${href}">${title}</a></li>`;
        });
        toc_warp.innerHTML = `<ul>${toc}</ul>`;
    });
    document.querySelectorAll("pre code").forEach((block) => {
        hljs.highlightBlock(block);
        block.classList.forEach(cls => {
            let lang = cls.replace("language-", "");
            if (cls == "language-dir") {
                let lines = block.innerHTML.split("\n");
                let list = document.createElement("UL");
                let level = 0;
                let pack = list;
                let item;
                lines.forEach(line => {
                    if (line.includes("*")) {
                        let step = line.split("*")[0].length;
                        if (step == level) {
                        } else if (step > level) {
                            let sub = document.createElement("UL");
                            sub.classList.add("sub");
                            item.append(sub);
                            level = step;
                            pack = sub;
                        } else {
                            pack = pack.parentElement.parentElement;
                        }
                        item = document.createElement("LI");
                        let txt = line.split("*").slice(1).join("*")
                        if (txt.substr(txt.length - 1) == "/") {
                            item.innerHTML = `<i class="material-icons">folder</i>${txt}`;
                        } else if (txt) {
                            item.innerHTML = `${txt}`;
                        } else { }
                        pack.append(item);
                    }
                });
                list.classList.add("directory");
                block.parentElement.after(list);
                block.parentElement.remove();
            }
            if (lang in LANGS_NAME) {
                let name = LANGS_NAME[lang];
                let codeblock = block.parentElement;
                let menubar = document.createElement("DIV");
                if (lang in LANGS_FONT) {
                    menubar.innerHTML = `<i class="icon ${LANGS_FONT[lang]}"></i><span>${name}</span>`;
                } else {
                    menubar.innerHTML = `<i class="icon devicon-devicon-plain"></i><span>${name}</span>`;
                }
                codeblock.prepend(menubar);
                codeblock.classList.add("ss_codeblock_ext");
                menubar.classList.add("ss_codeblock_menubar");
            }
        });
    });
});
