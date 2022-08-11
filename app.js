const express = require("express");
const hbs = require('express-handlebars');
const bodyParser = require("body-parser");
const app = express();
const mysql = require('mysql');

const pool = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : 'Sharks2022!',
  database : 'help'
});
app.use(express.static('public'));
app.engine('hbs', hbs.engine({
	helpers: {
        isCompleted: function (status) {
            if (status == 1) {
                return true
            } else {
                return false
            }
        },
    },
    layoutsDir: __dirname + '/views/layouts',
    defaultLayout: 'main',
    extname: '.hbs'
}));
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())

app.get('/admin', (req, res) => {
    let query = "SELECT c.wx_id, c.teachername, c.department, m.isTeacher FROM wxuser m INNER JOIN teacher_requests c ON c.wx_id=m.id;";
    let items = []
    pool.query(query, (err, result) => {
        if (err) throw err;
        items = result
        console.log(items)
        res.render('index', {
            items: items
        })
    })
});
app.post('/admin', (req, res) => {
    console.log(req.body)
    res.redirect('/admin')
})
app.post('/admin/approve/:wx_id', (req, res) => {
    console.log(req.body)
    let query = "UPDATE wxuser SET isTeacher=1 WHERE id=" + req.params.wx_id
    pool.query(query, (err, result) => {
        if (err) throw err;
        console.log(result)
        res.redirect('/admin')
    })
})
app.post('/admin/deny/:wx_id', (req, res) => {
    console.log(req.body)
    let query = "UPDATE wxuser SET isTeacher=0 WHERE id=" + req.params.wx_id
    pool.query(query, (err, result) => {
        if (err) throw err;
        console.log(result)
        res.redirect('/admin')
    })
})

app.listen(8000, () => {
    console.log('Server is running at port 8000');
});