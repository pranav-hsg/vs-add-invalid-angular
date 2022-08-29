// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {ParseJS} from './utils/jsParse';
import {HtmlTool,ObjectHelperClass,StringHelper} from './utils/util';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

let pj:ParseJS;
let ht: HtmlTool;
function init(){
	pj = new ParseJS();
	ht = new HtmlTool();
}
async function  takeInput():Promise<string>{
	let selectedtext;
	const searchQuery = await vscode.window.showInputBox({
		placeHolder: "Search query",
		prompt: "Search my snippets on Codever",
		value: 'Enter search number'
	});
	if(searchQuery === ''){
		console.log(searchQuery);
		vscode.window.showErrorMessage('A search query is mandatory to execute this action');
	
	}
	
	if(searchQuery !== undefined){
		// const searchUrl = `https://www.codever.land/search?q=${searchQuery}&sd=my-snippets`;
		// vscode.env.openExternal(Uri.parse(searchUrl));
		return new Promise<string>((res,rej)=>{
			res(searchQuery);
		});
	}
	return 	new Promise<string>((res,rej)=>{
		res('');
	});
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	init();
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "invalidmod" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

	function addInvalidReactive(input:string,number:string):string{
		let name = ht.extractAttribute(input,'formControlName');
		let nameVal = ht.extractAttributeValue(name);
		let out = <string>ht.addAttribute(input,`[invalid]="t${number}('${nameVal}')"`);
		return out;
	}
	let disposable = vscode.commands.registerCommand('invalidmod.formControl',async () => {
		const number = await takeInput();
		const editor = vscode.window.activeTextEditor;
		if (editor) {
				let document = editor.document;
				const documentText = document.getText();
				let text = documentText;
				let invalidRange = new vscode.Range(0, 0, editor.document.lineCount, 0);
				// To ensure that above range is completely contained in this document.
				let validFullRange = editor.document.validateRange(invalidRange);
				text = text.replace(/<validation-error[\s\n\S.]*?\/validation-error>/g,'');
				const inputDivs = ht.extractAllTagWithAttr(text,'div','class=".*?field.*?"');
				for(let inputDiv of inputDivs) {
					// console.log(inputDiv)
					let input  = ht.extractHtmlTag(inputDiv,'input','',true);
					if(!input) {input = ht.extractHtmlTag(inputDiv,'select')};
					if(!input) {console.error('error occurred no input');continue;}
					let repVal = addInvalidReactive(input,number);
					text = text.replace(input,repVal);
				}
				editor.edit(editBuilder => {
					editBuilder.replace(validFullRange, text);
					
				
				})
				
			}
	});
	function addInvalid(input:string):string{
		let out;
		let name = ht.extractAttribute(input,'name');
		let nameVal = ht.extractAttributeValue(name);
		let trv = ht.extractAttributeFromVal(input,'ngModel');
		if(trv) {
			out = <string>ht.addAttribute(input, ` [invalid]="${trv.slice(1)}.invalid" `);
		 }else{ 

			 out = <string>ht.addAttribute(input, `#${nameVal}="ngModel" [invalid]="${nameVal}.invalid" `);
		}
		return out;
	}
	let disposable2 = vscode.commands.registerCommand('invalidmod.putInvalid', () => {
		// vscode.commands.executeCommand("editor.action.format");
		const editor = vscode.window.activeTextEditor;
		if (editor) {
				let document = editor.document;
				const documentText = document.getText();
				let text = documentText;
				let invalidRange = new vscode.Range(0, 0, editor.document.lineCount, 0);
				// To ensure that above range is completely contained in this document.
				let validFullRange = editor.document.validateRange(invalidRange);
				const inputDivs = ht.extractAllTagWithAttr(text,'div','class=".*?field.*?"');
				for(let inputDiv of inputDivs) {
					// console.log(inputDiv)
					let input  = ht.extractHtmlTag(inputDiv,'input','',true);
					if(!input) {input = ht.extractHtmlTag(inputDiv,'select')};
					if(!input) {console.error('error occurred no input');continue;}
					let repVal = addInvalid(input);
					text = text.replace(input,repVal);
				}
				console.log(text);
				text=text.replace(/<ig-input[\s\n\S.]*?\/ig-input>/g,'');
				editor.edit(editBuilder => {
					editBuilder.replace(validFullRange, text);
					// vscode.commands.executeCommand("editor.action.format");
					// vscode.commands.executeCommand("autoimport.autoComplete");
				
				})
		vscode.window.showInformationMessage('Hello World from invalidmod!');
	}

	context.subscriptions.push(disposable);
	context.subscriptions.push(disposable2);
});
}
// this method is called when your extension is deactivated
export function deactivate() {}
