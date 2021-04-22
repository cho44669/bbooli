import React, {useEffect} from 'react';
import Axios from 'axios';
import {useDispatch} from 'react-redux';
import {auth} from '../_actions/user_action';

export default function (SpecificCompoent, option, adminRoute = null) {

    function AuthenticationCheck(props) {

        const dispatch = useDispatch();
        //모든 정보를 백엔드에서 처리해서 가져온 정보들을 리스펀스 안에 들어감.

        //백엔드에 리퀘스트를 날려서 그 사람의 현재 상태를 가져오는 부분.
        useEffect(() => {
            dispatch(auth()).then(response => {
                console.log(response)

                //로그인 하지 않은 상태
                if(!response.payload.isAuth) {
                    if(option) {
                        props.history.push('/login')
                    }
                }else {
                    //로그인 한 상태
                    if(adminRoute && !response.payload.isAdmin) {
                        props.history.push('/')
                    }else {
                        if(option == false)
                            props.history.push('/')
                    }
                }
            })
    }, [])
        return (
            <SpecificCompoent/>
        )
    }
    return AuthenticationCheck
}