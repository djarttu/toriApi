const express = require('express')
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
//const { v4: uuidv4 } = require('uuid');
const app = express()
var port = process.env.PORT ||8080;
const cookieParser =require('cookie-parser')
require ('dotenv').config()
app.use(bodyParser.json());
const users = require('./services/users')
app.use(cookieParser());
app.use(express.static('public'));app.get('/', (req, res) => {
    res.sendFile('index.html', {root: __dirname + '/public/'});
});
const items = require('./services/items');
const passport=require('passport');
const { getItemById } = require('./services/items');
//const { getApiKey } = require('./services/users');
const BasicStrategy = require('passport-http').BasicStrategy;


passport.use(new BasicStrategy(
    function(username, password, done){
        const user=users.getUserByName(username);
        
        if (user==undefined){
            console.log("user not found");
            return done(null, false, {message: "Username not found"})
        }
        if(bcrypt.compareSync(password, user.password)==false){
            console.log("wrong pw");
            return done(null, false, {message:"pw not found"});
        }
        console.log("autentikaatio onnistui")
        return done(null, user,{message:"authentication ok"});
    }

    
));

app.get('/login', 
        passport.authenticate('basic', {session:false}),
        (req, res)=>{
            console.log(req.user.id)
            console.log("login func")
            let apiKey=users.resetApiKey(req.user.id);

            console.log(apiKey);

            
            res.json(apiKey);
        })

function checkForApiKey(req, res, next){
    const receivedKey=req.get('X-Api-Key');
    if (receivedKey===undefined){
        return res.status(400).json({message:"ApiKey missing"});
    }
    const user =users.getUserWithApiKey(receivedKey);
    if(user===undefined){
        return res.status(400).json({message:"Wrong ApiKey"});
    }
    req.user=user;
    next();    

}

app.get('/items', (req, res)=>{
    let result = items.getAllItems();
    
    res.json(result);
})


app.post('/addItem', checkForApiKey,(req, res)=>{
    //console.log(req.body);
    //if(ifEmpty(req.body!==false)){
        
        
    
    if('title' in req.body==false){
        res.status(400);
        return;
    }
    if('desc' in req.body==false){
        res.status(400);
        return;
    }
    if('location' in req.body==false){
        res.status(400);
        return;
    }
    if('images' in req.body==false){
        res.status(400);
        return;
    }
    if('price' in req.body==false){
        res.status(400);
        return;
    }
    if('deliveryType' in req.body==false){
        res.status(400);
        return;
    }
    if('category' in req.body==false){
        res.status(400);
        return;
    }
    items.addItem(req.body, req.user.id);
    res.json({message:"apikey toimii"});
})



app.post('/registerUser',(req, res)=>{
   if('username' in req.body==false){
       res.status(400);
       return;
   }
   if('email' in req.body==false){
    res.status(400);
    return;
   }
   if('password' in req.body==false){
    res.status(400);
    return;
   }
   const hashedPassword = bcrypt.hashSync(req.body.password, 6);
   console.log(hashedPassword);
   users.addUser(req.body.username, req.body.email, hashedPassword);
   res.status(201).json({status:"user created"})
})

app.delete('/delItems', checkForApiKey, async (req, res)=>{
    const item = items.getItemById(req.body.id);
    if(item==undefined)
    {
        res.status(400).json({status:"wrong itemID"});
        return;
    }
    if(item.ownerId!==req.user.id)
    {
        res.status(400).json({status:"wrong user"});
        return;
    }


    items.deleteItem(req.body.id);
    res.status(200).json({status:"item deleted"})
    
    
     
})

app.put('/modifyItems', checkForApiKey, (req, res)=>{
    
    const item = items.getItemById(req.body.id);
    if(item==undefined)
    {
        res.status(400).json({status:"wrong itemID"});
        return;
    }
    if(item.ownerId!==req.user.id)
    {
        res.status(400).json({status:"wrong user"});
        return;
    }
    items.modifyItem(req.body, req.user.id)
    res.status(200).json({status:"modification ok"});
})

app.get('/ownItems', checkForApiKey, (req, res) => {

    console.log(req.user.id, "asking own items with userID")
    res.json(items.getOwnItems(req.user.id));
})




 





function ifEmpty(Object){
    for(key in Object){
        console.log(Object[key]+" testi");
        if(Object[key]==""||Object[key]==null){
            console.log("tyhjä");
            return false;
            
        }
        else 
            console.log("täys")   
        
        }
      return true;  
}
    



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})