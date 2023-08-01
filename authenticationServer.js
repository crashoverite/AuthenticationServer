

const express = require("express")
const app = express()
require("dotenv").config()
const axois = require("axios")
const { auth, requiresAuth } = require('express-openid-connect');


app.use("/images",express.static(__dirname + "/images"))

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: "process.env.SECRET",
  baseURL: 'http://localhost:5000',
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: 'https://dev-mdivrtu5p55rd76v.us.auth0.com',
  clientSecret: process.env.CLIENT_SECRET,
  authorizationParams:{
    response_type: 'code',
    audience: 'http://localhost:3000',
    scope: 'openid profile email'
  },
  authRequired: false

};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));


app.get("/secured", requiresAuth(), async (req,res)=>{
  
  try{

  const {token_type , access_token} = req.oidc.accessToken
  const apiResponse = await axois.get("http://localhost:3000/private",{
    headers:{
      authorization: `${token_type} ${access_token}`
    }
  })
  const data = apiResponse.data
  console.log(`Albani ${data}`);
   return res.send(data)

}catch(error){
  console.log(`Albani ${error}`);
  return res.send(`Error occured: ${error}`)
}

})


app.listen(5000,()=>{
  console.log("server running on port 5000");
})