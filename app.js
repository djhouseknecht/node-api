const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const https = require('https');
const basicAuth = require('express-basic-auth')
const path = require('path');
const axios = require('axios').default;

let username = 'api_key_gXSBls3wFCSFwGrokZENaNtN';
axios.defaults.auth = {
  username,
  password: ''
};
axios.defaults.baseURL = 'https://api.arkowl.com'

const url = 'api.arkowl.com';
let q_res = {
  body1: ""
}
let email;
let phone;
let fullURL;
let extensionEMAIL = '/v2/email/';
let extensionPHONE = '/v2/phone/';
let extCOMB1 = '/v2/combined?email=';
let extCOMB2 = "&phone="

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

async function search () {
  if (email != "" && phone != "") {
    fullURL = extCOMB1 + email + extCOMB2 + phone + '/';
  } else if (email != "" && phone === "") {
    fullURL = extensionEMAIL + email + '/';
  } else if (email === "" && phone != "") {
    fullURL = extensionPHONE + phone + '/';
  } else fullURL = "/v2";
  console.log(url + fullURL);

  var options = {
    host: url,
    port: 443,
    path: fullURL,
    // authentication headers
    headers: {
      'Authorization': 'Basic ' + new Buffer(username + ':').toString('base64')
    }
  };
  //this is the call
  return new Promise((resolve, reject) => {
    https.get(options, function (res) {
      q_res.body1body1 = "";
      res.on('data', function (data) {
        q_res.body1 += data;
      });
      res.on('end', function () {
        //here we have the full response, html or json object
        console.log(q_res.body1);
        resolve();
      })
      res.on('error', function (e) {
        console.log("Got error: " + e.message);
        reject(e);
      });
    });
  });

  //return q_res.body1;
};

function buildSearchUri (email, phone) {

  return ''; // arkowl url to request
}

// TODO: make this a POST request
app.get('/', function (req, res) {
  q_res.body1 = "";
  //res.sendFile(__dirname + '/training.html');
  res.render("index.pug");
});
app.post('/', async function (req, res) {
  q_res.body1 = "";
  email = req.body.email;
  phone = req.body.phone;
  console.log(email);
  console.log(phone);
  //I cant make redirect or render wait till im done with the api call
  await search();
  try {
    //res.send(`Email: ${email} Phone: ${phone}`);
    setTimeout(() => {
      res.redirect('/result');
    }, 2000);
  } catch (error) {
    console.log("Error");
  }
});
app.get('/result', async function (req, res) {
  //res.send(`Result: ${body1}`);
  res.render("result.pug", {
    query_result: q_res.body1,
    email1: email,
    phone1: phone
  })
});
app.post('/result', async function (req, res) {
  q_res.body1 = "";
  email = req.body.email;
  phone = req.body.phone;
  console.log(email);
  console.log(phone);
  await search();
  //I cant make redirect or render wait till im done with the api call
  try {
    //res.send(`Email: ${email} Phone: ${phone}`);
    setTimeout(() => {
      res.redirect('/result');
    }, 2000);
  } catch (error) {
    console.log("Error");
  }
});

app.get('/api/search', async function (req, res) {
  email = req.query.email;
  phone = req.query.phone;

  const response = await axios.post(
    // `/v2/combined?email=${email}&phone=${phone}/`
    buildSearchUri(email, phone)
  );

  res.send(response.data['email.first_seen_anywhere']);
});

app.listen(8080, function (err) {
  console.log('Server started on port 8080....')
});
    //app.listen(443, function(err) {
    //   console.log('Server started on port 443....')
    //})
