import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';

function SignUp() 
{

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const handleCreate = async (e) =>
    {
        e.preventDefault();
        
        try 
        {
            console.log("Sending data:", { username, password, email });
            const response = await fetch('http://localhost:8000/add-user', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_email: email,
                    username,
                    user_password: password
                }),
                credentials: "include"

            });
            const data = await response.json();
            if (response.ok)
            {
                localStorage.setItem("token", data.accessToken); 
                navigate("/user-page");
            }
            else
            {
                console.error("user creation failed:", data.message || "Unknown error");
            }
        }
        catch (error)
        {
            console.error("Error:", error)
        }

    };
    const handleLog = async (e) =>
    {
        navigate("/sign-in");
    };

    return (
        <div className='container'> 
            <div className='header'>
                <div className='headertext'>Create Account</div>
            </div>
            <div className='inputs'>
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
                    type='username' 
                    placeholder='username' 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
            <button className='continue' onClick={handleCreate}> continue</button>
            <div className='have-account'>Already have an account? </div>
            <button className='submit' onClick={handleLog}> log in </button>            
        </div>
    );

}
export default SignUp;
