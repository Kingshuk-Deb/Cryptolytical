# Cryptolytical | What it can do :

- Get Realtime Data of more than 200 Cryptocurrencies.
- 200+ latest news articles.
- Sentiment Analysis from 1000+ tweets.
- Get Filtered Data for customised price queries and cryptos
- Further data being collected for analysis.

# Steps to use it :

- Signup with email & Username
- Get access access token and email verification link
- Pass access token as auth during get requests
- [DEMO](https://www.youtube.com/watch?v=g78zi-5aXcY)

By default it fetches the first 10 results. It is a paginated Node JS api. For more data send page and limit value as query. 

# Code Examples :

- `POST: https://cryptolytical.herokuapp.com/api/signup` -> For User Signup

<details>
    <summary>JSON/JavaScript Code For User Signup</summary>

```javascript
// POST USER CREDENTIALS JSON
{
    "username": "User1",
    "email": "user1@gmail.com"
}

// GET MESSEGE
{
  "message": "Sent verification email!"
}

// Check your mail for access token and email verification. Check Spam Also!

// POSSIBLE ERRORS
{ 
  "error": "Please give another email! Email Exists" 
}
```
    
```javascript
// JS CODE
import axios from "axios";

let headersList = {
 "Content-Type": "application/json" 
}

let reqOptions = {
  url: "https://cryptolytical.herokuapp.com/api/signup",
  method: "POST",
  headers: headersList,
  data: `{\n    \"username\": \"${username}\",\n    \"email\": \"${email}\"\n}`,
}

axios.request(reqOptions).then(function (response) {
  console.log(response.data);
})
```
</details>

- `GET: https://cryptolytical.herokuapp.com/api/cryptodata?page=4&limit=5` -> For Cryptocurrency Data

<details>
    <summary>JavaScript Code</summary>

```javascript
import axios from "axios";

// PASS AUTH TOKEN
let headersList = {
 "Authorization": "Bearer authToken" 
}

let reqOptions = {
  url: "https://cryptolytical.herokuapp.com/api/cryptodata?page=4&limit=5",
  method: "GET",
  headers: headersList,
}

axios.request(reqOptions).then(function (response) {
  console.log(response.data);
})
```
</details>

- `GET: https://cryptolytical.herokuapp.com/api/cryptonews?page=4&limit=5` -> For Cryptocurrency News Data

<details>
    <summary>JavaScript Code</summary>

```javascript
import axios from "axios";

// PASS AUTH TOKEN
let headersList = {
 "Authorization": "Bearer authToken" 
}

let reqOptions = {
  url: "https://cryptolytical.herokuapp.com/api/cryptonews?page=4&limit=5",
  method: "GET",
  headers: headersList,
}

axios.request(reqOptions).then(function (response) {
  console.log(response.data);
})
```
</details>

- `GET: https://cryptolytical.herokuapp.com/api/cryptosentiment` -> For Cryptocurrency Sentiment Data

<details>
    <summary>JavaScript Code</summary>

```javascript
import axios from "axios";

// PASS AUTH TOKEN
let headersList = {
 "Authorization": "Bearer authToken" 
}

let reqOptions = {
  url: "https://cryptolytical.herokuapp.com/api/cryptosentiment",
  method: "GET",
  headers: headersList,
}

axios.request(reqOptions).then(function (response) {
  console.log(response.data);
})
```
</details>

- `GET: https://cryptolytical.herokuapp.com/api/cryptodata/:coin` -> Get Specified Cryptocurreny Details
    
<details>
    <summary>JavaScript Code</summary>

```javascript
import axios from "axios";

// PASS AUTH TOKEN
let headersList = {
 "Authorization": "Bearer authToken" 
}

// pass crypto sign as a param example - https://cryptolytical.herokuapp.com/api/cryptodata/btc
let reqOptions = {
  url: "https://cryptolytical.herokuapp.com/api/cryptodata/:coin",
  method: "GET",
  headers: headersList,
}

axios.request(reqOptions).then(function (response) {
  console.log(response.data);
})
```
</details>

- `GET: https://cryptolytical.herokuapp.com/api/cryptodata/coin/price?lt=100&gt=10&limit=20` -> Get Filtered Price Between Between LT(Less Than) and GT(Greater Than)
    
<details>
    <summary>JavaScript Code</summary>

```javascript
import axios from "axios";

// PASS AUTH TOKEN
let headersList = {
 "Authorization": "Bearer authToken" 
}

// pass lt(less than) and gt(greater than) and limit queries
let reqOptions = {
  url: "https://cryptolytical.herokuapp.com/api/cryptodata/coin/price?lt=15&gt=10&limit=2",
  method: "GET",
  headers: headersList,
}

axios.request(reqOptions).then(function (response) {
  console.log(response.data);
})
```
</details>

# Packages & Tech Used :

- Axios
- Cheerio
- Express
- Sentiment
- Twit
- Mongo
- Nodemailer
