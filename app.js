const express = require('express');
const mongoose = require('mongoose');
const app = express();
const graphqlExpress = require('express-graphql');
const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');
const bodyParser = require('body-parser');
const auth = require('./middleware/auth');
const safeCompare = require('safe-compare');
const path = require('path');
require('dotenv').config();
require('dotenv').config({ path: path.join(__dirname, `./.env.${process.env.NODE_ENV}`) });

app.use(bodyParser({ limit: '20mb' }));

app.use(auth);

// const loggingMiddleware = (req, res, next) => {
//   console.log('ip:', req);
//   next();
// };

// app.use(loggingMiddleware);

app.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress(async (request, response, graphQLParams) => ({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    context: {
      request,
      response,
      graphQLParams,
    },
    customFormatErrorFn: error => {
      console.log(error);

      return {
        message: error.message,
        locations: error.locations,
        stack: error.stack ? error.stack.split('\n') : [],
        path: error.path,
      };
    },
  }))
);

// app.post('/webhook', (req, res) => {
//   const expoSignature = req.headers['expo-signature'];
//   // process.env.SECRET_WEBHOOK_KEY has to match <webhook-secret> value set with `expo webhooks:add ...` command
//   const hmac = crypto.createHmac('sha1', process.env.SECRET_WEBHOOK_KEY);
//   hmac.update(req.body);
//   const hash = `sha1=${hmac.digest('hex')}`;
//   if (!safeCompare(expoSignature, hash)) {
//     res.status(500).send("Signatures didn't match!");
//   } else {
//     // do something here, like send a notification to Slack!
//     res.send('OK!');
//   }
// });

app.use((error, req, res, next) => {
  //console.log('THIS HIT!');
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({
    message: message,
    data: data,
  });
});

mongoose
  .connect(process.env.DB_HOSTNAME, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log('CONNECTED'))
  .catch(err => console.log('Connection error', err));

app.listen(process.env.PORT);
