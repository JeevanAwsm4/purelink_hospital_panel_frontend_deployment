import React, { useState, useEffect, useContext } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import { UserContext } from '../../App'; // Adjust the import path
import './static/composition.css';
import { BASE_URL } from '../../axiosConfig';

Chart.register(ArcElement, Tooltip, Legend);

const LiveChart = () => {
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { userData } = useContext(UserContext);

  useEffect(() => {
    if (userData?.access) {
      axios.get(`${BASE_URL}/panel/city_composition_data/`, {
        headers: {
          Authorization: `Bearer ${userData.access}`
        }
      })
      .then((response) => {
        if (response.data['status code'] === 6000) {
          setChartData({
            labels: ['A+', 'B+', 'AB+', 'O+', 'O-', 'A-', 'B-', 'AB-'],
            datasets: [
              {
                label: 'Donors',
                data: [
                  response.data['A+'],
                  response.data['B+'],
                  response.data['AB+'],
                  response.data['O+'],
                  response.data['O-'],
                  response.data['A-'],
                  response.data['B-'],
                  response.data['AB-']
                ],
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)', // A+
                  'rgba(54, 162, 235, 0.2)', // B+
                  'rgba(255, 206, 86, 0.2)', // AB+
                  'rgba(75, 192, 192, 0.2)', // O+
                  'rgba(153, 102, 255, 0.2)', // O-
                  'rgba(255, 159, 64, 0.2)', // A-
                  'rgba(255, 205, 210, 0.2)', // B-
                  'rgba(100, 181, 246, 0.2)'  // AB-
                ],
                borderColor: [
                  'rgba(255, 99, 132, 1)', // A+
                  'rgba(54, 162, 235, 1)', // B+
                  'rgba(255, 206, 86, 1)', // AB+
                  'rgba(75, 192, 192, 1)', // O+
                  'rgba(153, 102, 255, 1)', // O-
                  'rgba(255, 159, 64, 1)', // A-
                  'rgba(255, 205, 210, 1)', // B-
                  'rgba(100, 181, 246, 1)'  // AB-
                ],
                borderWidth: 1,
              },
            ],
          });
        } else {
          setError(response.data.message);
        }
      })
      .catch((err) => {
        setError('An error occurred while fetching data');
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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='city-composition-parent'>
      {chartData && <Pie data={chartData} className='piechart' />}
    </div>
  );
};

export default LiveChart;
