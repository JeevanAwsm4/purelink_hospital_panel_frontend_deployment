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

export default function Signup(){

    const {userData,updateUserData} = useContext(UserContext)

    const navigate = useNavigate();

    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [phoneNo,setPhoneNo] = useState('');
    const [email,setEmail] = useState('');
    const [adress,setAddress] = useState('');  
    const [district,setDistrict] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(`${BASE_URL}/panel/signup/`,{
            username: username,
            password:  password,
            phone_no : phoneNo,
            email : email,
            address : adress,
            district : district,
            name : username,
            
        })
        .then((res) => {
            if (res.data.status_code === 6000) {
                console.log(res.data);
                setUsername('');
                setPassword('');
                const data = res.data.data_store;
                localStorage.setItem('user_data', JSON.stringify(data));

                Swal.fire({
                    title: "Login successful",
                    text:  "Proceed to dashboard",
                    icon: "success",
                }).then((result) => {
                if (result.isConfirmed) {
                  updateUserData({ type: "LOGIN" , payload: data});
                }
              })
            }else {
                Swal.fire({
                    title: "Login unsuccessful",
                    text:  res.data.message,
                    icon: "error",
                })
        }})
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
            <section class="signup-page auth-page">
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
                                    <h1>Sign up</h1>
                                </div>
                                <form action="" class="signup" onSubmit={handleSubmit}>
                                <div class="container">
                                <div class="sub-left">
                                    <div class="input-group">
                                        <input type="text" class="input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter Username" required />
                                    </div>
                                    <div class="input-group">
                                        <input type="password" class="input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter Password" required />
                                    </div>
                                    <div class="input-group">
                                        <input type="number" class="input" value={phoneNo} onChange={(e) => setPhoneNo(e.target.value)} placeholder="Enter Phone No." required />
                                    </div>
                                </div>
                                <div class='sub-right'>
                                    <div class="input-group">
                                        <input type="email" class="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter Email" required />
                                    </div>
                                    <div class="input-group">
                                        <input type="text" class="input" value={adress} onChange={(e) => setAddress(e.target.value)} placeholder="Enter Address" required />
                                    </div>
                                    <div class="input-group">
                                          <div class="input-group">
  <select class="input" value={district} onChange={(e) => setDistrict(e.target.value)} required>
    <option value="" disabled>Select District</option>
    <option value="1">Kollam</option>
    <option value="2">Ernakulam</option>
    <option value="3">Kasargod</option>
    <option value="4">Wayanad</option>
    <option value="5">Kozhikode</option>
    <option value="6">Thiruvananthapuram</option>
    <option value="7">Pathanamthitta</option>
    <option value="8">Kottayam</option>
    <option value="9">Idukki</option>
    <option value="10">Alappuzha</option>
    <option value="11">Thrissur</option>
    <option value="12">Palakkad</option>
    <option value="13">Malappuram</option>
    <option value="14">Kannur</option>
  </select>
</div>
            
                                    </div>
                                
                                </div>
                                </div>
                                <div class="submit">
                                        <button type="submit" class="btn">Login Securely <img src={Security} alt="login" /></button> 
                                    </div>
                                </form>
                                <p>Already Registered? Login <span><Link to="/login">here.</Link></span></p>
                            </div>
                        </div>
                    </div>
                </section>
            </section>
        }
        </>
    )
}
