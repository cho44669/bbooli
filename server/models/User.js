const { request } = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10
const jwt = require('jsonwebtoken');



const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    //trim > 주소에 스페이스를 없애는 역활. uniqre > 중복되는 이메일 없앰
    email: {
        type: String,
        trim: true,
        unique:1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    //rloe > 관리자와 유저를 나누기 위해 넘버로 관리, default > 임의로 role을 지정하지 않으면 0을 주겠다. 
    role: {
        type: Number,
        default: 0
    },
    image: String,
    //token > 유효성 관리
    token: {
        type: String
    },
    //tokenExp > 사용할 수 있는 유효기간
    tokenExp: {
        type: Number
    }
})
//svae > 유저모델에 유저 정보를 저장하기 전에(index.js :29) 무엇을 하고 끝나면 다시 index.js :30로 감.
userSchema.pre('save', function( next ){
    var user = this;
    //비밀번호를 바꿀때만 암호화 하기 위한 조건부.
    if(user.isModified('password')) {
    //비밀번호를 암호화 시킨다.
    //salt를 만들 때 saltRounds가 필요함
        bcrypt.genSalt(saltRounds, function(err, salt) {
        if(err) return next(err)
            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err)
                user.password = hash
                next()
            // Store hash in your password DB.
             })
        })
        //만약에 비밀번호가 아니라 다른 거를 바꿀때는 next를 줘야지 index로 바로 나갈 수 있다.
    } else {
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb) {

    //plainPassword 1234567 /  데이터베이스에 있는 암호화된 비밀번호  $2b$10$SX.R66ifLo01lBbK52ClCO4B4  <이 두 개를 같은지 체크해야 함.
    //그럴라면  plainPassword 를 암호화를 한 다음에 데이터베이스에 있는 비밀번호와 같은지 확인해야 함.
    
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        //만약에 비밀번호가 같지않다면 리턴해서 콜백해서 에러를 주고
        if(err) return cb(err);
        //만약에 비밀번호가 같으면 에러를 주지 말고  비밀번호는 같다 ismatch는 트루
        cb(null, isMatch);
    })//이게 index.js :50으로 감
}


userSchema.methods.generateToken = function(cb) {
    
    var user = this;
    
    //jsonwebtoken을 이용해서 토큰을 생성하기
    var token = jwt.sign(user._id.toHexString(), 'secretToken')

   /*  user._id + 'secretToken' = token

    ->

    'secretToken' -> user._id
    */

    //토큰을 넣어주고 유저를 세이브 한 다음에
    user.token = token
    user.save(function(err,user) {
        //에러가 있따면 리턴 콜백으로 에러를 전달해주고
        if(err) return cb(err);
        //세이브가 잘 전달됐으면 에러가 없고 유저정보만 다시 전달.>index.js :57
        cb(null, user);
    })
}

//토큰을 가져온다.
userSchema.statics.findByToken = function (token, cb) {
    var user = this;

    //user._id + '' = token
    //토큰을 decode 한다.
    jwt.verify(token, 'secretToken', function(err, decoded) {
        //유저 아이디를 이용해서 유저를 찾은다음에
        //클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인

        user.findOne({"_id": decoded, "token": token}, function (err,user) {

            if(err) return cb(err);
            cb(null,user);
        })
    })
}

//스키마를 모델(User)로 감싸주기 위함.
const User = mongoose.model('User', userSchema)
//이 모델을 다른 곳에서도 쓸 수 있게 export를 해줌.
module.exports = { User }