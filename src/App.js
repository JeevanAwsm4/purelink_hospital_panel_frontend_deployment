import React,{ useState, useContext, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Login from './components/screens/login'
import Signup from './components/screens/signup'
import NotAvailable from './components/screens/NotAvailable';
import Home from './components/screens/Home';
import styled from "styled-components";
import PanelNav from './components/includes/PanelNav'
import Request from './components/screens/Request';
import Header from './components/includes/Header';
import Report from './components/screens/Report';
import Contact from './components/screens/Contact';
import Subscribe from './components/screens/Subscribe'
import LiveChart from './components/screens/composition';
import Subscription from './components/screens/subscription';
import PrivateRoutes from './components/screens/PrivateRoutes';
import { BASE_URL } from './axiosConfig';


export const UserContext = React.createContext();

function App(props) {

	const [userData,setUserData] = useState(null);
    const [IsLoading, setLoading] = useState(true);

	useEffect(() =>{
		const userDataInfo = JSON.parse(localStorage.getItem('user_data'))
		if (userDataInfo) {
			const refresh = userDataInfo.refresh
			axios.post(`${BASE_URL}/auth/token/refresh/`,{refresh: refresh})
			.then((res) => {
				console.log(res.data)
				const updatedUserData = { ...userData, access: res.data.access };
				setUserData(updatedUserData);
			})
			.catch((err) => {
				console.log(err)
			})
		}
		setLoading(false);
	},[])

	const updateUserData = (action) => {
		switch(action.type) {
			case "LOGOUT":
				setUserData(null);
				localStorage.clear();
				console.log("LOGOUT")
				window.location.href = "";
				break;
			case "LOGIN":
				console.log("Type LOGIN")
				setUserData(action.payload);
				break;
			default:
			    break;
		}
	}

	if (IsLoading) {
		return <div>Loading...</div>;
	}

  	return (
		<UserContext.Provider value={{ userData, updateUserData, IsLoading }} >
   			<Router>
    	  		<Routes>
    	      	<Route path='*' Component={Login} />
    	      	<Route path='signup' Component={Signup} />
    	      	<Route path='panel' Component={NotAvailable} />
    	      	<Route path='subscribe' element={<Subscribe />} />
    	      	<Route
            		path="/hospital-panel/*"
            		element={
            			<PrivateRoutes
            		    	element={() => (
            		      		<Container>
            		       			<PanelNav />
            		        		<PanelRouteContainer>
            		          			<Header />
            		          			<Routes>
            		        				<Route path="home" element={<Home />} />
            		            			<Route path="request" element={<Request />} />
            		            			<Route path="report" element={<Report />} />
            		            			<Route path="contact" element={<Contact />} />
            		            			<Route path="city-composition" element={<LiveChart />} />
            		            			<Route path="subscription" element={<Subscription />} />
            		          			</Routes>
            		        		</PanelRouteContainer>
            		      		</Container>
							)
            		    }
            		  />
            		}
        		/>
				
    	  	</Routes>
    	</Router>
	</UserContext.Provider>
  );
}

export default App;

const Container = styled.div`
  display: flex;
`
const RouteContainer = styled.div`
  padding: 55px 30px 0px;
  width: 75%;
  padding-left: 10%;
`
const PanelRouteContainer = styled.div`
  padding: 0px;
  width: 100%;
  padding-left: 18%;
`