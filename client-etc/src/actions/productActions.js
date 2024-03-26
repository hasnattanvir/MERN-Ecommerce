import axios from 'axios';

import{
    ALL_PRODUCTS_REQUEST,
    ALL_PRODUCTS_SUCCESS,
    ALL_PRODUCTS_FAIL,
    CLEAR_ERROR
}from '../constants/productConstant';


export const getProducts = () => async(dispatch)=>{
    try{
        dispatch({type: ALL_PRODUCTS_REQUEST})
        const {data} = await axios.get('http://localhost:3001/api/categories')
        // console.log(data);
        dispatch({
            type: ALL_PRODUCTS_SUCCESS,
            payload: data
        })
    } catch(error){
        dispatch({
            type: ALL_PRODUCTS_FAIL,
            payload: error.response.data.message
        })
    }
}

// Clear error
export const clearErrors =()=>async(disptach)=>{
    disptach({
        type:CLEAR_ERROR
    })
}