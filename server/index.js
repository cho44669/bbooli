 const express = require ("express")
 const app = express()
 const { auth } = require('../middlieware/auth');
 const { User} = require("./models/User");
 const bodyParser = require('body-parser');
 const config = require('./config/key'); 
 const cookieParser = require('cookie-parser');
 //application/x-www-from-urlencoded(<<이렇게 된 데이터를 분석해서 bodyparser가 클라이언트에서 오는 정보를 서버에서 분석해서 가져올 수 있게 해줌.)
 app.use(bodyParser.urlencoded({extended: true}));
 //application/json(json 타입으로 된 것을 분석해서 가져올 수 있게 해줌.)
 app.use(bodyParser.json());
 app.use(cookieParser());



 const mongoose = require('mongoose')
 mongoose.connect(config.mongoURI, {
      useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
 }).then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err))

 app.get('/', (req, res) => res.send('Helld world! 환영합니다.'))

 app.get ('/api/hello', (req,res) => {
   res.send("안녕하세요")
 })

 //주소 마지막 end 포인터 /register
 app.post('/api/users/register', (req, res) => {

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
app.post('/api/users/login', (req,res) => {

    //요청된 이메일을 데이터베이스에서 있는지 찾는다.
    User.findOne({ email: req.body.email}, (err, user) => {
        if(!user) {
            return res.json({
                loginSucees: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }
        //요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는지 확인.
        user.comparePassword(req.body.password , (err, isMatch) => {
            //비밀번호가 같지 않다면
            if(!isMatch)
            //res를 클라이언트에 줘야함 .
            return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."})
        
            //비밀번호까지 맞다면 토큰을 생성하기.
            user.generateToken((err, user) => {
                if(err) return res.status(400).send(err);

                //토큰을 저장한다. 어디에 ? 쿠키, 로컬스토리지
                res.cookie("x_auth", user.token)
                .status(200)
                //클라이언트에 전해줌
                .json({ loginSuccess: true, userId: user._id })            
            })
        })  
    })
})

// role 1 = admin    role 2 = 특정 부서 admin
// role 0 = 일반유저   role 0이 아니면 관리자 
app.get('/api/users/auth', auth, (req, res) => {

    //여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication 이   True 라는 말.
    res.status(200).json ({
        _id: req.user._id,
        isAdmin: req.user.rloe === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})

app.get('/api/users/logout', auth, (req,res) => {

    User.findOneAndUpdate({ _id: req.user._id },
        { token: ""}
        , (err, user) => {
            if (err) return res.json({ success: false, err});
            return res.status(200).send({
                success: true
            })
        })
})
    

const port = 5000

 app.listen(port, () => console.log(`Example app listening on port ${port}!`))