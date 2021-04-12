import Axios from 'axios'
import React, {useState} from 'react'
import {useDispatch} from 'react-redux'
import {loginUser} from '../../../_actions/user_action';

function LoginPage(props) {

    const dispatch = useDispatch();
//밸류부분에 스태잇을 넣어줘야함. 스태잇의 변화를 시켜야 리턴 값 안의 데이터의 변화를 줄 수 있다.
//서버에 보내야 하는 값들(로그인 할 때 아이디라든지 비밀번호라든지)을 스테잇에 갖고 있다.
    //usestate
    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")

    const onEmailHandler = (event) => {

        setEmail(event.currentTarget.value)
    }
    const onPasswordHandler = (event) => {

        setPassword(event.currentTarget.value)
    }
    const onSubmitHandler = (event) => {
        //proventDefault를 해주지 않으면 페이지가 리프레쉬가 되기때문에 .
        event.proventDefault();

        let body ={
            email: Email,
            password: Password
        }

        dispatch(loginUser(body))
        .then(response => {
            if(response.payload.loginSuccess) {
                props.history.push('/')
            } else {
                alert('Error"')
            }
        })
    }
//타이핑을 할 때 스태잇을 바꿔주면 밸류가 바뀌는 로직. 타이핑을 할 때 언체인지라는 이벤트를 발생시켜서 스태잇을 바꿔준다. 스태잇이 바꿔지면 밸류가 바뀜
    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center'
            , width: '100%', height: '100vh'
        }}>
            <form style={{ display: 'flex', flexDirection: 'column'}}
                onSubmit={onSubmitHandler}>
                 <label>Email</label>
                 <input type= "email" value={Email} onChange={onEmailHandler} />
                 <label>Password</label>
                 <input type= "password" value={Password} onChange={onPasswordHandler} />
                <br />
                <button type= "submit">
                    Login
                </button>
            </form>
        </div>
    )
}

export default LoginPage