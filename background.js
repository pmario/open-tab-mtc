"use strict";

//
//
// Background main() listener!!
//
//
browser.runtime.onMessage.addListener(handleMessages);

async function handleMessages(data, sender, sendResponse) {
	// Message from contentScript
	if (data.message === "init") {
		return handleSave(data);
	}

	return "error"; // error
}

async function handleSave(message) {
	let itemId,
		results;

	// needed, for a roundtrip, to set up the right save directory.
	itemId = await browser.downloads.download({
		url: URL.createObjectURL(new Blob(["<!DOCTYPE html>\n<html>" + message.txt + "</html>\n"], {type: "text/plain"})),
		filename: "new-tab.html",
		conflictAction: "overwrite"
	});

	if (itemId) {
		results = await browser.downloads.search({id: itemId});
	}

	if (results) {
		console.log("save result: ", results[0]);
		return openNewTab(results[0].filename);
	}
}

function timeout(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function openNewTab(fName) {
	// Wait a second!
	await timeout(1000);

	browser.tabs.create({
		active: true,
		url: fName
	});
}
