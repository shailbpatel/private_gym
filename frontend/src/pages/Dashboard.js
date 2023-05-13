import React,{ useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom"
import Layout from "../components/Layout"
import AboutUs from "../components/AboutUs"
import Plans from "../components/Plans"
import Classes from "../components/Classes"
import CheckInOut from "../components/CheckInOut"
import EnrollNewMember from "../components/EnrollNewMember"
import Analytics from "../components/Analytics"
import UpcomingClasses from "../components/UpcomingClasses"
import PastActivity from "../components/PastActivity"
import LogActivity from "../components/LogActivity"
import {Image,Heading} from "@chakra-ui/react";
import BottomNavBar from "../components/BottomNavigationBar";


function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState({})
    const [locations, setLocations] = useState([])
    const [selectedLocation, setSelectedLocation] = useState(localStorage.getItem('selectedLocation') || "")
    const [plans, setPlans] = useState([])
    const [classes, setClasses] = useState([]);
    const [enrolledClasses, setEnrolledClasses] = useState([]);
    const [componentToDisplay, setComponentToDisplay] = useState('homepage');
    const [pastActivity, setPastActivity] = useState([]);


    useEffect(()=>{
        if(localStorage.getItem('token') !== ""){
            getUser();
        }   
            getLocations();
            getPlans();
            getClasses(selectedLocation);
            getEnrolledClasses();
            getPastActivity();
    },[]) // eslint-disable-line react-hooks/exhaustive-deps
 
    const getPastActivity = () => {
        axios.get('users/past_activity', { headers:{Authorization: 'Token ' + localStorage.getItem('token')}})
        .then((res) => {
            const data = res.data;
            if(res.data.success) {
                setPastActivity(data.data);
            }
        })
    };

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
        console.log('localStorage');
        axios.post('users/logout',{}, { headers:{Authorization: 'Token ' + localStorage.getItem('token')}})
        .then((r) => {
            localStorage.removeItem('token');
            setUser({});
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

    const enrolledClassesCallback = (revisedClasses) => {
        const updatedClasses = classes.map((cls) => {
          const matchingEnrolledClass = revisedClasses.find((enrolledCls) => enrolledCls.id === cls.id);
          if (matchingEnrolledClass) {
            return matchingEnrolledClass;
          } else {
            return cls;
          }
        });
        setClasses(updatedClasses);
        setEnrolledClasses(revisedClasses);
      };
      

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

    const getEnrolledClasses = () => {
        axios.get('/users/classes', { headers:{Authorization: 'Token ' + localStorage.getItem('token')}})
        .then((r) => {
            if (r.data.success) {
                setEnrolledClasses(r.data.data)
            }
        })
        .catch((e) => {
            console.log(e)
        });
    }

    const handleLocationChange = (e) => {
        const locationId = e.target.value;
        setSelectedLocation(locationId);
        localStorage.setItem('selectedLocation', locationId);
    }

    const handleSelectChange = (event) => {
        setComponentToDisplay(event.target.value);
    };


    return (
        <Layout>
           <div className="row justify-content-md-center">
                <div className="col-12" style={{backgroundColor:'#ebefcc'}}>
                    <nav className="navbar navbar-expand-lg navbar-dark fixed-top">
                        <div className="container-fluid">
                            <Image className="navbar-brand" src='./san-jose-state-spartans.svg' h="5%" w="3%"/>
                            <a className="navbar-brand" href="#">SPARTAN GYM</a>
                            <div className="d-flex">
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
                                            {user.id ?
                                                <button type="button" className="btn btn-outline-warning" onClick={()=> {logoutAction(); window.location.href = "#" }} aria-current="page">Logout</button> :
                                                <button type="button" className="btn btn-warning" aria-current="page" onClick={() => window.location.href = "/login"}>Login</button>
                                            }
                                            </li>

                                </ul>
                            </div>

                        </div>
                    </nav>
                    <br />

                    <h3 className="text-center welcome-text"></h3>
                    <div>
                    <Heading fontSize='xl' textAlign="center">Hello Spartan {user.fname ? user.fname : "Guest"}!</Heading>
                    </div>
                    <div className="text-center" style={{height: 100 + "px"}}>
                       Let's Catch Up :&nbsp;
                        <select className="border" value={componentToDisplay} onChange={handleSelectChange}>
                            <option value="homepage">Homepage</option>
                            {user.role === "admin" &&
                            <>
                                <option value="checkInOut">Clock-in/Clock-out</option>
                                <option value="enrollNewMember">Enroll as member</option>
                                <option value="analytics">View analytics</option>
                            </>
                            }
                            {user.role === "member" &&
                            <>
                                <option value="upcomingClasses">View upcoming classes</option>
                                <option value="pastActivity">Past Activity</option>
                                <option value="logActivity">Log Activity</option>
                            </>
                            }
                        </select>
                    </div>

                    <br />
                    {componentToDisplay === "homepage" && 
                        <>
                            <div id="plans">
                                <Plans plans={plans}/>
                            </div>
                            <div id="about" style={{height: 280 + "px"}}>
                                <AboutUs id="about"/>
                            </div>

                            <div id="classes">
                            <h2 className="text-center my-5">Check Current Classes</h2>
                            <div className="container">
                            <div className="text-center">
                            <select
                                    className="form-select me-2 form-select-sm"
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
                                </select></div>
                            {selectedLocation ? (
                                <div className="pb-5">
                                    <div className="border p-3"  style={{ backgroundColor: '#74e8b4'}}>
                                    <Classes user={user} classes={classes} enrolledClasses={enrolledClasses} enrolledClassesCallback={enrolledClassesCallback}/>
                                    </div>
                                </div>
                                ) : (
                                <h4 className="text-center my-5" style={{ fontFamily: 'Arial', fontSize: '20px', color: 'red' }}><i>Please select a location to view class schedule</i></h4>
                                )}
                            </div></div>
                        </>
                    }
                    {user.id && componentToDisplay === "checkInOut" &&
                        <CheckInOut locationId={selectedLocation} />
                    }
                    {user.id && componentToDisplay === "enrollNewMember" &&
                        <EnrollNewMember plans={plans}/>
                    }
                    {user.id && componentToDisplay === "analytics" &&
                        <Analytics gymList={locations} locationId={selectedLocation}/>
                    }
                    {user.id && componentToDisplay === "upcomingClasses" &&
                        <UpcomingClasses enrolledClasses={enrolledClasses} />
                    }
                    {user.id && componentToDisplay === "pastActivity" &&
                        <PastActivity pastActivity={pastActivity} />
                    }
                    {user.id && componentToDisplay === "logActivity" &&
                        <LogActivity />
                    }
                </div>
            </div>
            <BottomNavBar/>
        </Layout>
    );
}
   
export default Dashboard;