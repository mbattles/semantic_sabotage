var Player = function(app) {
	
	var setTimeoutEvents = [];
	var messages = [];
	var parser = Parser(messages);
	var curMessage = 0;
	
	return {
		initialize: function(url) {
			// parser gets created, loads LIWC stuff, then calls createMessages
			parser.initialize(this.createMessages, url);
		},
	
		createMessages: function(url) {
			console.log("load msgs");
			//"http://www.youtube.com/watch?v=rDiGYuQicpA"
			
			$.get(url, function(data) {
			  //$('#results').html(data);
			  //console.log(data);
			  var startInd = data.indexOf("ttsurl") + 10;
			  var endInd = data.indexOf('"', startInd);
			  var url = data.substring(startInd, endInd);
			  url = url.replace(/\\u0026/g, "&").replace(/\\\//g, "/") + "&type=track&lang=en&name&kind=asr&fmt=1";
			  
			  console.log("url = "+url);
			  
			  $.get(url, function(ccStr) {
					var lines=ccStr.getElementsByTagName("text");
					
					for (var i=0; i<lines.length; i++) {
						parser.parseLine(lines[i]);
					}
					
					// once all messages created, start!
					app.start();
					
			  }, 'xml');
			});			
		},
		
		printMessages: function() {
			for (var i=0; i<messages.length; i++) {
				console.log(i+" "+messages[i]);
			}
		},
		
		sendMessage: function(msg) {
			console.log("send msg");
		},
		
		
		playbackMessages: function() {
    	
			console.log("playback messages ");
				var startMsg = messages[curMessage];

			function runMessage(i) {

				console.log("runmsg "+i);
			curMessage = i+1;

			var msg = messages[i];
				app.handleMessage(msg);

			var lastMsg = (i == 0) ? startMsg : messages[i-1];

			//console.log("last msg "+lastMsg+" msg "+msg);
					diff = Math.max(0, msg.time - lastMsg.time);
					
				//console.log("diff "+diff);
			//if (app.modifier) {
			//  diff = diff / app.modifier;
			//}

					setTimeoutEvents.push(setTimeout(function() {
						// trigger app.trigger("message:" + msg['type'], { msg: msg['attributes'] });

			  if (messages.length > i+1) {
			    runMessage(i+1);
			  } else console.log("end of msgs");
			}, diff, this));
					//console.log("settimeout "+msg.word+" "+diff);
					
		}

		runMessage(curMessage);
	},
    
    pausePlaybackMessages: function() {
    	console.log("pause playback");
	    for (var i=0; i<setTimeoutEvents.length; i++) {
		    clearTimeout(setTimeoutEvents[i]);
	    }
    }
	};

};