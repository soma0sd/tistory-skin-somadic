var HLJS_LANGS = {
  'language-xml': { name: 'HTML/XML', devicon: 'devicon-html5-plain' },
  'language-py': { name: 'Python', devicon: 'devicon-python-plain' },
  'language-python': { name: 'Python', devicon: 'devicon-python-plain' },
  'language-cs': { name: 'C#', devicon: 'devicon-csharp-plain' },
  'language-ts': { name: 'TypeScript', devicon: 'devicon-typescript-plain' },
  'language-js': { name: 'JavaScript', devicon: 'devicon-javascript-plain' },
  'language-javascript': { name: 'JavaScript', devicon: 'devicon-javascript-plain' },
  'language-css': { name: 'CSS', devicon: 'devicon-css3-plain' },
  'language-html': { name: 'HTML', devicon: 'devicon-html5-plain' }
}

// 소스코드 하이라이트 이후 언어를 소스코드 상단에 표시
function hljsLabeler () {
  document.querySelectorAll('pre > code.hljs').forEach((block) => {
    if (block.classList[0] in HLJS_LANGS) {
      const langData = HLJS_LANGS[block.classList[0]]
      const codeblock = block.parentElement
      const menubar = document.createElement('DIV')
      menubar.innerHTML = `<i class="icon ${langData.devicon}"></i><span>${langData.name}</span>`
      menubar.classList.add('code-label')
      codeblock.prepend(menubar)
    }
  })
}

// 코드블럭에 dir로 작성한 리스트형식 코드를 디레토리 구조로 변환
function dirFormatter () {
  document.querySelectorAll('pre > code.language-dir').forEach((block) => {
    const lines = block.innerHTML.split('\n')
    const list = document.createElement('UL')
    let elemPosUL = list
    let level = 0
    let item
    lines.forEach((line, idx) => {
      const step = line.split('*')[0].length
      if (level < step) {
        // 디렉토리 내부
        elemPosUL = document.createElement('UL')
        item.append(elemPosUL)
      } else if (level > step && step >= 0) {
        elemPosUL = elemPosUL.parentElement.parentElement
      }
      const pathName = line.split('*').slice(1).join('*')
      item = document.createElement('LI')
      if (pathName.substr(pathName.length - 1) === '/') {
        item.innerHTML += '<span class="material-icons">folder</span>'
      } else {
        item.innerHTML += '<span class="material-icons">description</span>'
      }
      level = step
      item.innerHTML += ' ' + pathName
      elemPosUL.append(item)
    })
    list.classList.add('directory')
    block.parentElement.after(list)
    block.parentElement.remove()
  })
}

// 메인. 페이지 로드 이후 동작
document.addEventListener('DOMContentLoaded', () => {
  // eslint-disable-next-line no-undef
  hljs.highlightAll()
  hljsLabeler()
  dirFormatter()
})
