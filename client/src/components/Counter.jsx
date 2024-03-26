import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { increment,decrement,reset,incrementByAmount } from '../app/counter/counterSlice';

const Counter = () => {
 const {count} = useSelector((state) =>state.counterR);
 const dispatch = useDispatch();
 const handelIncriment =()=>{
  dispatch(increment());
 }
 const handelDecriment =()=>{
  dispatch(decrement());
 }
 const handelReset =()=>{
  dispatch(reset());
 }
 const handelIncrimentBy5 =()=>{
  dispatch(incrementByAmount(5));
 }
  return (
    <div>
      <div>Count:{count}</div>
      <button onClick={handelIncriment}>+</button>
      <button onClick={handelReset}>0</button>
      <button onClick={handelDecriment}>-</button>
      <button onClick={handelIncrimentBy5}>5</button>
    </div>
  )
}

export default Counter