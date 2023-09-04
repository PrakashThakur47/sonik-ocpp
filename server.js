// Import required modules
const express = require('express');

// Create an instance of Express
const app = express();

// Define middleware
app.use(express.json());


// Update all clients on db module
const allClients = new Map();
// also later update changes in db

console.log('allClients => ', allClients)


const WebSocket = require('ws')

const PORT = process.env.PORT || 3000;

const wss = new WebSocket.Server({ port: 3003 });

wss.on('connection', function connection(ws,req) {
    console.log('>>connection head',req.headers);
    ws.on('message', function incoming(message) {


    //Make incoming JSON into javascript object
    var msg = JSON.parse(message)

    // Print whole message to console
    console.log("msg => ", msg)

    // Print only message type to console. For example BootNotification, Heartbeat etc...
   console.log("Message type: " + msg[2])

    // Send response depending on what the message type is
    if (msg[2] === "BootNotification") {
      //Send correct response

    } // Add all the message types

  });


});



app.post('/start-transaction', async (req, res, next) => {
    try {
        console.log('start')

        const client = allClients.get(req.body.identity);

        if (!client) {
            throw Error("Client not found");
        }

        const response = await client.call('RemoteStartTransaction', {
            connectorId: 1, // start on connector 1
            idTag: 'XXXXXXXX', // using an idTag with identity 'XXXXXXXX'
        });

        console.log('start response => ', response)

        if (response.status === 'Accepted') {
            console.log('Remote start worked!');
            res.json({ message: 'Remote start worked!' });
        } else {
            console.log('Remote start rejected.');
            res.json({ message: 'Remote start rejected!' });
        }

    } catch (err) {
        next(err);
    }
});

app.post('/stop-transaction', async (req, res, next) => {
    try {
        console.log('stop')

        const client = allClients.get(req.body.identity);

        if (!client) {
            throw Error("Client not found");
        }

        const response = await client.call('RemoteStopTransaction', {
            transactionId: 123,
            // connectorId: 1, // start on connector 1
            // idTag: 'XXXXXXXX', // using an idTag with identity 'XXXXXXXX'
        });

        console.log('stop response => ', response)

        if (response.status === 'Accepted') {
            console.log('Remote stop worked!');
            res.json({ message: 'Remote stop worked!' });
        } else {
            console.log('Remote stop rejected.');
            res.json({ message: 'Remote stop rejected!' });
        }

    } catch (err) {
        next(err);
    }
});

//Define API routes
app.get('/api', (req, res) => {
    res.json({ test: 'working' });
});


app.listen(4000, () => {
    console.log("App Server running on port 4000")
});