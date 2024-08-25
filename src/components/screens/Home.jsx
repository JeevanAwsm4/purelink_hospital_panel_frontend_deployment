import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './static/home.css'; // for header
import SettingIcon from './../assets/images/main/settings-icon.png';
import { BASE_URL } from '../../axiosConfig'; 
import { UserContext } from '../../App'; 

export default function PanelHome() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { userData } = useContext(UserContext);

  useEffect(() => {
    if (userData?.access) {
      axios.get(`${BASE_URL}/panel/home_data/`, {
        headers: {
          Authorization: `Bearer ${userData.access}`, 
        },
      })
        .then((response) => {
          console.log(response.data);
          setData(response.data);
        })
        .catch((err) => {
          setError(err.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setError('User not authenticated');
      setIsLoading(false);
    }
  }, [userData]); 

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  return (
    <>
      <div id="home-page">
        <div className="cards">
          <ul>
            <li className="card">
              <div className="top">
                <img src={require('./../assets/images/main/request-icon.svg').default} alt="icon" />
                <h1>Requests this month</h1>
              </div>
              <div className="middle">
                <img src={require("./../assets/images/main/chart-icon.svg").default} alt="icon" className='chart' />
                <span className="points">{data.your_request}</span>
                <img src={require('./../assets/images/main/up-arrow.svg').default} alt="icon" className='arrow' />
              </div>
              <div className="bottom">
                <p>{data.recent_requests.length > 0 ? `${data.recent_requests[0].wanted_count - data.recent_requests[0].donors_count} requests more than last month` : 'No recent requests'}</p>
              </div>
            </li>

            <li className="card">
              <div className="top">
                <img src={require('./../assets/images/main/total-request-icon.svg').default} alt="icon" />
                <h1>Total requests in city</h1>
              </div>
              <div className="middle">
                <img src={require("./../assets/images/main/chart-icon.svg").default} alt="icon" className='chart' />
                <span className="points">{data.receivers}</span>
                <img src={require('./../assets/images/main/up-arrow.svg').default} alt="icon" className='arrow' />
              </div>
              <div className="bottom">
                <p>{data.recent_requests.length > 0 ? `${data.recent_requests[0].wanted_count - data.recent_requests[0].donors_count} requests more than last month` : 'No recent requests'}</p>
              </div>
            </li>

            <li className="card">
              <div className="top">
                <img src={require('./../assets/images/main/donor-icon.svg').default} alt="icon" />
                <h1>Donors this month</h1>
              </div>
              <div className="middle">
                <img src={require("./../assets/images/main/chart-icon.svg").default} alt="icon" className='chart' />
                <span className="points">{data.active_donors}</span>
                <img src={require('./../assets/images/main/down-arrow.svg').default} alt="icon" className='arrow' />
              </div>
              <div className="bottom">
                <p>{data.recent_requests.length > 0 ? `${data.recent_requests[0].wanted_count - data.recent_requests[0].donors_count} requests more than last month` : 'No recent requests'}</p>
              </div>
            </li>
          </ul>
        </div>

        <div className="requests">
          <div className="top">
            <h1>Provision Blood donation slot</h1>
            <button className='request'><span className='plus'>+</span> New request</button>
          </div>
          {data.recent_requests.map((request, index) => (
            <div className="items" key={index}>
              <div className="item">
                <div className="left">
                  <h1>Requested {request.wanted_count} {request.blood_group} donors</h1>
                  <span className="time">{new Date(request.datetime).toLocaleTimeString()}</span>
                </div>
                <div className="right">
                  <h1>Got {request.donors_count} donors <span className="arrow"><img src={require(request.donors_count > request.wanted_count ? './../assets/images/main/green-up-arrow.png' : './../assets/images/main/red-down-arrow.png')} alt="icon" /></span></h1>
                  <span className="date">{new Date(request.datetime).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="feedback">
          <button>Add Feedback</button>
        </div>
      </div>
    </>
  );
}

function LoadingIndicator() {
  return <div>Loading...</div>;
}
