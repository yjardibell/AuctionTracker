var AuctionListener = require("./listener.js");
var AuctionLogger = require("./logger.js");

var logger = new AuctionLogger(AuctionListener);
logger.start(6310);