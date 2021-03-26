const mongoose = require('mongoose');

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
//스키마를 모델(User)로 감싸주기 위함.
const User = mongoose.model('User', userSchema)
//이 모델을 다른 곳에서도 쓸 수 있게 export를 해줌.
module.exports = { User }