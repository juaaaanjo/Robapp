import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'; // You can use Redux Thunk for handling asynchronous actions
import rootReducer from '../reducer';

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;