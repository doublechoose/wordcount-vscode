'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
function activate(context) {
    const wordCounter = new WordCounter();
    let disposable = vscode.commands.registerCommand('statusbar-sample.wordCount', () => {
        const count = wordCounter.updateWordCount();
        if (count && count >= 0) {
            vscode.window.showInformationMessage(`字数：${count}`);
        }
    });
    context.subscriptions.push(wordCounter);
    context.subscriptions.push(disposable);
}
exports.activate = activate;
class WordCounter {
    // subscribe event
    constructor() {
        // VSCode 底部状态栏
        this._statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
        // 注册事件
        const subscriptions = [];
        // 注册光标改变事件
        vscode.window.onDidChangeTextEditorSelection(this.updateWordCount, this, subscriptions);
        // 注册切换文件事件
        vscode.window.onDidChangeActiveTextEditor(this.updateWordCount, this, subscriptions);
        // 更新状态栏
        this.updateWordCount();
        // 需要释放的事件队列
        this._disposable = vscode.Disposable.from(...subscriptions);
    }
    // 获取编辑器及编辑内容的上下文
    updateWordCount() {
        // 获取当前编辑器对象
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            this._statusBarItem.hide();
            return false;
        }
        // 当前编辑对象
        const doc = editor.document;
        // const selections = editor.selections.toString();
        const selection = editor.selection;
        const word = doc.getText(selection);
        if (doc.languageId === 'markdown') {
            const wordCount = this._getWordCount(doc);
            const selectWordCount = this._getSelectWordCount(word);
            if (selectWordCount == 0) {
                this._statusBarItem.text = `字数 ${wordCount}`;
            }
            else {
                this._statusBarItem.text = `字数 ${wordCount}(已选择${selectWordCount})`;
            }
            this._statusBarItem.show();
            return wordCount;
        }
        else {
            this._statusBarItem.hide();
        }
    }
    // 统计函数
    _getWordCount(doc) {
        // 当前编辑内容
        const docContent = doc.getText();
        const filterStr = docContent.replace(/\r\n/g, "\n");
        // 中文字数
        const chineseTotal = filterStr.match(/[\u4e00-\u9fa5]/g) || [];
        // 匹配单字字符
        const englishTotal = filterStr.match(/\b\w+\b/g) || [];
        // 匹配数字
        const letterTotal = filterStr.match(/\b\d+\b/g) || [];
        return (chineseTotal.length + (englishTotal.length - letterTotal.length)) || 0;
    }
    _getSelectWordCount(selections) {
        // const textContent: string = editor.document.getText();
        const textContent = selections;
        const filterStr = textContent.replace(/\r\n/g, "\n");
        // 中文字数
        const chineseTotal = filterStr.match(/[\u4e00-\u9fa5]/g) || [];
        // 匹配单字字符
        const englishTotal = filterStr.match(/\b\w+\b/g) || [];
        // 匹配数字
        const letterTotal = filterStr.match(/\b\d+\b/g) || [];
        return (chineseTotal.length + (englishTotal.length - letterTotal.length)) || 0;
    }
    // 当插件禁用时
    dispose() {
        this._statusBarItem.dispose();
        this._disposable.dispose();
    }
}
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map