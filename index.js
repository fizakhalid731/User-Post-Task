const express = require ('express');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;

app.use(express.json());

const secretKey = 'mykey';

const users = [
    {
        user_id: 1, 
        username: "Fiza",  
        password:"123" , 
        role: "admin",
        email: "Fiza@gmail.com",
        },
    {
        user_id: 2, 
        username: "user1", 
        password:"456",  
        email: "user1@gmail.com",
        role: "user",
        },
    {
        user_id: 3, 
        username: "user2", 
        password:"789", 
        email: "user2@gmail.com", 
        role: "user",
       },
    {
        user_id: 4, 
        username: "user3", 
        password:"1011", 
        email: "user3@gmail.com",
        role: "user",
       },
    {
        user_id: 5, 
        username: "user4", 
        password:"1213", 
        email: "user4@gmail.com",
        role: "user",
        },
    {
        user_id: 6, 
        username: "user5", 
        password:"1415", 
        email: "user5@gmail.com",
        role: "user",
        },
]

//GET all login user data

app.get('/users',function(req, res){
   return res.status(200).json(users);
})

// POST login userdata
app.post('/login',(req, res)=>{
    const {username , password} = req.body; 

    const loginuser = users.find(loginuser => loginuser.username === username && loginuser.password === password);
    
    if(loginuser){
        const token = jwt.sign({username: loginuser.username, role: loginuser.role}, secretKey,{expiresIn:'1h'});
      return  res.status(200).json({message: `User login Successfully. Welcome,${username}`,
        token
    });
    }
    else{
      return  res.status(401).send('Invalid username and password.');
    }
})

app.get('/isLoggedIn',authenticate,(req,res)=>{
    let user = req.user;
  return res.status(200).json({
    message:"Welcome",
    user
  })
  })
function authenticate(req,res,next){
    let token = req.headers.token;
    if(!token){
      return res.status(401).json({
        message:"Not logged In."
      })
    }
    jwt.verify(token, secretKey, function(err, decoded){
        if(err){
            return res.status(403).json({
                message: "Invalid token!"
            });
        }
        req.user = decoded;
        next();
    });
  
  }

app.get('/admin',authenticate,(req, res)=>{
   
    if(req.user.role !== 'admin'){
        return res.status(403).json({
            message: "Admin access required."
        })
    }
    else{
        res.json({message: "welcome Admin"})
    }
})


app.listen(port,()=>{
    console.log(`server run on http://localhost:${port}`);
})