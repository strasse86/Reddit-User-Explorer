# Reddit User Explorer

Explore the past posts and comments of Reddit users via the Chrome Extension.

## Link 

https://chrome.google.com/webstore/detail/reddit-user-explorer/gophgjgjlollkjofchhmjhekpmdiaeob


## How to use:


After Installation, Control & Left-Click on any Reddit username. 

Once the past posts and comments are fetched, they will be displayed in a new Chrome Tab.

## Screenshots:
![Alt text](/preview.png?raw=true "Results for Specific User")

## Limitations:

Reddit API recommends that a request should be done once every second. We respect this limit therefore users with 
multiple posts/comments are fetched in batches of 100 which is the maximum that can be fetched per request.

Additionally, Reddit API returns at most the last 1000 posts and 1000 comments per user.

## Donate 

If you like this Extension and you would like more features, feel free to send your suggestions.

######  XLM Donations: GA7TG5Z7NI2646AQPEEX5EJQXXPKVUFJDK2Q7DDNFAYP6Y2LWS7DHWFM
######  BTC Donations: 12PDrPtoEvWHTxJDZT1CZq1pozrzevR5cq


## Code breakdown

The extension is broken into several files, let's see the most important of them

1. Manifest 

The manifest is the only file a chrome extension must have and it should be named **manifest.json**

Here is the current manifest.json 

```
  {
    "name": "Reddit User Explorer",
    "version": "0.2", 
    "description": "Find Posts and Comments distrubution of Reddit Users",
	"options_ui": {
		"page"        : "html/options.html",
		"open_in_tab" : false },
	"content_scripts": [
    {
	  "matches": ["https://*.reddit.com/*"],
      "all_frames": false,
      "js": ["js/jquery.js","js/content.js"]
    }
  ],"background": {
      "scripts": ["js/background.js"],
      "persistent": false
    },
	"permissions" :   ["declarativeContent"],
	"page_action" :
	{
		"default_icon": 
	{                   
            "16" : "images/icon16.png",
			"24" : "images/icon24.png",
			"32" : "images/icon32.png",
			"48" : "images/icon48.png",
			"128": "icon_128.png"
    },
		 "default_title": "Reddit User Explorer"
	}, 
    "manifest_version": 2
  }

```



