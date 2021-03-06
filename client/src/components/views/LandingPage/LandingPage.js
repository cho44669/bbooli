import React, { useEffect } from 'react';
import axios from 'axios';
import {withRouter} from 'react-router-dom';

//랜딩페이지에 들어오자마자 useEffect를 실행한다.
function LandingPage(props) {
    
    useEffect(() => {
        //겟 리퀘스트를 서버에다가 보내는 것. 그거의 엔드 포인트는 /api/hello이고 보낸다음 돌아오는 response를 콘솔창에다가 보여줄 수 있게 함.
        axios.get('/api/hello')
        .then(response => console.log(response))
    }, [])

    const onClickHandler = () => {
        axios.get(`/api/users/logout`)
        .then(response => {
            if(response.data.success){
                props.history.push("/login")
            } else{
                alert('로그아웃 실패')
            }
        })
    }

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center'
            , width: '100%', height: '100vh'
        }}>
            <h2>시작 페이지</h2>
            <button onClick={onClickHandler}>
                로그아웃
            </button>
        </div>
    )
}

export default withRouter(LandingPage)