const {
  RtmClient,
  CLIENT_EVENTS,
  RTM_EVENTS,
} = require('@slack/client');
const request = require('request-promise');

const reqOpts = {
  method: 'GET',
  url: 'https://api.coindesk.com/v1/bpi/currentprice.json',
};

const token = process.env.BOT_API_KEY;
const rtm = new RtmClient(token);

let channel;

rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) => {
	for (const c of rtmStartData.channels) {
		if (c.is_member && c.name ==='général') { channel = c.id }
	} // for
	console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}`);
}); // rtm.on(rtmStartData)

rtm.on(RTM_EVENTS.MESSAGE, (message) => {
  if (message.text.toLowerCase() === "!bitcoin") {
	  request(reqOpts).then((body) => {
			body = JSON.parse(body);
			const text = 'On ' + body.time.updated + ' ' +', the Bitcoin value is `' + body.bpi.EUR.rate + ' €` or `' + body.bpi.USD.rate + ' $`.';
			return(rtm.sendMessage(text, channel));
		}) // request.then
		.catch((err) => {
			return console.error(`request for ${ reqOpts.url } failed: ${ err }`);
		}); // request.catch
	} // if
}); // rtm.on(message)

rtm.start();