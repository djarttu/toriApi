const { v4: uuidv4 } = require('uuid');
let users={users:[
    {
        
    }
]};




module.exports={
    addUser:(username, email, password)=>{
        users.users.push({
            id:uuidv4(),
            username,
            email,
            password

        }
        
        );
        console.log(users);
    },

    getApiKey:(userId)=>{
        const user = users.users.find(u=>u.id==userId);
        if(user===undefined)
        {
            return false
        }

        return user.validApiKey;
    },
    getUserByName:(username)=> users.users.find(u=>u.username==username),


    resetApiKey:(userId)=>{
        console.log("resetApikey func");
        const user=users.users.find(u=>u.id==userId);
        if(user===undefined)
         {
             console.log("ei löytyny resetoitavvaa");
             return false;
         }
         console.log("creating new apikey");
         user.validApiKey=uuidv4();
       
         return user.validApiKey;
    },

    getUserWithApiKey:(apiKey)=>users.users.find(u => u.validApiKey==apiKey)
    
    

}