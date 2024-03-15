// -------- yellow fade for script reference --------

// Including this script in a page will automatically:
// 1. Highlight a target item from the URL if one is present.
// 2. Setup all anchor tags with targets pointing to the current page to cause a fade on the target element when clicked.

// Fade parameters
var FadeInterval = 300; // ms
var StartFadeAt = 6;
var FadeSteps = new Array();
FadeSteps[1] = "#ffffff";
FadeSteps[2] = "#fffff8";
FadeSteps[3] = "#fffff0";
FadeSteps[4] = "#ffffe8";
FadeSteps[5] = "#ffffe0";
FadeSteps[6] = "#ffffc8";

// Connect the script to the page
var W3CDOM = (document.createElement && document.getElementsByTagName);
addEvent(window, 'load', initFades);
// Connects the script to the page so that you do not need any inline script
// See http://www.scottandrew.com/weblog/articles/cbs-events for more information
function addEvent(obj, eventType,fn, useCapture)
{
	if (obj.addEventListener) {
		obj.addEventListener(eventType, fn, useCapture);
		return true;
	} else {
		if (obj.attachEvent) {
			var r = obj.attachEvent("on"+eventType, fn);
			return r;
		}
	}
}

function initFades()
{
	if (!W3CDOM) return;
	
	// If there is a '#' in the URL, highlight the target
	var currentURL = unescape(window.location);
	if (currentURL.indexOf('#')>-1)
	{
		var anchor = currentURL.substring(currentURL.indexOf('#')+1,currentURL.length);
		DoFade(StartFadeAt, anchor);
	}
	
	// Search the page body for anchors and add onclick events so that their targets get highlighted
	var anchors = document.body.getElementsByTagName('a');	
	for (var i=0;i<anchors.length;i++)	
		if (anchors[i].href.indexOf('#')>-1)
			anchors[i].onclick = function(){Highlight(this.href);return true};
}

function Highlight(target) {
	var targetId = target.substring(target.indexOf('#')+1,target.length);
	DoFade(StartFadeAt, targetId);
}

// This is the recursive function call that actually performs the fade
function DoFade(colorId, targetId) {
	if (colorId >= 1) {
		document.getElementById(targetId).style.backgroundColor = FadeSteps[colorId];		
		if (colorId==1) {
			document.getElementById(targetId).style.backgroundColor = "transparent";
		}
		colorId--;		
		setTimeout("DoFade("+colorId+",'"+targetId+"')", FadeInterval);
	}
}

