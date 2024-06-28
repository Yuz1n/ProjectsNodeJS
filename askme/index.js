const express = require("express");
const path = require("path");
const app = express();
const { Op } = require('sequelize');
const bodyParser = require("body-parser");
const connection = require('./database/database');
const askmodel = require('./database/model_askme');
const answermodel = require('./database/model_answer');

//MYSQL CONNECTION
connection.authenticate().then(() =>{
    console.log("Connection Database Success!")
}).catch(() =>{
    console.log("Connection Database Error!")
})

//EJS
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname, 'public')));

//BODY PARSER
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

//Routes
app.get("/",(req,res)=>{
    askmodel.findAll({raw: true, order:[
        ['id','DESC']
    ]}).then(ask =>{
        console.log(ask)
        res.render("index",{
            asks: ask
        })
    });
});

app.get("/ask",(req,res)=>{
    res.render("ask")
});

app.post("/saveask", (req, res) => {
    let title = req.body.title;
    let quest = req.body.question;
    let category = req.body.category;
    askmodel.create({
        title: title,
        description: quest,
        category: category
    }).then(() => {
        console.log("Ask Sent!");
        res.redirect("/");
    }).catch(err => {
        console.error(err);
        res.redirect("/ask");
    });
});

app.get("/ask/:id", (req, res) => {
    let id = req.params.id;
    askmodel.findOne({
        where: { id: id }
    }).then(ask => {
        if (ask != undefined) {
            answermodel.findAll({
                where: { askid: ask.id },
                order: [
                    ['votes', 'DESC'],
                    ['createdAt', 'DESC'] 
                ]
            }).then(answer => {
                res.render("asking", {
                    ask: ask,
                    answer: answer
                });
            });
        } else {
            res.redirect("/")
        }
    });
});

app.post("/answer",(req,res)=>{
    let body = req.body.body;
    let askid = req.body.answer;
    answermodel.create({
        body: body,
        askid: askid
    }).then(() =>{
        console.log("Answer Sent!");
        res.redirect("/ask/"+askid);
    })
});

app.get("/search", (req, res) => {
    let query = req.query.query;
    askmodel.findAll({
        where: {
            title: {
                [Op.like]: '%' + query + '%'
            }
        },
        raw: true,
        order: [
            ['id', 'DESC']
        ]
    }).then(asks => {
        res.render("index", {
            asks: asks
        });
    });
});

app.post('/vote/:answerId/:type', (req, res) => {
    const answerId = req.params.answerId;
    const type = req.params.type;

    answermodel.findByPk(answerId).then(answer => {
        if (answer) {
            if (type === 'up') {
                answer.votes += 1;
            } else if (type === 'down') {
                answer.votes -= 1;
            }

            answer.save().then(() => {
                res.json({ success: true });
            }).catch(err => {
                res.json({ success: false });
            });
        } else {
            res.json({ success: false });
        }
    }).catch(err => {
        res.json({ success: false });
    });
});

app.listen(8080,()=>{
    console.log("Server Started!")
});