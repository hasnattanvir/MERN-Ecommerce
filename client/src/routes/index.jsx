import React from "react";
import {BrowserRouter,Route,Routes} from 'react-router-dom'

import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Cart from "../pages/Cart";
import Error from "../pages/Error";
import Navbar from "../layouts/Navbar";
import '../index.css';
import Footer from "../layouts/Footer";
const Index = () =>{
    return <BrowserRouter>
            <Navbar/>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/Cart" element={<Cart/>}/>
                <Route path="/*" element={<Error/>}/>
            </Routes>
            <Footer/>
           </BrowserRouter>
}

export default Index;

