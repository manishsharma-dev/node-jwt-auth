const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();
//importing routes
const authRoute = require("./routes/auth");
const postRoute = require('./routes/posts');
dotenv.config();

//middleware and static files
app.use(express.json());
//Route MiddleWares
app.use("/api/user", authRoute);
app.use('/api/posts', postRoute);

//Connect to mongodb
const dbURI = process.env.DB_CONNECT;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(3000))
    .catch((err) => console.log(err));



app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.status(200).send({
        data:"Art-gallery backend"
    })
});