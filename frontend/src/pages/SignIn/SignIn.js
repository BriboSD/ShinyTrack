import React, { useState } from 'react';
import './SignIn.css'



function SignIn() {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [success, setSuccess] = useState(false);

    const handleContinue = async (e) =>{
        
        e.preventDefault();
        //setSuccess(true)
        try {
            const response = await fetch('http://localhost:8000/login', {
                
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email, password})
            });
            const data = await response.json(); 

            localStorage.setItem("token", data.token); 
            setSuccess(true)
        }
        catch (error){
            console.error("Error:", error)
        }

    }

    if (success){
        return (
            <h1> successfully logged in!</h1>
        )
    }
    else
    {
        return (
            <div className='container'> 
                <div className='header'>
                    <div className='headertext'>Sign In</div>
                </div>
                <div className='inputs'>
                    <div className='input'>
                        <input 
                        type='text' 
                        placeholder='username'
                        value= {username}
                        onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className='input'>
                        <input 
                        type='email' 
                        placeholder='email' 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className='input'>
                        <input 
                        type='password' 
                        placeholder='password' 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>
                <div className='forgot-pw'>Forgot your password? <span> click here to reset</span> </div>
                <button className='continue' onClick={handleContinue}> continue</button>
                <div className='no-account'>Don't have an account yet? </div>
                <button className='submit'>Create account </button>            
            </div>
        );
    }
}

export default SignIn;