var AuctionListener = require("./listener.js");

AuctionListener.listenAuction(6310, function(data){console.log(data.user + " - " + data.time)});