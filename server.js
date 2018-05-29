const express = require("express");
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const sanitize = require('mongo-sanitize');
const crypto = require('crypto');

const url = process.env.DB_URL;
const MongoClient = require('mongodb').MongoClient;

app.set("port", process.env.PORT || 3001);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(function(req, res, next) {
    if (app.get('env') !== 'development') {
        if(req.headers['x-forwarded-proto'] != 'https') {
            return res.redirect('https://' + req.get('host') + req.url);
        }
    }

    next();
});

if (app.get('env') === "production") {
    app.use(express.static("client/build"));
}

app.post("/api/getdroplist", (req, res) => {
    const dropsOnHomePage = 10;

    MongoClient.connect(url, function(err, db_server) {
        if (err) throw err;

        let dbo = db_server.db("deaddrop");
        dbo.collection("messages").find({
            showPublic: true
        }).limit(dropsOnHomePage).sort({ date: -1 }).toArray((err, results) => {
            if (err) throw err;

            let parsed_results = results.map(({public_id, text, question}, i) => {
                return {
                    publicId: public_id,
                    text: text,
                    question: question
                };
            });

            db_server.close();
            if(parsed_results.length) {
                return res.send({
                    success: true,
                    drops: parsed_results
                });
            } else {
                return res.send({
                    success: false
                });
            }
        });
    });
});

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
                    question: result.question,
                    salt: result.salt
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
    const maxLengthText = 4000;
    const maxLengthQuestion = 100;

    let text = sanitize(req.body.text);
    let question = sanitize(req.body.question);
    let showPublic = sanitize(req.body.showPublic);
    let salt = sanitize(req.body.salt);

    if(text === '') {
        return res.send({
            response: "Please fill up yout text."
        });
    }

    if(text.length > maxLengthText)
        text = text.substring(0, maxLengthText);

    if(question.length > maxLengthQuestion)
        question = question.substring(0, maxLengthQuestion);

    MongoClient.connect(url, function(err, db_server) {
        if (err) throw err;

        let dbo = db_server.db("deaddrop");
        crypto.randomBytes(3, (err, buf) => {

            let public_id = buf.toString('hex');
            dbo.collection("messages").insertOne({
                public_id: public_id,
                text: text,
                question: question,
                date: new Date(),
                showPublic: showPublic,
                salt: salt
            }, (err, result) => {
                if (err) throw err;

                db_server.close();

                if(result.ops[0].showPublic) {
                    io.emit('new_message', {
                        publicId: result.ops[0].public_id,
                        text: result.ops[0].text,
                        question: result.ops[0].question
                    });
                }

                return res.send({
                    response: "Message was sucesfully saved in encrypted format!",
                    id: result.ops[0].public_id
                });
            });
        });
    });
});

server.listen(app.get("port"), () => {
    console.log('Server running...');
});