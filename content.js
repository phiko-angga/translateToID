var mouseDownTop; var mouseUpTop;

function removeSpace(x) {
  return x.replace(/^\s+|\s+$/gm,'');
}

function updateSpace(x)
{
    x=x.replace(" ","%20");
    return x;
}

function getSelectionText(event) {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
		if(text.length){
			console.log('addPopupToggle');
			addPopupToggle(event, updateSpace(removeSpace(text)));
		}
		
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return updateSpace(removeSpace(text));
}

function removePopupToggle(){
	var elem = document.getElementById("myPopup");
	if(elem){
		elem.remove();
	}
}

function addPopupToggle(event, url){
	removePopupToggle();
  
	const span = document.createElement("span");
	span.classList.add("popuptext");
	span.setAttribute("id", "myPopup");
	
	const ahref = document.createElement("a");
	ahref.setAttribute("href", "https://translate.google.com/?sl=auto&tl=id&text="+url);
	ahref.setAttribute("target", "_blank");
	ahref.setAttribute("id", "aTranslate");
	span.appendChild(ahref);
	
	const node = document.createTextNode("Go translate");
	ahref.appendChild(node);

	const element = event.target;
	console.log(element);
	element.appendChild(span);
	
	span.classList.toggle("show");
	
	//JS
	var x = event.clientX;
	var y = mouseDownTop < mouseUpTop ? mouseDownTop : mouseUpTop;
	var offY = 75;//element.offsetHeight;
	console.log('y '+y);
	console.log('element.offsetHeight '+element.offsetHeight);
	
	span.style.position="fixed";
	span.style.left=x+"px";
	span.style.top=(y - offY) + "px";
	
}

function fireTranslate(event){
	var elem = document.getElementById("myPopup");
	if(elem){
		
		if (elem !== event.target && !elem.contains(event.target)) {  
			let text = getSelectionText(event);
		}
	}else{
		let text = getSelectionText(event);
	}
}

function fireRemove(evt){
	var elem = document.getElementById("myPopup");
	if(elem){
		let targetElement = evt.target; // clicked element
		
		if (elem !== targetElement && !elem.contains(targetElement)) { 
			removePopupToggle();
		}
	}
}

document.addEventListener("click", (evt) => {
    const aTranslate = document.getElementById("aTranslate");
    let targetElement = evt.target; // clicked element
	
    if (targetElement === aTranslate) {
		aTranslate.click();
		console.log('true');
	}else{
		console.log('false');
	}
});

document.addEventListener('dblclick', function( event ) {
	fireTranslate(event);
});
document.addEventListener('mouseup', function( event ) {
	mouseUpTop = event.clientY;
	fireTranslate(event);
});
 
document.addEventListener("mousedown", (evt) => {
	mouseDownTop = evt.clientY;
	fireRemove(evt);
});
document.addEventListener("scrollHeight", (evt) => {
	fireRemove(evt);
});
document.addEventListener("wheel", (evt) => {
	fireRemove(evt);
});

