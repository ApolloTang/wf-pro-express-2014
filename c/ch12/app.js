const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');
const session = require('express-session');

const RedisStore = require('connect-redis')(session);
const Redis = require('ioredis');

const redisOptions = {
  host: 'localhost',
  port: 6379,
  // password: 'nopassword'
  // keyPrefix: 'myredis'
};
const redisClient = new Redis(redisOptions);
const redisStore =  new RedisStore({ client: redisClient });

const sessionOptions = {
  resave: true,
  saveUninitialized: true,
  store: redisStore,
  secret: '0FFD9D8D-78F1-4A30-9A4E-0940ADE81645',
  cookie: {
    path: '/',
    maxAge: 3600000,
  }
};

app.use(cookieParser());
app.use(session(sessionOptions));

app.get('/', function(request, response){
  console.log('Session ID: ', request.sessionID)
  console.log('Cookie: ', request.cookies)

  if (request.session.counter) {
    request.session.counter=request.session.counter +1;
  } else {
    request.session.counter = 1;
  }
  response.send('Counter: ' + request.session.counter)
});

app.listen(3000);
