const express = require("express");
const request = require("request");
const https = require("https");
const { response } = require("express");

const app = express();

app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  var jsonData = JSON.stringify(data);

  const url = "https://us5.api.mailchimp.com/3.0/lists/ba2435c95f";

  const options = {
    method: "POST",
    auth: "shineljin:d6598d66a0aabde737970082dcc5f28e-us5",
  };

  const request = https.request(url, options, (reponse) => {
    if (reponse.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    reponse.on("data", (data) => {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Port is runing on 3000");
});

// API KEY
// d6598d66a0aabde737970082dcc5f28e-us5

// audience Id
// ba2435c95f
