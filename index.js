 const express = require ("express")
 const app = express()
 const port = 5000

 const mongoose = require('mongoose')
 mongoose.connect('mongodb+srv://cho44669:qwe123@moviemap3.lajxk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
     useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
 }).then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err))

 app.get('/', (req, res) => res.send('Helld world!'))
 app.listen(port, () => console.log(`Example app listening on port ${port}!`))