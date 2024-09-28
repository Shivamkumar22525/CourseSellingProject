import express from 'express'
import jwt from 'jsonwebtoken'
import cors from 'cors'
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const secretKey1 = "operation";
const secretKey2 = "successfull";

const generateJWTAdmin = (user)=>{
    const payLoad = {username : user.username};
    return jwt.sign(payLoad,secretKey1,{expiresIn : '1h'});
};

const AuthJWTAdmin = (req,res,next)=>{
    const authHeader = req.headers.authorization;

    if(authHeader){
        const Admintoken = authHeader.split(' ')[1];

        jwt.verify(Admintoken,secretKey1,(err,user)=>{
            if(err){
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    }else{
        res.sendStatus(401);
    }
};

const generateJWTUser = (user)=>{
    const payLoad = {username: user.username};
    return jwt.sign(payLoad,secretKey2,{expiresIn : '1h'});
};
const AuthJWTUser = (req,res,next)=>{
    const authHeader = req.headers.authorization;

    if(authHeader){
        const Usertoken = authHeader.split(' ')[1];

        jwt.verify(Usertoken,secretKey2,(err,user)=>{
            if(err){
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        })
    }else{
        res.sendStatus(401);
    }
};

app.post('/admin/signup',(req,res)=>{
    const admin = req.body;
    const existAdmin =  ADMINS.find(a=>a.username===admin.username);
    if(existAdmin){
        res.status(403).json({message : `Admin already exist`});
    }else{
        ADMINS.push(admin);
        const Admintoken = generateJWTAdmin(admin);
        res.json({message : `Admin created successfully`, token:Admintoken})
    }
});

app.post('/admin/login',(req,res)=>{
    const {username,password} = req.headers;
    console.log(req.headers);
    const admin = ADMINS.find(a=>a.username===username && a.password==password);

    if(admin){
        const Admintoken = generateJWTAdmin(admin);
        res.json({message : `Admin logged in successfully`, token:Admintoken})
    }else{
        res.status(403).json({message: `Admin authentication failed`});
    }
});

app.post('/admin/course',AuthJWTAdmin,(req,res)=>{
    const course = req.body;
    course.id = COURSES.length+1;
    COURSES.push(course);
    res.json({message : `Course created successfully`,courseID : course.id })
});

app.put('/admin/course/:courseID',AuthJWTAdmin,(req,res)=>{
    const courseID = parseInt(req.params.courseID);

    const courseIdx = COURSES.findIndex(c=>c.id===courseID);

    if(courseIdx>-1){
        const updatedCourse = {...COURSES[courseIdx], ...req.body};
        COURSES[courseIdx] = updatedCourse;
        res.json({message : `Course updated successfully`});
    }else{
        res.status(404).json({message : `Course not found`});
    }
});

app.get('/admin/courses',AuthJWTAdmin,(req,res)=>{
    res.json({courses : COURSES});
});

app.post('/user/signup',(req,res)=>{
    const user = req.body;
    const exitsUser = USERS.find(u=>u.username===username);
    if(exitsUser){
        res.status(403).json({message : `User already exists`});
    }else{
        USERS.push(user);
        const Usertoken = generateJWTUser(user);
        res.json({message : `User created successfully`,token : Usertoken})
    }
});

app.post('/user/login',(req,res)=>{
    const {username,password} = req.headers;
    const user = USERS.find(u=>u.username===username && u.password==password);
    if(user){
        const Usertoken = generateJWTUser(user);
        res.json({message : `User logged in successfully`,token : Usertoken});
    }else{
        res.status(403).json({message : `User authentication failed`});
    }
});

// app.get('/user/courses',AuthJWTUser,(req,res)=>{
//     res.json({courses:COURSES});
// });

app.post('/user/course/:courseID',AuthJWTUser,(req,res)=>{
    const courseID = parseInt(req.params.courseID);
    const course = COURSES.find(c=>c.id===courseID && c.published);
    if(course){
        const user = USERS.find(u=>u.username===req.user.username);
        if(user){
            if(!user.purchasedCourse){
                user.purchasedCourse = [];
            }
            user.purchasedCourse.push(course);
            res.json({message : `Course purchased successfully`});
        }else{
            res.status(403).json({message: `User not found`});
        }
    }else{
        res.status(404).json({message : `Course not found`});
    }
});

app.get('/user/purchasedCourse',AuthJWTUser,(req,res)=>{
    const user = USERS.find(u=>u.username===req.user.username);
    if(user && user.purchasedCourse){
        res.json({purchasedCourses : user.purchasedCourse});
    }else[
        res.status(404).json({message : `No course purchased`})
    ]
});

app.listen(port,()=>{
    console.log(`listening on port ${port}`);
});