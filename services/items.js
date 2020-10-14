const { v4: uuidv4 } = require('uuid');

let items={items:[{
    "title": "asdsd",
    "desc": "hyvä",
    "location": "oulu",
    "images": "2",
    "deliveryType": "pickup",
    "category": "sd",
    "price": "100€",
    "ownerId": "456417a4-74bd-463b-8d45-a7008663fe8c",
    "id": "844d5307-85a7-44b7-b5e7-cdfb77693878",
    "date": "18:29 14.10.2020"
},
{
    "title": "asdsd",
    "desc": "hyvä",
    "location": "tryäää",
    "images": "2",
    "deliveryType": "pickup",
    "category": "oulu",
    "price": "100€",
    "ownerId": "456417a4-74bd-463b-8d45-a7008663fe8c",
    "id": "5cd1035d-1ff7-4ef1-9d1f-b8bc11c71919",
    "date": "18:29 14.10.2020"
},
{
    "title": "asdsd",
    "desc": "hyvä",
    "location": "ei",
    "images": "2",
    "deliveryType": "pickup",
    "category": "ei",
    "price": "100€",
    "ownerId": "456417a4-74bd-463b-8d45-a7008663fe8c",
    "id": "60a5dd9c-565f-495b-931d-dd3410968007",
    "date": "18:29 14.10.2020"
}]};


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
        if(newItem.deliveryType.shipping==true){
            newItem.deliveryType="shipping";
        }
        if(newItem.deliveryType.pickup==true){
            newItem.deliveryType="pickup";
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