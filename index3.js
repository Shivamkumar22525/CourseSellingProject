import express from 'express'
import jwt from 'jsonwebtoken'
import mongoose, { mongo } from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
dotenv.config()
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
const secretKey1 = process.env.secretKey1;
const secretKey2 = process.env.secretKey2;
console.log(secretKey1,secretKey2);


const userSchema = new mongoose.Schema({
    username : String,
    password : Number,
    purchasedCourse : [{type:mongoose.Schema.Types.ObjectId, ref:'Course'}]
});

const adminSchema = new mongoose.Schema({
    username : String,
    password : String
});

const courseSchema = new mongoose.Schema({
    title: String,
    description : String,
    price : Number,
    imageLink : String,
    published : Boolean
})

const User = mongoose.model('User',userSchema);
const Admin = mongoose.model('Admin',adminSchema);
const Course = mongoose.model('Course',courseSchema);

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



mongoose.connect('mongodb://localhost:27017/course')
  .then(() => console.log("Database connected"))
  .catch((error) => console.error("Database connection error:", error));;






app.post('/admin/signup',async (req,res)=>{
    const {username,password} =req.body;
    const admin = await Admin.findOne({username});
    if(admin){
        res.status(403).json({message : `Admin already exist`});
    }else{
        const obj = {username : username, password : password};
        const newAdmin = new Admin(obj);
        await newAdmin.save();
        const AdminToken = jwt.sign({username, role: 'admin'},secretKey1,{expiresIn:'1h'});
        res.json({message : `Admin created successfully`,token : AdminToken});
    }
});

app.post('/admin/login', async (req, res) => {
    const { username, password } = req.body;  // Extract from req.headers
     
    const admin = await Admin.findOne({ username, password });
    if (admin) {
      const AdminToken = jwt.sign({ username, role: 'admin' }, secretKey1, { expiresIn: '1h' });
      res.json({ message: 'Admin logged in successfully', token: AdminToken });
    } else {
      res.status(403).json({ message: 'Invalid username or password' });
    }
  });

  app.get('/admin/me',AuthJWTAdmin,(req,res)=>{
    res.json({
        username: req.user.username
    })
  })
  

app.post('/admin/course',AuthJWTAdmin,async(req,res)=>{
    const course = Course(req.body);
    await course.save();
    res.json({message : `Course created successfully`,courseId:course.id});
});

app.put('/admin/course/:courseId',AuthJWTAdmin,async(req,res)=>{
    const course = await Course.findByIdAndUpdate(req.params.courseId, req.body);
    if(course){
        res.json({message : `Course updated successfully`});
    }else{
        res.status(404).json({message:`Course not found`});
    }
});

app.get('/admin/courses',AuthJWTAdmin,async(req,res)=>{
    const course = await Course.find({});
    res.json({course});
});

app.post('/user/signup',async(req,res)=>{
    const {username,password} =req.body;
    const user = await User.findOne({username});
    if(user){
        res.status(403).json({message : `User already exist`});
    }else{
        const obj = {username : username, password : password};
        const newUser = new User(obj);
        await newUser.save();
        const UserToken = jwt.sign({username, role: 'user'},secretKey2,{expiresIn:'1h'});
        res.json({message : `User created successfully`,token : UserToken});
    }
});

app.post('/user/login',async(req,res)=>{
    const {username,password} = req.headers;
    const user = await User.findOne({username,password});
    if(user){
        const UserToken = jwt.sign({username,role:'user'},secretKey2,{expiresIn:'1h'});
        res.json({message : `User logged in successfully`,token : UserToken});
    }else{
        res.status(403).json({message : `Invalid username or password`});
    }
});

app.get('/user/courses',AuthJWTUser,async(req,res)=>{
    const course = await Course.find({published:true});
    res.json({course});
});

app.post('/user/courses/:courseId',AuthJWTUser,async(req,res)=>{
    const course = await Course.findById(req.params.courseId);
    if(course){
        const user = await User.findOne({username:req.user.username});
        if(user){
            user.purchasedCourse.push(course);
            await user.save();
            res.json({message : `Course purchased successfully`});
        }else{
            res.status(403).json({message : `User not found`});
        }
    }else{
        res.status(403).json({message : `Course not found`});
    }
});

app.get('/user/purchasedCourse',AuthJWTUser,async (req,res)=>{
    const user = await User.findOne({username : req.user.username}).populate('purchasedCourse');
    if(user){
        res.json({purchasedCourse : user.purchasedCourse || []});
    }else{
        res.status(403).json({message : `User not found`});
    }
});

app.listen(port,()=>{
    console.log(`listening on port ${port}`);
})
