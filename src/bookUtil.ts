import { ExtensionContext, workspace, window,QuickPickItem } from 'vscode';
import * as fs from "fs";
let curr_page_numberNew = 0;
let ttOutAuto: NodeJS.Timeout;
interface CustomQuickPickItem extends QuickPickItem {
    index: number;
    label: string;
    description: string;
}

export class Book {
    curr_page_number: number = 1;
    curr_page_numberNew: number = 0;
    page_size: number | undefined = 50;
    page = 0;
    start = 0;
    end = this.page_size;
    filePath: string | undefined = "";
    filePathName: string | undefined = "";
    extensionContext: ExtensionContext;
    ttOutAuto: NodeJS.Timeout = setTimeout(() => { }, 100);

    constructor(extensionContext: ExtensionContext) {
        this.extensionContext = extensionContext;
    }

    getSize(text: string) {
        let size = text.length;
        this.page = Math.ceil(size / this.page_size!);
    }

    getFileName() {
        var file_name: string | undefined = this.filePath!.split("/").pop();
        console.log(file_name);
    }

    getPage(type: string) {
        var curr_page = curr_page_numberNew || <number>workspace.getConfiguration().get('youjiBok.currPageNumber');
        var page = 0;

        if (type === "previous") {
            if (curr_page! <= 1) {
                page = 1;
            } else {
                page = curr_page - 1;
            }
        } else if (type === "next") {
            if (curr_page! >= this.page) {
                page = this.page;
            } else {
                page = curr_page + 1;
            }
        } else if (type === "curr") {
            page = curr_page;
        }

        this.curr_page_number = page;
        // this.curr_page_number = this.extensionContext.globalState.get("book_page_number", 1);
    }

    updatePage() {
        curr_page_numberNew = this.curr_page_number;
        clearTimeout(ttOutAuto);
		const delayTime = <number>workspace.getConfiguration().get('youjiBok.delayTime');
			
        ttOutAuto = setTimeout(() => {
            curr_page_numberNew = 0;
            workspace.getConfiguration().update('youjiBok.currPageNumber', this.curr_page_number, true);
        }, delayTime*3);
    }
    updatePage1() {
        curr_page_numberNew = this.curr_page_number;
        clearTimeout(ttOutAuto);
        curr_page_numberNew = 0;
        workspace.getConfiguration().update('youjiBok.currPageNumber', this.curr_page_number, true);
    }

    getStartEnd() {
        this.start = this.curr_page_number * this.page_size!;
        this.end = this.curr_page_number * this.page_size! - this.page_size!;
    }

    readFile() {
        if (this.filePath === "" || typeof (this.filePath) === "undefined") {
            window.showWarningMessage("空空如也");
        }

        var data = fs.readFileSync(this.filePath!, 'utf-8');
        
        var line_break = <string>workspace.getConfiguration().get('youjiBok.lineBreak');

        return data.toString().replace(/\n/g, line_break).replace(/\r/g, " ").replace(/　　/g, " ").replace(/ /g, " ");
    }

    init() {
        this.filePath = workspace.getConfiguration().get('youjiBok.filePath');
        var is_english = <boolean>workspace.getConfiguration().get('youjiBok.isEnglish');
        
        if (is_english === true) {
            this.page_size = <number>workspace.getConfiguration().get('youjiBok.pageSize') * 2;
        } else {
            this.page_size = workspace.getConfiguration().get('youjiBok.pageSize');
        }
    }

    getPreviousPage() {
        var is_disabled = <boolean>workspace.getConfiguration().get('youjiBok.disabled');
        if(is_disabled){
            return ''
        }
        this.init();

        let text = this.readFile();

        this.getSize(text);
        this.getPage("previous");
        this.getStartEnd();

        var page_info = this.curr_page_number.toString() + "/" + this.page.toString();

        this.updatePage();
        return text.substring(this.start, this.end) + "    " + page_info;
    }

    getNextPage() {
        var is_disabled = <boolean>workspace.getConfiguration().get('youjiBok.disabled');
        if(is_disabled){
            return ''
        }
        this.init();

        let text = this.readFile();

        this.getSize(text);
        this.getPage("next");
        this.getStartEnd();

        var page_info = this.curr_page_number.toString() + "/" + this.page.toString();

        this.updatePage();

        return text.substring(this.start, this.end) + "    " + page_info;
    }
    setTxtShow(){
        // 初始化
        this.init();

        // 读取文件内容
        let text = this.readFile();

        // 获取文本大小
        this.getSize(text);

        // 获取起始和结束位置
        this.getStartEnd();

        // 构造页面信息字符串
        var page_info = this.curr_page_number.toString() + "/" + this.page.toString();

        // 更新页面
        this.updatePage();

        const exhibit = <string>workspace.getConfiguration().get('youjiBok.exhibit');
		if(exhibit === 'bar'){
            window.setStatusBarMessage(text.substring(this.start, this.end) + "    " + page_info)
        }
        // 设置状态栏消息，显示当前页面的文本内容以及页面信息
    }

    async getJumpingPage() {
        var is_disabled = <boolean>workspace.getConfiguration().get('youjiBok.disabled');
        if(is_disabled){
            return ''
        }
        
        let txt = await window.showInputBox({
            ignoreFocusOut: true,
            prompt: '请输入页数：',
            validateInput: (value) => {
                const num = parseInt(value, 10);
                if (isNaN(num) || num < 1) {
                    return '请输入一个大于0的数字！';
                }
                return null; // 如果输入有效，返回null表示验证通过
            }
        });
    
        if (!txt || isNaN(Number(txt))) {
            return; // 如果输入为空或不是数字，则直接返回
        }
    
        this.curr_page_number = Number(txt);
        this.setTxtShow();
        this.updatePage1();
    }

    async searchJump() {
        let txt = await window.showInputBox({ ignoreFocusOut: true, prompt: '请搜索文本：' });
        if (!txt) {
            return;
        }
        this.init();

        let text = this.readFile();
        let indices = this.findAllOccurrences(text, txt);
        if (indices.length === 0) {
            window.showInformationMessage('未找到指定文本！');
            return;
        }
        let size = this.page_size || 20;

        let items: CustomQuickPickItem[] = indices.map((index) => ({
            label: `页数: ${Math.ceil(index  / size)}，位置: ${index}`,
            description: `内容：${text.substring(index-5, index + size)}`,
            index: index
        }));

        let selected = await window.showQuickPick(items, { placeHolder: '选择一个位置进行跳转' });

        if (selected) {
            this.curr_page_number = Math.ceil(selected.index  / size);
            this.setTxtShow();
            this.updatePage1();
            
        }
    }

    findAllOccurrences(text: string, searchString: string, maxResults: number = 20): number[] {
        let indices: number[] = [];
        let index = text.indexOf(searchString);
        let count = 0;
    
        while (index !== -1 && count < maxResults) {
            indices.push(index);
            index = text.indexOf(searchString, index + 1);
            count++;
        }
    
        return indices;
    }

    
}