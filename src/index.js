const {
  RtmClient,
  WebClient,
  CLIENT_EVENTS,
  RTM_EVENTS,
} = require('@slack/client');
const request = require('request-promise');

const reqOpts = {
  method: 'GET',
  url: 'https://api.coindesk.com/v1/bpi/currentprice.json',
};


const token = process.env.BOT_API_KEY;
//const token = 'xoxb-282764704598-gvoGR5lfXVraDTKszqnwidig';
const rtm = new RtmClient(token);

let channel;

const isMessage = (event) => event.type === 'message' && event.text;

const isMessageFromUser = (event, userId) => event.user === userId;

rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) => {
	for (const c of rtmStartData.channels) {
		if (c.is_member && c.name ==='général') { channel = c.id }
	}
	console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}`);
});

rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => {
 rtm.sendMessage("Beep boop ! Coming online, call me by pressing", channel);
});

rtm.on(RTM_EVENTS.MESSAGE, (message) => {
	let lMess = message.text.toLowerCase();
  if (lMess === "!bitcoin") {
	  return new Promise((resolve) => {
			request(reqOpts).then((body) => {
				body = JSON.parse(body);
				const text = 'On ' + body.time.updated + ' ' +', the Bitcoin value is ' + body.bpi.EUR.rate + ' €.';
				rtm.sendMessage(text, channel);
			}) // request.then
			.catch((err) => {
				return console.error(`request for ${ reqOpts.url } failed: ${ err }`);
			}); // request.catch
		}); // new Promise
	}
});

rtm.start();