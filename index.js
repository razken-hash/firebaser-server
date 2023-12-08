const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require('./firebaser_private_key.json');

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

app.listen(port, 'localhost', () => {
    console.log(`Server is running on port ${port}`);
});

export default app;