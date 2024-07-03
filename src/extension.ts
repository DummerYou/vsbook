// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { commands, ExtensionContext, window ,workspace ,Range ,TextEditorDecorationType} from 'vscode';
import * as book from './bookUtil';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "youji-bok" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

	let ttOut: NodeJS.Timeout;
    let ttOutAuto: NodeJS.Timeout;
	let txtData:string = "";
	let decorationType: TextEditorDecorationType;
	
	window.onDidChangeWindowState((e) => {
		if (e.focused === false) {
			if(!(!txtData || txtData === '.' || txtData === '')){
				let books = new book.Book(context);
				books.getPreviousPage()
				setTtOut(false)
				showTxt("")
			}
		}
	});

	let showTxt = (txt:string)=>{
		const exhibit = <string>workspace.getConfiguration().get('youjiBok.exhibit');
		txtData = txt;
		if(exhibit === 'bar'){
			window.setStatusBarMessage(txt)
		}else if(exhibit === 'box'){
			window.showInformationMessage(txt);
		}else if(exhibit === 'init'){
			if(decorationType && decorationType.dispose){
				decorationType.dispose();
			}
			if(!txt || txt === '.' || txt === ''){
				return;
			}

			const editor = window.activeTextEditor;
			if (!editor) {
				return;
			}
	
			const position = editor.selection.active;
			decorationType = window.createTextEditorDecorationType({
				after: {
					contentText: txt,
					color: 'rgba(255,255,255,0.15)'
				}
			});
	
			editor.setDecorations(decorationType, [{ range: new Range(position, position) }]);
	
		}
	}
	let getTxt = (txt:string)=>{
		const exhibit = <string>workspace.getConfiguration().get('youjiBok.exhibit');
		if(exhibit === 'bar'){
			window.setStatusBarMessage(txt)
		}else if(exhibit === 'box'){
			window.showInformationMessage(txt);
		}
	}

	let setTtOut = (state:Boolean)=>{
		if(ttOut){
			clearTimeout(ttOut)
		}
        if (ttOutAuto) {
            clearInterval(ttOutAuto);
        }
		if(state){
			const delayTime = <number>workspace.getConfiguration().get('youjiBok.delayTime');
			if(delayTime){
				ttOut = setTimeout(() => {
					showTxt('.');
				}, delayTime);
			}
			
		}
	}
	// 老板键
	let displayCode = commands.registerCommand('extension.displayCode', () => {

		let lauage_arr_list = [
			'',
			'',
		];
		setTtOut(false)

		var index = Math.floor((Math.random() * lauage_arr_list.length));
		showTxt(lauage_arr_list[index]);
	});

	// 下一页
	let getNextPage = commands.registerCommand('extension.getNextPage', () => {
		setTtOut(true)
		let books = new book.Book(context);
		showTxt(books.getNextPage());
	});

    // 自动翻页
    let nextPageAuto = commands.registerCommand('extension.nextPageAuto', () => {
        setTtOut(false)
		let books = new book.Book(context);
		const autoTime = <number>workspace.getConfiguration().get('youjiBok.autoTime');
		ttOutAuto = setInterval(() => {
			showTxt(books.getNextPage());
		}, autoTime || 3000);
    });

	// 上一页
	let getPreviousPage = commands.registerCommand('extension.getPreviousPage', () => {
		setTtOut(true)
		let books = new book.Book(context);
		showTxt(books.getPreviousPage());
	});

	// 跳转某个页面
	let getJumpingPage = commands.registerCommand('bok-jumpPage', () => {
		setTtOut(false)
		let books = new book.Book(context);
		books.getJumpingPage();
	});
	// 禁用
	let disabled = commands.registerCommand('extension.disabled', () => {
		workspace.getConfiguration().update('youjiBok.disabled', true, true);
	});
	// 启用
	let noDisabled = commands.registerCommand('extension.noDisabled', () => {
		workspace.getConfiguration().update('youjiBok.disabled', false, true);
	});
	// 搜索跳转
	let bokJump = commands.registerCommand('bok-jump',async function () {
		setTtOut(false)
		let books = new book.Book(context);
		books.searchJump();
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

// this method is called when your extension is deactivated
export function deactivate() { }
