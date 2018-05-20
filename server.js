const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const sanitize = require('mongo-sanitize');
const crypto = require('crypto');

const db_config = require('./db-config');
const url = db_config(app.get('env'));
const MongoClient = require('mongodb').MongoClient;

app.set("port", process.env.PORT || 3001);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

if (app.get('env') === "production") {
    app.use(express.static("client/build"));
}

app.post("/api/getmessage", (req, res) => {
    let public_id = sanitize(req.body.id);

    MongoClient.connect(url, function(err, db_server) {
        if (err) throw err;

        let dbo = db_server.db("deaddrop");
        dbo.collection("messages").findOne({
            public_id: public_id
        }, (err, result) => {
            if (err) throw err;

            db_server.close();
            if(result) {
                return res.send({
                    success: true,
                    text: result.text,
                    question: result.question
                });
            } else {
                return res.send({
                    success: false
                });
            }
        });
    });
});

app.post("/api/setmessage", (req, res) => {
    let text = sanitize(req.body.text);
    let question = sanitize(req.body.question);

    if(text === '') {
        return res.send({
            response: "Please fill up yout text."
        });
    }

    MongoClient.connect(url, function(err, db_server) {
        if (err) throw err;

        let dbo = db_server.db("deaddrop");
        crypto.randomBytes(3, (err, buf) => {

            let public_id = buf.toString('hex');
            dbo.collection("messages").insertOne({
                public_id: public_id,
                text: text,
                question: question,
                date: new Date()
            }, (err, result) => {
                if (err) throw err;

                db_server.close();
                return res.send({
                    response: "Message was sucesfully saved in encrypted format!",
                    id: result.ops[0].public_id
                });
            });
        });
    });
});

app.listen(app.get("port"), () => {
    console.log('Server running...');
});