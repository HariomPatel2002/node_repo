const express = require('express');
const app =express();

const PORT = 3000;
const userRequests = {};
const ipRequests = {};
 
const WINDOW_TIME = 60*1000;

app.get('/data', (req,res)=>{
  const userId = req.headers["userid"];
  console.log("UserID:", userId);
  const ip = req.ip;

  const currentTime = Date.now();
  if(!userId){
    return res.status(400).json({message:"UserID header required"});
  }
  if(!userRequests[userId]){
    userRequests[userId] = [];
  }
  userRequests[userId] = userRequests[userId].filter((time)=> currentTime - time < WINDOW_TIME);

  if(userRequests[userId].lenth >= 5){
    return res.status(429).json({message: "User rate limit exceeded (5 per minutes"});
  }

  userRequests[userId].push(currentTime);

  if(!ipRequests[ip]){
    ipRequests[ip]= [];
  }
  ipRequests[ip] = ipRequests[ip].filter((time) => currentTime- time < WINDOW_TIME);

  if(ipRequests[ip].length >= 20){
    return res.status(429).json({message: "IP rate limit exceeded (20 per minutes"})
  }

  ipRequests[ip].push(currentTime);

  res.json({message:" success", data: "Here is my data"});
})

app.listen(PORT ,()=>{
    console.log(`Server is running on port ${PORT}`);
})
