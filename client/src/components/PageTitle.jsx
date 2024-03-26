import React from 'react'
import {Helmet} from 'react-helmet'

export const PageTitle = (props) => {
  return (
    <Helmet>
        <title>{props.title}</title>
    </Helmet>
  )
}
