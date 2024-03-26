import React from 'react'
import {Helmet} from 'react-helmet'
import { PageTitle } from '../components/PageTitle';
import ProductSidebar from '../components/ProductSidebar';
import Counter from '../components/Counter';

const Home = () => {
  return (
    <>
    <PageTitle title="Home"/>
    <div className='container d-flex'>
      <div className='sidebar_container'>
        <ProductSidebar/>
      </div>
      <div className='product_container'><h3>listo of all products</h3></div>
      <Counter/>
    </div>
    </>
  )
}

export default Home;