const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose')
const User = require('./models/user');
const Task = require('./models/taskground')
const ejs = require('ejs');
const ejsMate = require('ejs-mate')
const session = require('express-session')

mongoose.connect('mongodb://localhost:27017/taskApp',{useNewUrlParser:true})

.then(()=>{

    console.log('Mongo  connection open');

})
.catch(err=>{
    console.log('Oh no error !!');
    console.log(err);

})

app.engine('ejs',ejsMate)
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));
app.use(session({
    secret: 'for task app ', 
    resave: false,
    saveUninitialized: true,
  }));

app.get('/',(req,res)=>{
    res.render('taskground/register')
})
app.post('/',async (req,res)=>{
        const {username,password,email,confirmPassword} = req.body;
        if (password !== confirmPassword) {
            return res.status(400).send('Passwords do not match');
        }
        const user = new User ({username,email,password,confirmPassword})
        await user.save();
        // req.session.user_id = user._id;
        req.session.user_id = user._id;
        res.redirect('/login');
    
    
    })
app.get('/login',(req,res)=>{
    res.render('taskground/login')
})
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const foundUser = await User.findAndValidate(username, password);
    if (foundUser) {
        req.session.user_id = foundUser._id;
        res.redirect('/home');
    }
    else {
        res.redirect('login')
    }
})
// const tasks = [];

app.get('/home', async(req, res) => {
   
       const tasks = await Task.find({});
        res.render('taskground/home',{tasks});
   
});

app.post('/home', async(req, res) => {
  const { title, task, dueDate,status } = req.body;
  try {
    const newTask = new Task({ title, task, dueDate, status });
    await newTask.save();
    res.redirect('/home');
  } catch (err) {
    console.error('Error adding task:', err);
    res.status(500).send('Internal Server Error');
  }
});
app.get('/taskview', async (req, res) => {
    const tasks = await Task.find({});
    res.render('taskground/taskview', { tasks });
});



app.listen(3000,()=>{
    console.log('listening on port 3000');

})