// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { commands, ExtensionContext, window ,workspace} from 'vscode';
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

	let setTtOut = (state:Boolean)=>{
		if(ttOut){
			clearTimeout(ttOut)
		}
		if(state){
			var delayTime = <number>workspace.getConfiguration().get('youjiBok.delayTime');
			if(delayTime){
				ttOut = setTimeout(() => {
					window.setStatusBarMessage('.');
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
		window.setStatusBarMessage(lauage_arr_list[index]);
	});

	// 下一页
	let getNextPage = commands.registerCommand('extension.getNextPage', () => {
		setTtOut(true)
		let books = new book.Book(context);
		window.setStatusBarMessage(books.getNextPage());
	});

	// 上一页
	let getPreviousPage = commands.registerCommand('extension.getPreviousPage', () => {
		setTtOut(true)
		let books = new book.Book(context);
		window.setStatusBarMessage(books.getPreviousPage());
	});

	// 跳转某个页面
	let getJumpingPage = commands.registerCommand('extension.getJumpingPage', () => {
		let books = new book.Book(context);
		window.setStatusBarMessage(books.getJumpingPage());
	});
	// 禁用
	let disabled = commands.registerCommand('extension.disabled', () => {
		workspace.getConfiguration().update('youjiBok.disabled', true, true);
	});
	// 启用
	let noDisabled = commands.registerCommand('extension.noDisabled', () => {
		workspace.getConfiguration().update('youjiBok.disabled', false, true);
	});

	context.subscriptions.push(displayCode);
	context.subscriptions.push(disabled);
	context.subscriptions.push(noDisabled);
	context.subscriptions.push(getNextPage);
	context.subscriptions.push(getPreviousPage);
	context.subscriptions.push(getJumpingPage);
}

// this method is called when your extension is deactivated
export function deactivate() { }
