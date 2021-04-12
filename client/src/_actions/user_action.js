import axios from 'axios';
import  {LOGIN_USER} from './types';

export function loginUser(dataToSubmit) {

    //서버에서 받은 데이터를 리퀘스트에 저장
    const request = axios.post('/api/user/login', dataToSubmit)
    .then(response => response.data)

    return {
        type: LOGIN_USER,
        payload: request
    }
}