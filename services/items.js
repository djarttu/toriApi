const { v4: uuidv4 } = require('uuid');

let items={items:[]};


function getDate(){
    let date_ob = new Date();
        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();
        let aika=hours+":"+minutes+ " "+ date+"."+month+"."+year;
        return aika;
}

module.exports={
    addItem:(object,id)=>{
        console.log("addItemFunc ", id);
        console.log(object.title);
        const newItem=object;
        newItem.ownerId=id;
        newItem.id=uuidv4();
        if(newItem.delivery.shipping==true&&newItem.delivery.pickup==true){
            newItem.delivery.shipping ="shipping, pickup";
        }
        else{
            if(newItem.delivery.shipping==true){
            newItem.delivery="shipping";
            }
        if(newItem.delivery.pickup==true){
            newItem.delivery="pickup";
        }
    }
        newItem.date=getDate();
        items.items.push(newItem);
        console.log(items);
        
    },
    getOwnItems:(userId)=>{
        const result ={items:[]};
        let array= items.items.filter(u => u.ownerId==userId);
        for(let i=0; i<array.length;i++){
            result.items.push(array[i]);
        }
        
        return result;
        }
            ,
      getAllItems:()=>{
        const result ={items:[]};  
        const sobj = JSON.parse(JSON.stringify(items.items)); 
        sobj.forEach(element => {
            delete element.ownerId;
            delete element.id;
        });
        let array= sobj;
        for(let i=0; i<array.length;i++){
            result.items.push(array[i]);
        }
        
        return result;
        
            
    },
    modifyItem:(req, ownId)=>{
    const item = items.items.find(u => u.id ==req.id);
    console.log(ownId);
    console.log(req);
    
        for (const key in req){
            if(req[key]!==undefined&&req[key]!==null&&req[key]!==''){
                console.log(req[key]);
                item[key] = req[key];
            }
                
            
        
    } 
    item.date=getDate();    
    return true;
    },
    getItemById:(itemId)=> items.items.find(i => i.id==itemId),
    deleteItem:(itemId)=>{
        const result = items.items.findIndex(t => t.id == itemId);
    if(result !== -1){
        items.items.splice(result, 1);
        return (200);
    }
    else {
        return (404);
    }
     
},
getItemByKeyword:(kw)=>{
    
        const result ={items:[]};
        const sobj =JSON.parse(JSON.stringify(items.items.filter(u => u.category==kw)));
        let array= sobj;
        for(let i=0; i<array.length;i++){
            delete array[i].ownerId;
            delete array[i].id;
            result.items.push(array[i]);
        }
        const sobj2=JSON.parse(JSON.stringify(items.items.filter(u => u.location==kw)));
        let array2=sobj2;
        for(let i=0; i<array2.length;i++){
            delete array2[i].ownerId;
            delete array2[i].id;
            result.items.push(array2[i]);
        }
        
            
        
        

       
        return result;
        }



}