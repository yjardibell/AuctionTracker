var AuctionLogger = (function(){

	function AuctionLogger(AuctionListener){
		this.listener = AuctionListener;
		this.logs = {};
	}

	AuctionLogger.prototype.start = function(auctionID){
		var scn = this.listener.listenAuction(auctionID, onBid(this, auctionID));
		this.logs[auctionID] = {scn:scn, log:[]};
	};

	AuctionLogger.prototype.stop = function(auctionID){
		this.listener.stopListener(this.logs[auctionID].scn);
	};

	AuctionLogger.prototype.getLog = function(auctionID){
		return this.logs[auctionID].log;
	};

	function onBid(self, auctionID){
		return function(bid){
			self.logs[auctionID].log.push({user:bid.user, time:bid.time}); // TODO: Clone the object properly
			console.log(self.logs[auctionID].log);
		};
	}

	return AuctionLogger;
})();

module.exports = AuctionLogger;