import React from 'react';
import Layout from '../components/Layout/Layout';

const ErrorPage = () => {
    const errorMessage = (
        <div className='text-center'>
            <h1 className="text-5xl text-white mb-4">Oops!</h1>
            <h2 className="text-white">This page does not exist.</h2>
        </div>
    )

    return (
        <Layout
            chatBody={errorMessage}
            footer={<div/>}
        />
    )
}

export default ErrorPage
