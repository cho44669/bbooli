 const express = require ("express")
 const app = express()
 const port = 5000
 const { User} = require("./models/User");
 const bodyParser = require('body-parser');

 
 //application/x-www-from-urlencoded(<<이렇게 된 데이터를 분석해서 bodyparser가 클라이언트에서 오는 정보를 서버에서 분석해서 가져올 수 있게 해줌.)
 app.use(bodyParser.urlencoded({extended: true}));
 //application/json(json 타입으로 된 것을 분석해서 가져올 수 있게 해줌.)
 app.use(bodyParser.json());



 const mongoose = require('mongoose')
 mongoose.connect('mongodb+srv://cho44669:qwe123@moviemap3.lajxk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
     useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
 }).then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err))

 app.get('/', (req, res) => res.send('Helld world!'))

 //주소 마지막 end 포인터 /register
 app.post('/register', (req, res) => {

    //회원가입 할 때 필요한 정보들을 client에서 가져오면
    //그것들을 데이터베이스에 넣어준다.
    //bodyparser를 이용해서 (req,body)로 클라이언트에서 보내는 정보를 받아준다.
    const user = new User(req.body)

    //save > mongDB에서 오는 메소드(method) save해주면 이 정보들이 유저 모델에 저장이 됨.
    //저장할 때 err가 있다면 클라이언트에 전달해주기 위함. json형식으로. 메세지와 함께.
    user.save((err, userInfo) => {
        if(err) return res.json({ success: false, err})
        return res.status(200).json({
            success: true
        })
    })
})


 app.listen(port, () => console.log(`Example app listening on port ${port}!`))