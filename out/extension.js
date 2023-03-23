"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode_1 = require("vscode");
const book = require("./bookUtil");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "youji-bok" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let ttOut;
    // 老板键
    let displayCode = vscode_1.commands.registerCommand('extension.displayCode', () => {
        let lauage_arr_list = [
            '',
            '',
        ];
        if (ttOut) {
            clearTimeout(ttOut);
        }
        var index = Math.floor((Math.random() * lauage_arr_list.length));
        vscode_1.window.setStatusBarMessage(lauage_arr_list[index]);
    });
    // 下一页
    let getNextPage = vscode_1.commands.registerCommand('extension.getNextPage', () => {
        if (ttOut) {
            clearTimeout(ttOut);
        }
        ttOut = setTimeout(() => {
            vscode_1.window.setStatusBarMessage('.');
        }, 5000);
        let books = new book.Book(context);
        vscode_1.window.setStatusBarMessage(books.getNextPage());
    });
    // 上一页
    let getPreviousPage = vscode_1.commands.registerCommand('extension.getPreviousPage', () => {
        if (ttOut) {
            clearTimeout(ttOut);
        }
        ttOut = setTimeout(() => {
            vscode_1.window.setStatusBarMessage('.');
        }, 5000);
        let books = new book.Book(context);
        vscode_1.window.setStatusBarMessage(books.getPreviousPage());
    });
    // 跳转某个页面
    let getJumpingPage = vscode_1.commands.registerCommand('extension.getJumpingPage', () => {
        let books = new book.Book(context);
        vscode_1.window.setStatusBarMessage(books.getJumpingPage());
    });
    let disabled = vscode_1.commands.registerCommand('extension.disabled', () => {
        // let books = new book.Book(context);
        // window.setStatusBarMessage(books.getJumpingPage());
        vscode_1.workspace.getConfiguration().update('youjiBok.disabled', true, true);
    });
    let noDisabled = vscode_1.commands.registerCommand('extension.noDisabled', () => {
        // let books = new book.Book(context);
        // window.setStatusBarMessage(books.getJumpingPage());
        vscode_1.workspace.getConfiguration().update('youjiBok.disabled', false, true);
    });
    context.subscriptions.push(displayCode);
    context.subscriptions.push(disabled);
    context.subscriptions.push(noDisabled);
    context.subscriptions.push(getNextPage);
    context.subscriptions.push(getPreviousPage);
    context.subscriptions.push(getJumpingPage);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map