var mongoose = require('mongoose');
var db;
if (process.env.VCAP_SERVICES) {
   var env = JSON.parse(process.env.VCAP_SERVICES);
   db = mongoose.createConnection(env['mongodb-2.2'][0].credentials.url);
} else {
   db = mongoose.createConnection('localhost', 'nodetest1');

}
// Document schema for bids
//console.log("here", new Date());
exports.biddleSchema = new mongoose.Schema({
	BidderName: { type: String, required: true },
	JobUrl: { type: String },
	protocol: { type: String },
	host: { type: String },
	Hostname:{ type: String },
	hash: { type: String },
	search:{ type: String },
	JobId:{ type: String },
	path:{ type: String },
	parameters:{ type: String },
	date: { type: Date, default: new Date() },
	JobPortal: { type: String },
	Status: { type: String },
	Isinvite: { type: String },
	Comments: { type: String }
});


