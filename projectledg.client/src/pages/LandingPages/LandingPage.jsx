import React from 'react';
import Navbar from './LandingPageComp/Navbar';
import Content from './LandingPageComp/Content';

export default function LandingPage() {
    return (
        <>
        <Navbar />
        <div className='w-[100wv] flex flex-row justify-center'>
        <Content/>
        </div>
        
        </>
    );
};

    