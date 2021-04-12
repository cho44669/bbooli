import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import promiseMiddleware from 'redux-promise';
import ReduxThunk from 'redux-thunk';
import Redcer from './_reducers';

//원래는 createStore만 해서 스토어를 리덕스에서 생성만 하는건데 그냥 스토어는 객체 밖에 못 받기 때문에 프로미스와 뻥션을 받을 수 있게 미들웨어와 함꼐 받게 해준다.
const createStoreWithMiddleware = applyMiddleware(promiseMiddleware, ReduxThunk) (createStore)

ReactDOM.render(
<Provider
    store={createStoreWithMiddleware(Redcer,
        window.__REDUX_DEVTOOLS_EXTENXION__&&
        window.__REDUX_DEVTOOLS_EXTENXION__()
    )}
>
  <App/>
</Provider>
 , document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
