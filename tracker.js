var http = require('http');

// Global Settings
var REQUEST_INTERVAL = 1000;

// History of current
var currentTracks = {};
var SCN = 0;

/**
*   Set a listener for a the auction with id @auctionID. The @onBid function will be called at every bid happend.
*/
function listenAuction(auctionID, onBid){
  if(currentTracks[auctionID] == null){
    currentTracks[auctionID] = {listeners: [], tracker: null, lastMove: {time: 0, user : ''}};
    currentTracks[auctionID].tracker = setInterval(listener(auctionID), 500);
  }
  currentTracks[auctionID].listeners.push({id: ++SCN, callback: onBid});
  return SCN;
}

/**
*   Return an array with the auction's ids that are being listening at the moment.
*/
function getListenedAuctions(){
  var auctions = [];
  for(var each in currentTracks)
    auctions.push(each);
  return auctions;
}


/**
*   Remove de listener for the corresponding auction.
*/
function stopListener(scn){
  if(scn <= 0 || scn > SCN || scn == null){
    console.log("Invalid listener identifier");
    return;
  }

  // Remove de callback
  var auctionID = 0;
  var index = 0;
  for(var auction in currentTracks){
    index = 0;
    auctionID = auction;
    for(var index in currentTracks[auction].listeners){
      var listener = currentTracks[auction].listeners[index];
       if(listener.id == scn){
         currentTracks[auction].listeners.splice(index,1);
         break;
       }
       index++;
    }
  }
    // Remove the listener
  if(currentTracks[auctionID].listeners.length == 0){
      clearInterval(currentTracks[auctionID].tracker);
      currentTracks[auctionID] = null;
  }
}

function listener(auctionID){
  return function(){
      postRequest(auctionID, function(data){
        try {
        var info = JSON.parse(data).d.split('|');
        } catch (err) {
          console.log("Error: " + data);
          return;
        }
        if(info[3] != currentTracks[auctionID].lastMove.user){
          currentTracks[auctionID].lastMove.user = info[3];
          for(var index in currentTracks[auctionID].listeners){
            currentTracks[auctionID].listeners[index].callback(currentTracks[auctionID].lastMove);
          }
        } else {
          currentTracks[auctionID].lastMove.time = info[2];
        }
      });
    }
}


function postRequest(auctionID, resp) {
  // Build the post string from an object
  var post_data = '{"AuctionList":"'+ auctionID +'"}';

  var post_options = {
      host: 'www.subastaslocas.com.ar',
      port: '80',
      path: '/DesktopModules/D4CMS/Auctions/AuctionsWebService.asmx/GetLiveAuctions',
      method: 'POST',
      headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Length': post_data.length ,
          'Pragma': 'no-cache' ,
          'Cache-Control': 'no-cache'
      }
  };

  // Set up the request
  var post_req = http.request(post_options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
          resp(chunk);
      });
  });

  // post the data
  post_req.write(post_data);
  post_req.end();
}

var counter = 1;

var l1 = listenAuction(6310, function(bid){
  console.log("1> " + bid.user + " ofertó a los " + bid.time + " segundos");
  if(++counter == 4)
    stopListener(l1);
});

var l2 = listenAuction(6310, function(bid){
  console.log("2> " + bid.user + " ofertó a los " + bid.time + " segundos");
  if(counter == 3)
    stopListener(l2);
});

var l3 = listenAuction(6310, function(bid){
  console.log("3> " + bid.user + " ofertó a los " + bid.time + " segundos");
  if(counter == 2)
    stopListener(l3);
});
