if(process.env.NODE_ENV!=='production'){
    require('dotenv').config();
}


const express=require('express');
const app=express();
const mongoose=require('mongoose');
const path=require('path');
const Data=require('./models/dat');
const methodOverride=require('method-override');



mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("DB CONNECTED")
})
.catch((er)=>{
    console.log(err)
})
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'/views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')))

app.get('/',async(req,res)=>{
    const data=await Data.find({});
    res.render('home',{data});
})
app.get('/home',async (req,res)=>{
    const data=await Data.find({});
    res.render('home',{data});
})
app.get('/home/enter',(req,res)=>{
    res.render('enter');
})
app.post('/home',async(req,res)=>{
    const {name,email,phone,cinh,cinm}=req.body;
    sendemail(email,cinh,cinm);
    await Data.create({name,email,phone,cinh,cinm});
    res.redirect('/home');
})
app.get('/home/:id',async(req,res)=>{
    const {id}=req.params;
    const d=await Data.findById(id);
    res.render('exit',{d});
})
app.put('/home/:id',async(req,res)=>{
    const {id}=req.params;
    const {couth,coutm}=req.body;
    const oh=couth;
    const om=coutm;
    const d=await Data.findById(id)
    sendexmail(d.email,oh,om)
    await Data.findByIdAndUpdate(id,{$set:{status:"Checked Out",couth:oh,coutm,om}});
    res.redirect('/home');
})
app.delete('/home/:id',async (req,res)=>{
    const {id}=req.params;
    await Data.findByIdAndDelete(id);
    res.redirect('/home');
})


function sendemail(email,cinh,cinm){
    const sgMail=require('@sendgrid/mail');
   const  API_KEY=process.env.API_KEY;
  sgMail.setApiKey(API_KEY);
  let m=cinm.toString();
  let h=cinh.toString();;
  if(cinm<=9){
      m='0'+cinm.toString();
  }
  if(cinh<=9){
      h='0'+cinh.toString();
  }
  const msg={
      to: email,
      from: {
          name:"Visitor's app",
          email:"snehashree0880.cse19@chitkara.edu.in",
      },
      subject:"Entery time",
      text:`Hi!! you entered the building at ${h}:${m}`
  };
  sgMail.send(msg);
}


function sendexmail(email,couth,coutm){
    const sgMail=require('@sendgrid/mail');
   const  API_KEY=process.env.API_KEY;
  sgMail.setApiKey(API_KEY);
  let m=coutm.toString();
  let h=couth.toString();
  if(coutm<=9){
      m='0'+coutm.toString();
  }
  if(couth<=9){
      h='0'+couth.toString()
  }
  const msg={
      to: email,
      from: {
        name:"Visitor's app",
        email:"snehashree0880.cse19@chitkara.edu.in",
    },
      subject:"Exit time",
      text:`Hi!! you checked out at ${h}:${m}`
  };
  sgMail.send(msg);
}

app.listen(3000,(req,res)=>{
    console.log("server running at port 3000");
})