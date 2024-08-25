import React from 'react';
import { NavLink } from 'react-router-dom';
import './../screens/static/style.css';

export default function 
() {
  return (
    <div>
        <aside className='panel'>
            <h1 className="top">
                <img src={require('./../assets/images/main/logo.png')} alt="logo" />
                <p>Hospital Panel</p>
            </h1>
            <nav>
                <ul>
                    <li>
                        <NavLink className={({isActive}) => isActive ? "active" : ""} to='home'>
                            <img src={require('../assets/images/main/home-icon.png')} alt="icon" />
                            <p>Home</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink className={({isActive}) => isActive ? "active" : ""} to='request'>
                            <img src={require('../assets/images/main/blood.png')} alt="icon" />
                            <p>Request</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink className={({isActive}) => isActive ? "active" : ""} to='contact'>
                            <img src={require('../assets/images/main/contact-icon.png')} alt="icon" />
                            <p>Contact</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink className={({isActive}) => isActive ? "active" : ""} to='city-composition'>
                            <img src={require('../assets/images/main/circle-chart-icon.png')} alt="icon" />
                            <p>City Composition</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink className={({isActive}) => isActive ? "active" : ""} to='report'>
                            <img src={require('../assets/images/main/warning-icon.png')} alt="icon" />
                            <p>Report</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink className={({isActive}) => isActive ? "active" : ""} to='subscription'>
                            <img src={require('../assets/images/main/subscription-icon.png')} alt="icon" />
                            <p>Subscription</p>
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </aside>
    </div>
  )
}
