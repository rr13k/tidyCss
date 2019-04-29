// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	try {
		require("./hover")(context);
		let tidy = require("./tidy");
		let disposable = vscode.commands.registerCommand('tidyCss.main', function () {
		var textBody =  vscode.window.activeTextEditor.document.getText(new vscode.Range(new vscode.Position(0, 0), new vscode.Position( vscode.window.activeTextEditor.document.lineCount + 1, 0)));
		var cssDetailsList = tidy.tidyReBody(textBody)
		let newTextBody =  tidy.tidyCss(textBody,cssDetailsList);
		vscode.window.activeTextEditor.edit(editBuilder => {
			const end = new vscode.Position(vscode.window.activeTextEditor.document.lineCount + 1, 0);
			editBuilder.replace(new vscode.Range(new vscode.Position(0, 0), end), newTextBody);
		});
		vscode.window.showInformationMessage('tidy css finished!');
	});
	context.subscriptions.push(disposable);
	} catch (error) {
		console.error(error)
	}
}

exports.activate = activate;

function deactivate() {}

module.exports = {
	activate,
	deactivate
}

