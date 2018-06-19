var port = chrome.runtime.connect({name: "inject"});

document.body.addEventListener("click", function(ev) {
	//console.log("clicked");
	if (ev.ctrlKey) {
		try {
			var url = ev.target.href;
			if ( url.includes("/user") &&  url.includes != undefined && url.includes != 0 ){
				var n = url.match(new RegExp("user/" + "(.*)" +'' ));
				var user = n[1];
				
				var inj = {
					url : url,
					user: user
				}
				
				//console.log("user is : ", user);
				//console.log("inject:", url);
				port.postMessage({type: inj});	
				
			}
			ev.preventDefault();
		}catch (ev){
			//console.log(ev);
		}
	}
});


	
