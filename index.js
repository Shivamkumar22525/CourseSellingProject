import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
const app = express();
const port = 3000;

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const adminAuth = (req,res,next)=>{
    const{username,password} = req.headers;
    console.log(req.headers);
    console.log(ADMINS);


    const admin = ADMINS.find(a => a.username===username && a.password==password);
    console.log(admin);
    if(admin){
        next();
    }else{
        res.status(403).json({message:`Admin authentication failed`});
    }
};

const userAuth = (req,res,next)=>{
    const {username,password} = req.headers;
    const user = USERS.find(u=>u.username===username && u.password==password);
    if(user){
        next();
    }else{
        res.status(403).json({message:`User authentication failed`});
    }
}

app.post('/admin/signup',(req,res)=>{
    const admin = req.body;

    const existAdmin = ADMINS.find(a=>a.username===admin.username);
    if(existAdmin){
        res.status(403).json({message:`Admin already exist`})
    }else{
        ADMINS.push(admin);
        console.log(ADMINS);
        res.json({message:`Admin created successfully`});

    }
});

app.post('/admin/login',adminAuth,(req,res)=>{
    res.json({message:`Logged in successfully`});
});

app.post('/admin/course',adminAuth,(req,res)=>{
    const course = req.body;

    course.id = Date.now();
    COURSES.push(course);
    res.json({message:`Course created sucessfully, courseID: ${course.id}`});
});

app.put('/admin/course/:courseID',adminAuth,(req,res)=>{
    const courseID = parseInt(req.params.courseID);
    const course = COURSES.find(c=>c.id===courseID);
    if(course){
        Object.assign(course,req.body);
        res.json({message:`Course updated successfully`});
    }else{
        res.status(404).json({message:`Course not found`})
    }
});

app.get('/admin/course',adminAuth,(req,res)=>{
    res.json({courses:COURSES});
});

app.post('/user/signup',(req,res)=>{
    // const user = {...req.body, purchasedCourses:[]};
    const user = {
        username : req.body.username,
        password : req.body.password,
        purchasedCourses : []
    }
    USERS.push(user);
    res.json({message:`User created successfully`});
});

app.post('/user/login',userAuth,(req,res)=>{
    res.json({message:`Logged in successfully`});
})

app.get('/user/courses',userAuth,(req,res)=>{
    // COURSES.filter(c=>c.published);
    let filterCourses = [];
    for(let i = 0; i<COURSES.length; i++){
        if(COURSES[i].published){
            filterCourses.push(COURSES[i]);
        }
    }
    res.json({courses:filterCourses});
});

app.post('/user/courses/:courseID',userAuth,(req,res)=>{
    const courseID = parseInt(req.params.courseID);
    const course = COURSES.find(c=>c.id===courseID && c.published);
    if(course){
        req.user.purchasedCourses.push(courseID);
        res.json({message:`Course purchased successfully`});
    }else{
        res.status(404).json({message:`Course not found or not available`});
    }
});

app.get('/user/purchasedCourses',userAuth,(req,res)=>{
    // const purchasedCourses = COURSES.filter(c=>req.user.purchasedCourses.includes(c.id));
    let purchasedCoursesIDs = req.user.purchasedCourses;[1,4];
    let purchasedCourses = [];
    for(let i = 0; i<COURSES.length; i++){
        if(purchasedCoursesIDs.indexOf(COURSES[i].id)!==-1){
            purchasedCourses.push(COURSES[i]);
        }
    }
    res.json({purchasedCourses});
});

app.listen(port,()=>{
    console.log(`Server is listening on port ${port}`);
});