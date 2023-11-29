let button = document.getElementById("getQueryButton");
let textArea = document.getElementById("textArea");

button.addEventListener('click', async () => {
	let tab = await getCurrentTab();
  
	chrome.scripting.executeScript({
	  target: {tabId: tab.id},
	  func: getQuery
	}, (result_from_getQuery) => {
		try {
			updateTextArea("(" + result_from_getQuery[0].result + ")");
		} catch (error) {
			updateTextArea("Query was not found");
		}
	});
});

async function getCurrentTab() {
	let queryOptions = { 
		active: true, 
		currentWindow: true 
	};
	let [tab] = await chrome.tabs.query(queryOptions);

	return tab;
  }

function getQuery(){
	let resourceList = window.performance.getEntriesByType('resource');

	if(resourceList.length == 0) {
		alert("Please try again");
	}
	else {
		let requests = []
		for (i = 0; i < resourceList.length; i++){
			if (resourceList[i].initiatorType == 'xmlhttprequest' && (resourceList[i].name.includes('&query=((') || resourceList[i].name.includes('&query=('))){{
					requests.push(resourceList[i]);
				}
			}
		}
		
		let latest_request = requests[requests.length - 1]
		const text = latest_request.name;
	
		const regexp_template = new RegExp("(&query=)(.*)(&start)");
		const match = text.match(regexp_template);

		let result = match[2].slice(1, match[2].length - 1)
		console.log(result)

		return result;
	}
}

function updateTextArea(queryText) {
	textArea.value = queryText;
}