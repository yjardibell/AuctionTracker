var http = require('http');

// Global Settings
var REQUEST_INTERVAL = 1000;

// History of current
var currentTracks = {};

/**
*   Set a listener for a the auction with id @auctionID. The @onBid function will be called at every bid happend.
*/
function listenAuction(auctionID, onBid){
  if(currentTracks[auctionID] != null){
    console.log("The auction is already in track!");
    return;
  }
  currentTracks[auctionID] = {trackID: 0, time: 0, user : ''};
  currentTracks[auctionID].trackID = setInterval(function(){
    postRequest(auctionID, function(data){
      try {
      var info = JSON.parse(data).d.split('|');
      } catch (err) {
        console.log("Error: " + data);
        return;
      }
      if(info[3] != currentTracks[auctionID].user){
        currentTracks[auctionID].user = info[3];
        onBid(currentTracks[auctionID].time, currentTracks[auctionID].user);
      } else {
        currentTracks[auctionID].time = info[2];
      }
  });
  }, 500);
}

/**
*   Return an array with the auction's ids that are being listening at the moment.
*/
function getListenedAuctions(){
  var tracks = [];
  for(var auction in currentTracks)
    tracks.push(auction);
  return tracks;
}


/**
*   Remove de listener for the corresponding auction.
*/
function stopListener(auctionID){
  if(currentTracks[auctionID] == null){
    console.log("The action is not been tracked right now!");
    return;
  }
  clearInterval(currentTracks[auctionID].trackID);
  currentTracks[auctionID] = null;
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



listenAuction(6310, function(time, user){
  console.log("6310> " + user + " ofertó a los " + time + " segundos");
});

