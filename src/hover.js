const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

/**
 * 鼠标悬停提示!
 * @param {*} document 
 * @param {*} position 
 * @param {*} token 
 */

function provideHover(document, position, token) {
    // const fileName    = document.fileName;
    // const workDir     = path.dirname(fileName);
    // const word        = document.getText(document.getWordRangeAtPosition(position));
    const msg = "not used css!"
    return new vscode.Hover(`* **tidy css**：${msg}\n*`);
}


module.exports = function(context) {
    console.log("%c 挂载了hover事件!","color:green")
    // 注册鼠标悬停提示
    context.subscriptions.push(vscode.languages.registerHoverProvider('html', {
        provideHover
    }));
};