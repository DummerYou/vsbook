"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    let ttOutAuto;
    let txtData = "";
    vscode_1.window.onDidChangeWindowState((e) => {
        if (e.focused === false) {
            if (!(!txtData || txtData === '.' || txtData === '')) {
                let books = new book.Book(context);
                books.getPreviousPage();
                setTtOut(false);
                showTxt("");
            }
        }
    });
    let showTxt = (txt) => {
        const exhibit = vscode_1.workspace.getConfiguration().get('youjiBok.exhibit');
        txtData = txt;
        if (exhibit === 'bar') {
            vscode_1.window.setStatusBarMessage(txt);
        }
        else if (exhibit === 'box') {
            vscode_1.window.showInformationMessage(txt);
        }
    };
    let getTxt = (txt) => {
        const exhibit = vscode_1.workspace.getConfiguration().get('youjiBok.exhibit');
        if (exhibit === 'bar') {
            vscode_1.window.setStatusBarMessage(txt);
        }
        else if (exhibit === 'box') {
            vscode_1.window.showInformationMessage(txt);
        }
    };
    let setTtOut = (state) => {
        if (ttOut) {
            clearTimeout(ttOut);
        }
        if (ttOutAuto) {
            clearInterval(ttOutAuto);
        }
        if (state) {
            const delayTime = vscode_1.workspace.getConfiguration().get('youjiBok.delayTime');
            if (delayTime) {
                ttOut = setTimeout(() => {
                    showTxt('.');
                }, delayTime);
            }
        }
    };
    // 老板键
    let displayCode = vscode_1.commands.registerCommand('extension.displayCode', () => {
        let lauage_arr_list = [
            '',
            '',
        ];
        setTtOut(false);
        var index = Math.floor((Math.random() * lauage_arr_list.length));
        showTxt(lauage_arr_list[index]);
    });
    // 下一页
    let getNextPage = vscode_1.commands.registerCommand('extension.getNextPage', () => {
        setTtOut(true);
        let books = new book.Book(context);
        showTxt(books.getNextPage());
    });
    // 自动翻页
    let nextPageAuto = vscode_1.commands.registerCommand('extension.nextPageAuto', () => {
        setTtOut(false);
        let books = new book.Book(context);
        const autoTime = vscode_1.workspace.getConfiguration().get('youjiBok.autoTime');
        ttOutAuto = setInterval(() => {
            showTxt(books.getNextPage());
        }, autoTime || 3000);
    });
    // 上一页
    let getPreviousPage = vscode_1.commands.registerCommand('extension.getPreviousPage', () => {
        setTtOut(true);
        let books = new book.Book(context);
        showTxt(books.getPreviousPage());
    });
    // 跳转某个页面
    let getJumpingPage = vscode_1.commands.registerCommand('bok-jumpPage', () => {
        setTtOut(false);
        let books = new book.Book(context);
        books.getJumpingPage();
    });
    // 禁用
    let disabled = vscode_1.commands.registerCommand('extension.disabled', () => {
        vscode_1.workspace.getConfiguration().update('youjiBok.disabled', true, true);
    });
    // 启用
    let noDisabled = vscode_1.commands.registerCommand('extension.noDisabled', () => {
        vscode_1.workspace.getConfiguration().update('youjiBok.disabled', false, true);
    });
    // 搜索跳转
    let bokJump = vscode_1.commands.registerCommand('bok-jump', function () {
        return __awaiter(this, void 0, void 0, function* () {
            setTtOut(false);
            let books = new book.Book(context);
            books.searchJump();
        });
    });
    context.subscriptions.push(displayCode);
    context.subscriptions.push(disabled);
    context.subscriptions.push(noDisabled);
    context.subscriptions.push(getNextPage);
    context.subscriptions.push(nextPageAuto);
    context.subscriptions.push(getPreviousPage);
    context.subscriptions.push(getJumpingPage);
    context.subscriptions.push(bokJump);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map