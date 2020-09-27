const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
  res.sendFile(__dirname+"/signup.html");
})

app.post("/", function(req, res) {
  const email = req.body.email;
  const fname = req.body.fname;
  const lname = req.body.lname;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fname,
          LNAME: lname,
        }
      }
    ]
  };
  const jsonData = JSON.stringify(data);

  const url = "https://us2.api.mailchimp.com/3.0/lists/3e0d94d24f"
  const options = {
    method: "POST",
    auth: "roy_a2yush:7e998fea468b70a6014d8fdf86aa6f57-us2"
  }

  const reqSent = https.request(url, options, function(response) {
    if(response.statusCode === 200) {
      res.sendFile(__dirname+"/success.html");
    } else {
      res.sendFile(__dirname+"/failure.html")
    }
    response.on("data", function(data) {
      console.log(JSON.parse(data));
    })
  });

  reqSent.write(jsonData);

  reqSent.end();

})

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started in port 3000");
});

//7e998fea468b70a6014d8fdf86aa6f57-us2
//3e0d94d24f
