import React from 'react';
import Layout from '../components/Layout/Layout';
import { useRouteError } from 'react-router-dom';

const ErrorPage = () => {
    const routeError = useRouteError() as { statusText?: string, message: string };

    const errorMessage = (
        <div className='text-center text-white'>
            <h1 className="text-5xl mb-4">Oops!</h1>
            <p className='mb-4'>This page does not exist.</p>
            <p>{routeError.statusText || routeError.message}</p>
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
