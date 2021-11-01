const express = require("express");
const path = require("path");
const request = require("request");
const bodyparser = require("body-parser");

const app = express();

//bodyparser Maiddleware
app.use(bodyparser.urlencoded({ extended: true }));

//static folder
app.use(express.static(path.join(__dirname, "public")));

//signup route
app.post("/signup", (req,res)=>{
    const { email, firstname, lastname} = req.body;
    // console.log(req.body);

    if( !email || !firstname || !lastname){
        res.redirect("./index.html");
        return;
    }

    //construct req data
    const data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstname,
                    LNAME: lastname
                }
            }
        ]
    }

    const postData = JSON.stringify(data);

    const option ={
        url:  'https://us5.api.mailchimp.com/3.0/lists/3b5ac2401a',
        method: 'POST',
        headers: {
            Authorization : 'auth fc2326e94bef27df0f213d5be7c0464b-us5'
        },
        body: postData
    }
    request(option, (err, response, body)=>{
        if(err){
            res.redirect('/index.html');
        }
        else{
            if(response.statusCode === 200){
                res.redirect('/seccess.html');
            }else{
                res.redirect('/index.html');
            }
        }
    })
})


const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log(`application listening to ${port}`);
});