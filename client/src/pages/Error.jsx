import React from 'react'
import {Helmet} from 'react-helmet'
import { PageTitle } from '../components/PageTitle';

const Error = () => {
  return (
    <div>
      <PageTitle title="404"/>
      <h1>404 page not found</h1>
    </div>
  )
}

export default Error;
