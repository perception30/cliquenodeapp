import express from 'express';
import config from './config';

const app = express();

// twilio api
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const urlencoded = require('body-parser').urlencoded;

// Parse incoming post params with express middleware
app.use(urlencoded({extended: false}));


app.use(express.static(__dirname + '/../../public'));
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    res.render('index', {tech: 'React'});
});

// Create a route that will handle Twilio webhook requests, sent as an
// HTTP POST to /voice in our application
app.post('/voice', (request, response) => {
    // Use the Twilio Node.js SDK to build an XML response
    const twiml = new VoiceResponse();

    // Use the <Gather> verb to collect user input
    const gather = twiml.gather({numDigits: 1});
    gather.say('For sales, press 1. For support, press 2.');

    // If the user doesn't enter input, loop
    twiml.redirect('/voice');

    // Render the response as XML in reply to the webhook request
    response.type('text/xml');
    response.send(twiml.toString());
});

app.listen(config.port, () => {
    console.info(`Twilio Client app HTTP server running on ${config.port}`);
});