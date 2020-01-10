"""
# 티스토리를 위한 컴파일러 도구

HTML 인젝션 도구와 SASS컴파일러

## HTML inject

skin.html 파일에 `{{ 파일명 }}`이 있는 지점에 ./source/html 내용물을
주입하여 내보낸다. 예시: `{{ article.html }}`

"""
import datetime
import os
import re
import time
from typing import List

import sass
from bs4 import BeautifulSoup
from watchdog.events import FileSystemEventHandler
from watchdog.observers import Observer

from _jsmin import jsmin

# HTML 조각 파일 정규식 {{ partial.html }}
HTML_IMPORT_REGEX: str = r'\{\{ *?(?P<src>.+?) *?\}\}'

DIR_SOUCRCE: str = "source"
DIR_OUTPUT: str = "src"

MAIN_HTML: str = "skin.html"
MAIN_SCSS: List[str] = ["style.scss", "theme.scss"]
MAIN_JS: List[str] = ["onload.js", "preload.js"]


class DevEventHandler(FileSystemEventHandler):
    """파일 변경 이벤트 감지 핸들러"""
    global HTML_IMPORT_REGEX
    global DIR_SOUCRCE, DIR_OUTPUT
    global MAIN_HTML, MAIN_SCSS, MAIN_JS

    def on_modified(self, event):
        file_path = event.src_path
        file_ext = file_path.split('.')[-1]
        if file_ext == "html":
            self._html_compile()
        elif file_ext == "scss":
            self._sass_compile()
        elif file_ext == "js":
            self._js_compile()
        else:
            return

    def _html_compile(self):
        import_path = os.path.join(DIR_SOUCRCE, MAIN_HTML)
        export_file = os.path.join(DIR_OUTPUT, MAIN_HTML)
        html = ""
        with open(import_path, 'r', 1, "utf-8") as f:
            html += f.read()
        flag = re.search(HTML_IMPORT_REGEX, html)
        while flag:
            src = os.path.join(
                DIR_SOUCRCE, flag.group('src').strip())
            try:
                with open(src, 'r', 1, "utf-8") as hfile:
                    html = html.replace(flag.group(), hfile.read())
            except FileNotFoundError:
                html = html.replace(flag.group(), "")
                print(f"경고: [{src}]을 찾을 수 없습니다.")
            flag = re.search(HTML_IMPORT_REGEX, html)
        with open(export_file, 'w', 1, "utf-8") as hfile:
            soup = BeautifulSoup(html, 'html5lib')
            html = soup.prettify()
            u = re.compile(r'^(\s*)', re.MULTILINE)
            html = u.sub(r'\1' * 2, html)
            hfile.write(html)
        print('[변경]', export_file)

    def _sass_compile(self):
        try:
            os.mkdir(os.path.join(DIR_OUTPUT, "images"))
        except:
            pass
        for path in MAIN_SCSS:
            import_path = os.path.join(DIR_SOUCRCE, path)
            fsplit = path.split(".")
            if fsplit[-2] == "style":
                export_path = os.path.join(DIR_OUTPUT, fsplit[-2] + ".css")
            else:
                export_path = os.path.join(
                    DIR_OUTPUT, "images", fsplit[-2] + ".css")
            try:
                sass_str = sass.compile(
                    filename=import_path, output_style='compressed')
                with open(export_path, 'w', 1, "utf-8") as sfile:
                    sfile.write(sass_str)
                print('[변경]', export_path)
            except:
                print('[실패]', import_path)

    def _js_compile(self):
        try:
            os.mkdir(os.path.join(DIR_OUTPUT, "images"))
        except:
            pass
        for path in MAIN_JS:
            import_path = os.path.join(DIR_SOUCRCE, path)
            export_path = os.path.join(DIR_OUTPUT, "images", path)
            with open(import_path, 'r', 1, "utf-8") as jfile:
                js_min = jsmin(jfile.read())
            with open(export_path, 'w', 1, "utf-8") as jfile:
                jfile.write(js_min)
            print('[변경]', export_path)


if __name__ == "__main__":
    # TistoryCompile()
    handler = DevEventHandler()
    source_dir = os.path.join('./', DIR_SOUCRCE)
    obsever = Observer()
    obsever.schedule(handler, path=source_dir, recursive=True)
    obsever.start()
    obsever.join()
