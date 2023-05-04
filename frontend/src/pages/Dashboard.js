import React,{ useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom"
import Layout from "../components/Layout"
  
function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState({})
 
    useEffect(()=>{
        if(localStorage.getItem('token') === "" || localStorage.getItem('token') === null){
            navigate("/");
        }else {
            getUser();
        }
    },[]) // eslint-disable-line react-hooks/exhaustive-deps
 
    const getUser = () => {
        axios.get('users/details', { headers:{Authorization: 'Token ' + localStorage.getItem('token')}})
        .then((r) => {
           setUser(r.data.data)
        })
        .catch((e) => {
            console.log(e)
        });
    }
 
    const logoutAction = () => {
        axios.post('users/logout',{}, { headers:{Authorization: 'Token ' + localStorage.getItem('token')}})
        .then((r) => {
            localStorage.setItem('token', "")
           navigate("/");
        })
        .catch((e) => {
            console.log(e)
        });
    }
     
    return (
        <Layout>
           <div className="row justify-content-md-center">
                <div className="col-12">
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <div className="container-fluid">
                            <a className="navbar-brand" href="#">Dashboard</a> 
                            <div className="d-flex">
                                <ul className="navbar-nav">
                                    <li className="nav-item">
                                        <a onClick={()=>logoutAction()} className="nav-link " aria-current="page" href="#">Logout</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                    <h2 className="text-center mt-5">Welcome, {user.fname}!</h2  >
                </div>
            </div>
        </Layout>
    );
}
   
export default Dashboard;