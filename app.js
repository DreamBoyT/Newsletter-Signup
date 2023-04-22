const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

// for getting the static css and images file which is inside public folder
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;
  const data = {
    members: [{ //mailchimps uses keywords like members,email_address,FNAME,etc to store the data from my users into their website...
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: fname,
        LNAME: lname
      }
    }]
  };
  const jsonData = JSON.stringify(data);

  const url = "https://us10.api.mailchimp.com/3.0/lists/0da21f428e"; //api URL of mailchimp with list (or) audience id

  const options = {
    method: "POST",
    auth: "dreamboyT:a8366d47b42e071fd1bdb3bac8a7efce-us10" //authentication to determine the user with the apikey along with the username
  };

  const request = https.request(url, options, function(response) { //https.request is used to post the user data into mailchimp websites

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data) {
      console.log(JSON.parse(data));

    });
  });

  request.write(jsonData); //calling const request = https.request() along with passing the user data in the json format
  request.end();

});

app.post("/failure", function(req, res) {
  res.redirect("/"); // redirect to the homepage
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000");
});

// apikey: a8366d47b42e071fd1bdb3bac8a7efce-us10
// list or audience id: 0da21f428e.
