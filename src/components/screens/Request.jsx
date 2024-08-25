import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../App';
import './static/request.css';
import Swal from 'sweetalert2';

export default function Request() {
    const [donationType, setDonationType] = useState('');
    const [bloodGroup, setBloodGroup] = useState('');
    const [date, setDate] = useState('');
    const [time,setTime] = useState('');
    const [wantedCount,setWantedCount] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const { userData } = useContext(UserContext);

    const handleSubmit = (e) => {
        e.preventDefault();
        const datetime = `${date} ${time}`

        axios.post('http://localhost:8000/api/v1/panel/create_request/', {
            type_of_donation: donationType,
            blood_group: bloodGroup,
            datetime: datetime,
            user_password: password,
            wanted_count : wantedCount,
        }, {
            headers: {
                Authorization: `Bearer ${userData.access}` 
            }
        })
        .then(response => {
            console.log(response.data);
            if (response.data['status code'] === 6000) {
                setDonationType('')
                setBloodGroup('')
                setDate('')
                setTime('')
                setPassword('')
                setWantedCount('')
                Swal.fire({
                    title: "Accepted",
                    text:  response.data.message,
                    icon: "success",
                  })
            } else {
                Swal.fire({
                    title: "Error",
                    text:  response.data.message,
                    icon: "error",
                  })
            }
        })
        .catch(err => {
            Swal.fire({
                title: "Unfortunately,an error occured.",
                text:  err,
                icon: "error",
              })
        });
    };

    return (
        <>
            <div className="request-main">
                <div className='request-form-parent'>
                    <h1 className='request-title'>Request Details</h1>
                    <form className='request-form' onSubmit={handleSubmit}>
                        <select
                            className="request-input"
                            name="donation-type"
                            id="donation-type"
                            value={donationType}
                            onChange={(e) => setDonationType(e.target.value)}
                        >
                            <option value="" disabled>Select Donation Type</option>
                            <option value="Platelets">Platelets</option>
                            <option value="RBC">RBC</option>
                            <option value="WBC">WBC</option>
                        </select>
                        <select
                            className="request-input"
                            id="blood-group"
                            value={bloodGroup}
                            onChange={(e) => setBloodGroup(e.target.value)}
                        >
                            <option value="" disabled>Select Blood Group</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                        </select>
                        <input
                            className="request-input"
                            type="date"
                            placeholder="Enter date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                        <input
                            className="request-input"
                            type="time"
                            placeholder="Enter time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                        />
                        <input
                            className="request-input"
                            type="number"
                            placeholder="Wanted Count"
                            value={wantedCount}
                            onChange={(e) => setWantedCount(e.target.value)}
                        />
                        <input
                            className="request-input"
                            type="password"
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button className='request-submit' type="submit">Submit</button>
                    </form>             
                </div>
                <div className="request-last">
                    <p>🔥 Fact: The average red blood cell transfusion is 3 pints (or 3 whole-blood donations).</p>
                </div>
            </div>
        </>
    );
}
