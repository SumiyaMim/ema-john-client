import React from 'react'
import Lottie from "lottie-react"
import error from '../../assets/error.json'
import './Error.css'
import Header from '../Header/Header'

const Error = () => {
  return (
    <div>
        <Header></Header>
        <div className='error'>
            <Lottie animationData={error} loop={true} />;
        </div>
    </div>
  )
}

export default Error
