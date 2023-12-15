const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require('./firebaser_private_key.json');
require("dotenv").config();

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const auth = admin.auth(); // auth

const app = express();
const port = 3002;

app.get('/get_users', (req, res) => {
    auth
        .listUsers(1000)
        .then((listUsersResult) => {
            const users = listUsersResult.users.map((userRecord) =>
                userRecord.toJSON());
            res.json(users);
        })
        .catch((error) => {
            res.status(500).json({ error: 'Error listing users' });
        });
});

app.delete('/delete_user/:uid', (req, res) => {
    const uid = req.params.uid;

    auth
        .deleteUser(uid)
        .then(() => {
            res.status(200).json({ message: 'Delete User Successful' });
        })
        .catch((error) => {
            res.status(500).json({ error: 'Error: Delete User' });
        });
});



//! Messaging

const accountSID = "AC441435112189e02e5aa92750cbf2a28d";
const authToken = "017e27530ddb73ff3ffde08d80a7984e";

const client = require('twilio')(accountSID, authToken);

app.get('/send_sms', async (req, res) => {
    const uid = req.params.uid;
    const msgOptions = {
        from: "+16193822368",
        to: req.params.destination,
        body: req.params.content
    }
    const message = await client.messages.create(msgOptions);
    res.json(message);
});




app.listen(port, 'localhost', () => {
    console.log(`Server is running on port ${port}`);
});
