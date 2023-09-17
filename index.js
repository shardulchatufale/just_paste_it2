const express = require('express');
const bodyParser = require('body-parser');
const route = require("./route/router");
const { default: mongoose } = require('mongoose');
const app = express();

app.use(bodyParser.json());//convert the incoming request body parse and to json
// app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.9.1', {
  useNewUrlParser: true,
}
)
  .then(() => console.log('MongoDb is connected'))
  .catch((err) => console.log(err));

app.use('/', route);

app.all('/**', (req, res) => {
  res.status(404).send({ status: false, message: 'Page Not Found!' });
});

app.listen(process.env.PORT || 3000, function () {
  console.log('Express app running on port ' + (process.env.PORT || 3000));
});//whenever u access thee data frm env file we use proccess.env
