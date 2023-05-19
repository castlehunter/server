/*********************************************************************************
 *  WEB422 – Assignment 1
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
 *  No part of this assignment has been copied manually or electronically from any other source
 *  (including web sites) or distributed to other students.
 * 
 *  Name: Qing Zhang     Student ID: 130982218     Date: 19-5-2023
 *  Cyclic Link: _______________________________________________________________
 *
 ********************************************************************************/


const express = require("express");
const app = express();
const HTTP_PORT = process.env.PORT || 8080;


app.use(express.json());


app.get('/', (req, res) => {
    res.json({ message: "API Listening" });
})

app.listen(HTTP_PORT, () => {
    console.log("running")
})