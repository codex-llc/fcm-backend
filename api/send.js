import express from "express";
import bodyParser from "body-parser";
import admin from "firebase-admin";

const app = express();
app.use(bodyParser.json());

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

export default app.post("/send", async (req, res) => {
    try {
        const { token, title, body } = req.body;
        if (!token || !title || !body) return res.status(400).send("Missing parameters");

        const message = { token, notification: { title, body } };
        const response = await admin.messaging().send(message);
        console.log("Sent message:", response);
        res.status(200).send("Notification sent!");
    } catch (err) {
        console.error(err);
        res.status(500).send(err.toString());
    }
});