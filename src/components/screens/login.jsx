import './static/auth.css'
import React,{ useState, useContext } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import Logo from '../media/auth/image.png';
import Discord from '../media/auth/discord.svg';
import Facebook from '../media/auth/facebook.svg';
import Instagram from '../media/auth/instagram.svg';
import Mail from '../media/auth/mail.svg';
import Security from '../media/auth/lock.svg';
import axios from 'axios';
import { BASE_URL } from '../../axiosConfig';
import { UserContext } from '../../App';

export default function Login(){

    const {userData,updateUserData} = useContext(UserContext)

    const navigate = useNavigate();

    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(`${BASE_URL}/auth/token/`,{
            username: username,
            password:  password,
            
        })
        .then((res) => {
            console.log(res.data);
            setUsername('');
            setPassword('');
            const data = res.data;
            localStorage.setItem('user_data', JSON.stringify(data));

            Swal.fire({
                title: "Login successful",
                text:  "Proceed to dashboard",
                icon: "success",
              }).then((result) => {
                if (result.isConfirmed) {
                  //navigate('/hospital-panel/home');
                  updateUserData({ type: "LOGIN" , payload: data});
                }
              })
        })
        .catch((err) => {
            console.log(err.response);
            Swal.fire({
                title: `Error ${err.response.status} : ${err.response.data.detail}`,
                text:  `Error ${err.response.status} : ${err.response.statusText}`,
                icon: "error"
              });
        })
    }


    return (
        <>
        { userData ? 
            <Navigate to="/hospital-panel/home" />
            :
            <section class="auth-page">
                <section class="wrapper">
                    <div class="left">
                        <div class="above">
                            <img src={Logo} alt="logo"/>
                            <h1 class="welcome-message">Welcome to Purelink Hospital's panel</h1>
                        </div>
                        <div class="below">
                            <h1 class="info">Contact us via,</h1>
                            <div class="social">
                                <a href="" class="link-to-media"><img src={Discord} alt="" class="icon-social"/></a>
                                <a href="" class="link-to-media"><img src={Facebook} alt="" class="icon-social"/></a>
                                <a href="" class="link-to-media"><img src={Instagram} alt="" class="icon-social"/></a>
                                <a href="" class="link-to-media"><img src={Mail} alt="" class="icon-social"/></a>
                            </div>
                        </div>
                    </div>
                    <div class="right">
                        <div class="form-parent">
                            <div class="form-wrapper">
                                <div className="title">
                                    <h1>Sign in</h1>
                                </div>
                                <form action="" class="login" onSubmit={handleSubmit}>
                                    <div class="input-group">
                                        <input type="text" class="input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter Username" required />
                                    </div>
                                    <div class="input-group">
                                        <input type="password" class="input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter Password" required />
                                    </div>
                                    <div class="submit">
                                        <button type="submit" class="btn">Login Securely <img src={Security} alt="login" /></button> 
                                    </div>
                                </form>
                                <p>Don't have a account? Register <span><Link to="/signup">here.</Link></span></p>
                            </div>
                        </div>
                    </div>
                </section>
            </section>
        }
        </>
    )
}