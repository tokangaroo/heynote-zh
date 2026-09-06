import os from "os";
import { keyHelpStr } from "../shared-utils/key-helper";

const created = (new Date()).toISOString()

export const initialContent = `
{"formatVersion":"1.0.0","name":"草稿本"}
∞∞∞text;created=${created}
欢迎使用 Heynote！👋

${keyHelpStr(os.platform())}
∞∞∞markdown;created=${created}
完整文档请见 https://heynote.com/docs
∞∞∞math;created=${created}
这是一个数学区块，每一行都会作为数学表达式求值。

radius = 5
area = radius^2 * PI
sqrt(9)

它还支持一些基本的单位换算，包括货币：

13 inches in cm
time = 3900 seconds to minutes
time * 2

1 EUR in USD
∞∞∞markdown;created=${created}
在 Markdown 区块中，[x] 和 [ ] 列表会被渲染为复选框：

- [x] 下载 Heynote
- [ ] 试用 Heynote
∞∞∞text-a;created=${created}
`

export const initialDevContent = initialContent + `
∞∞∞python-a;created=2022-12-15T11:57:40.988Z
# hmm
def my_func():
  print("hejsan")

∞∞∞javascript-a;created=2025-12-15T11:57:40.988Z
import {basicSetup} from "codemirror"
import {EditorView, keymap} from "@codemirror/view"
import {javascript} from "@codemirror/lang-javascript"
import {indentWithTab, insertTab, indentLess, indentMore} from "@codemirror/commands"
import {nord} from "./nord.mjs"

let editor = new EditorView({
  //extensions: [basicSetup, javascript()],
  extensions: [
    basicSetup, 
    javascript(), 
    //keymap.of([indentWithTab]),
    keymap.of([
      {
          key: 'Tab',
          preventDefault: true,
          //run: insertTab,
          run: indentMore,
      },
      {
          key: 'Shift-Tab',
          preventDefault: true,
          run: indentLess,
      },
    ]),
    nord,
  ],
  parent: document.getElementById("editor"),
})
∞∞∞json
{
    "name": "heynote-codemirror",
    "type": "module",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "build": "rollup -c"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "dependencies": {
        "@codemirror/commands": "^6.1.2",
        "@codemirror/lang-javascript": "^6.1.2",
        "@codemirror/lang-json": "^6.0.1",
        "@codemirror/lang-python": "^6.1.1",
        "@rollup/plugin-node-resolve": "^15.0.1",
        "codemirror": "^6.0.1",
        "i": "^0.3.7",
        "npm": "^9.2.0",
        "rollup": "^3.8.1",
        "rollup-plugin-typescript2": "^0.34.1",
        "typescript": "^4.9.4"
    }
}
∞∞∞html
<html>
    <head>
        <title>Test</title>
    </head>
    <body>
        <h1>Test</h1>
        <script>
            console.log("hej")
        </script>
    </body>
</html>
∞∞∞sql;created=${created}
SELECT * FROM table WHERE id = 1;
∞∞∞text;created=${created}
购物清单：

- 牛奶
- 鸡蛋
- 面包
- 奶酪`

