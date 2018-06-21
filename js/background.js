'use strict'

var _1;
var _2;
var clicked = 0;
var flash;
var trigger_when_two = 0;
var is_now_flashing = 0;
var search_in_progress = 0;



function start_flashing(){
	flash = setInterval(flash_during_search,1500);
}


function stop_flashing(){
	clearInterval(flash);
	chrome.browserAction.setBadgeText({text: ""});
	chrome.browserAction.setBadgeBackgroundColor({color: "white"});
	
}

function flash_during_search(){

	  if (!clicked){
		clicked = 1;
		chrome.browserAction.setBadgeText({text: "."});
		chrome.browserAction.setBadgeBackgroundColor({color: "green"});
	  }
	  else if (clicked) {
		  clicked = 0;
		  chrome.browserAction.setBadgeText({text: ".."});
		  chrome.browserAction.setBadgeBackgroundColor({color: "green"});
	  }
	
}

chrome.runtime.onConnect.addListener(function(port) {
    //console.log("[background.js] -> Listening on: ",port);	
	port.onMessage.addListener(function(type,sendingPort) {		
		if (typeof type.type != 'undefined' ) {
			var total_comments = {};
			var total_posts    = {};		
			//console.log("[background.js] -> type,port,PORT_ID: ", type.type.url,port,sendingPort.sender.tab.id);
			
			if ( search_in_progress == 0 ){
				search_in_progress = 1;
				start_flashing();
				get_all_urls(type.type.url + "/comments.json?limit=100",total_comments,type.type.user,"comments");
				get_all_urls(type.type.url + "/submitted.json?limit=100",total_posts,type.type.user,"submitted");	
			}
			else if( search_in_progress == 1) {
				alert("Please wait until the current search is done.");
			}
		}
	});	
});	

function get_all_urls(full_name,comments_or_posts,user,trigger) {
		var myVar = window.setTimeout(() => { 
				get_url(full_name,comments_or_posts,user,trigger)
				.then((counter) => {
					var next = counter["next"];
					if ( next == null) 	{
						clearTimeout(myVar);
						return;
					}
					get_all_urls(full_name + "&after=" +next ,comments_or_posts,user,trigger);
				})
		}, 2000);
}

function get_url(posts,comments_or_posts,user,trigger){
	
	return new Promise(function(resolve,reject){
	  var counter = {};
	  fetch(posts).then(function(response) {
		return response.json();
	  }).then(function(myJson) {
			
			var size = myJson.data.dist;
			var data = myJson.data.children;
			var next = myJson.data.after;
			
			data.forEach(function(obj) {
				var key = (obj.data.subreddit);
				counter[key] = (counter[key] || 0) + 1
				comments_or_posts[key] = (comments_or_posts[key] || 0) + 1
			});
			var info = {
						"next" : next,
						"counter" : counter
			}
			if ( next == null && trigger == "comments" ) 
				_1 = filter_comments(comments_or_posts,user);
			if ( next == null && trigger == "submitted")
				_2 = filter_posts(comments_or_posts,user);
			
			resolve(info);
	  }).
	  catch(function(err) {
		reject(err);
		});
	});	
}

function filter_posts(comments,user){
	var sorted_comments = sortByCount(comments);
	_1 = sorted_comments;
	trigger_when_two++;
	if ( trigger_when_two == 2 ) {
		var inf = {
		com : _1,
		pos : _2,
		user: user
		}
	send_message(inf,user);
	}
}

function filter_comments(comments,user){
	var sorted_comments = sortByCount(comments);
	_2 = sorted_comments;
	trigger_when_two++;
	if ( trigger_when_two == 2 ) {
		var inf = {
		com : _1,
		pos : _2,
		user: user
		}
	send_message(inf,user);
	}
}

function send_message(inf,user){
	if (trigger_when_two == 2){
		trigger_when_two = 0;
		search_in_progress = 0;
		stop_flashing();
		try {
			trigger_when_two = 0
			/* Here we create a tab where we are going to display the  results */
			chrome.tabs.create({url: chrome.runtime.getURL("html/show.html")}, function(t){
				//console.log("[show.js] chrome.tabs.create",t);
			});
			/* Here we wait until the new tab is alive and sends us a message so that we can reply*/
			chrome.runtime.onConnect.addListener(function(port) {
				port.onMessage.addListener(function(msg) {
					if (msg.joke == "Knock knock")
					  port.postMessage({sorted: inf});
				  });
				});	
			}
		catch (er){ console.log(er);}
		}
}

function sortByCount (wordsMap) {
	var finalWordsArray = [];
	finalWordsArray = Object.keys(wordsMap).map(function (key) {
      return {
	   name: key,
	   total: wordsMap[key]
      };
 });
 
finalWordsArray.sort(function (a, b) {
     return b.total - a.total;
 });
return finalWordsArray;
}