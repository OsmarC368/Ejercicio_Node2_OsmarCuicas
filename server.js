const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')
const port = 3000;
const fs = require('fs');
const studentJsonPath = path.join(__dirname, "./files/students.json");
let studentList = [];

const app = express();
app.listen(port, (_) => {console.log("Server Listening on http://localhost:" + port)});

app.set('view engine', 'hbs');
app.set('views', __dirname + "/views");
app.use(express.static(__dirname + "/static"));
app.use(express.json());
app.use(getStudents)
app.use(bodyParser.urlencoded({
    extended: true
}))


function getStudents(req, res, next) {
    if(fs.existsSync(studentJsonPath))
    {
        studentList = JSON.parse(fs.readFileSync(studentJsonPath)).data;
        next()
    }
    else
        next();
}

app.get("/", (req, res) => {
    res.redirect('/students')
})

app.get("/students", (req, res) => {
    res.status(200).render('index', {titlePage: "Y Perry?", studentList: studentList});
})

app.post('/students', (req, res) => {
    let {nameE, age, course} = req.body
    let student = {id: studentList.length, nameE: nameE, age: age, course: course}
    studentList.push(student)
    fs.writeFileSync(studentJsonPath, JSON.stringify({data: studentList}))
    res.redirect('/students')
})

app.get('/students/:id', (req, res) => {
    let student = studentList.find(x => x.id == req.params.id)
    if(student)
        res.render('studentDetails', {student: student})
    else
        res.send("ID NOT FOUND!!!!")
})

app.post('/students/:id', (req, res) => {
    studentList = studentList.map(x => {
        if(x.id == req.params.id)
            return {...x, nameE: req.body.nameE, age: req.body.age, course: req.body.course};
        else
            return x;
    })
    fs.writeFileSync(studentJsonPath, JSON.stringify({data: studentList}))
    res.redirect('/students')
})