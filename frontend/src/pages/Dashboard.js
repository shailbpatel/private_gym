import React,{ useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom"
import Layout from "../components/Layout"
import AboutUs from "../components/AboutUs"
import Plans from "../components/Plans"
import Classes from "../components/Classes"

  
function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState({})
    const [locations, setLocations] = useState([])
    const [selectedLocation, setSelectedLocation] = useState(localStorage.getItem('selectedLocation') || "")
    const [plans, setPlans] = useState([])
    const [classes, setClasses] = useState([]);


    useEffect(()=>{
        if(localStorage.getItem('token') !== ""){
            getUser();
        }   
            getLocations();
            getPlans();
            getClasses(selectedLocation);
    },[]) // eslint-disable-line react-hooks/exhaustive-deps
 
    const getUser = () => {
        axios.get('users/details', { headers:{Authorization: 'Token ' + localStorage.getItem('token')}})
        .then((r) => {
            if (r.data.success) {
                setUser(r.data.data)
            }
        })
        .catch((e) => {
            console.log(e)
        });
    }
 
    const logoutAction = () => {
        axios.post('users/logout',{}, { headers:{Authorization: 'Token ' + localStorage.getItem('token')}})
        .then((r) => {
            localStorage.setItem('token', "")
            setUser({})
        })
        .catch((e) => {
            console.log(e)
        });
    }
     
    const getLocations = () => {
        axios.get('/locations/')
        .then((r) => {
            if (r.data.success) {
                setLocations(r.data.data)
            }
        })
        .catch((e) => {
            console.log(e)
        });
    }

    const getPlans = () => {
        axios.get('/plans/')
        .then((r) => {
            if (r.data.success) {
                setPlans(r.data.data)
            }
        })
        .catch((e) => {
            console.log(e)
        });
    }

    const getClasses = (locationId) => {
        if(locationId !== ""){
            axios.get(`/location/${locationId}/classes/`)
            .then((r) => {
                if (r.data.success) {
                    setClasses(r.data.data)
                }
            })
            .catch((e) => {
                console.log(e)
            }            
            );}
    }

    const handleLocationChange = (e) => {
        const locationId = e.target.value;
        setSelectedLocation(locationId);
        localStorage.setItem('selectedLocation', locationId);
    }

    return (
        <Layout>
           <div className="row justify-content-md-center">
                <div className="col-12">
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <div className="container-fluid">
                            <a className="navbar-brand" href="#">Health Management System</a> 
                            <div className="d-flex">
                                <select
                                    className="form-select me-2"
                                    aria-label="Default select example"
                                    value={selectedLocation}
                                    onChange={(e) => {
                                        handleLocationChange(e);
                                        getClasses(e.target.value);
                                    }}
                                >
                                    <option key="default" value="">Select location</option>
                                    {locations && locations.map((loc) => {
                                        return (
                                            <option key={loc.id} value={loc.id}>{loc.name}</option>
                                        );
                                    })}
                                </select>
                                <ul className="navbar-nav mb-2 mb-lg-0">
                                    <li className="nav-item"><a className="nav-link" href="#about">About</a></li>
                                    <li className="nav-item"><a className="nav-link" href="#plans">Plans</a></li>
                                    <li className="nav-item">
                                        <a 
                                            className="nav-link"
                                            href="#classes" 
                                            onClick={() => document.getElementById('classes').scrollIntoView({ behavior: 'smooth' })}
                                        >
                                        Classes</a>
                                        </li>
                                        <li className="nav-item">
                                            {user.fname ?
                                                <a onClick={()=>logoutAction()} className="nav-link" aria-current="page" href="#">Logout</a> :
                                                <a className="nav-link" aria-current="page" href="/login">Login</a>
                                            }
                                            </li>

                                </ul>
                            </div>

                        </div>
                    </nav>
                    <br />
                    <h3 className="text-center mb-5">Welcome, {user.fname ? user.fname : "Guest"}!</h3>


                    <div id="about">
                        <AboutUs id="about"/>
                    </div>
                    
                    <div id="plans">
                        <Plans plans={plans}/>
                    </div>
                    
                    <div id="classes">
                    <h2 className="text-center my-5">Upcoming Classes</h2>
                    {selectedLocation ? (
                        <div className="container pb-5">
                            <div className="border p-3">
                            <Classes classes={classes} />
                            </div>
                        </div>
                        ) : (
                        <h4 className="text-center my-5" style={{ fontFamily: 'Arial', fontSize: '20px', color: 'red' }}><i>Please select a location to view class schedule</i></h4>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
   
export default Dashboard;