import React from 'react';
import './SignIn.css'



function SignIn() {

    return (
        <div className='container'> 
            <div className='header'>
                <div className='headertext'>Sign In</div>
             </div>
            <div className='inputs'>
                <div className='input'>
                    <input type='text' placeholder='username'/>
                </div>
                <div className='input'>
                    <input type='email' placeholder='email' />
                </div>
                <div className='input'>
                    <input type='password' placeholder='password' />
                </div>
            </div>
            <div className='forgot-pw'>Forgot your password? <span> click here to reset</span> </div>
            <div className='continue'> continue</div>
            <div className='no-account'>Don't have an account yet? </div>
            <div className='submit'>Create account</div>            
        </div>
    );
}

export default SignIn;