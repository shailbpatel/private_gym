import React,{ useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from "react-router-dom"
import Layout from "../components/Layout"
  
function Login() {
    const navigate = useNavigate();
    const [phone, setPhone] = useState("")
    const [password, setPassword] = useState("")
    const [validationErrors, setValidationErrors] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
 
    useEffect(()=>{
        if(localStorage.getItem('token') !== "" && localStorage.getItem('token') !== null){
            navigate("/");
        }
    },[]) // eslint-disable-line react-hooks/exhaustive-deps
 
    const loginAction = (e) => {
        setValidationErrors("")
        e.preventDefault();
        setIsSubmitting(true)
        let payload = {
            phone: phone,
            password: password
        }
        axios.post('/users/login', payload)
        .then((r) => {
            setIsSubmitting(false)
            localStorage.setItem('token', r.data.data.token)
            navigate("/");
        })
        .catch((e) => {
            setIsSubmitting(false)
            if (e.response.data.error !== undefined) {
                setValidationErrors(e.response.data.error);
            }
        });
    }
 
     
    return (
        <Layout>
            <div className="login-card">
            <div className="row justify-content-md-center mt-5">
                <div className="col-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title mb-4">Sign In</h5>
                            <form onSubmit={(e)=>{loginAction(e)}}>
                                {validationErrors !== "" &&
                                     <p className='text-center '><small className='text-danger'>{validationErrors}</small></p>
                                }
                                
                                <div className="mb-3">
                                    <label 
                                        htmlFor="phone"
                                        className="form-label">
                                            Phone
                                    </label>
                                    <input 
                                        type="tel"
                                        className="form-control"
                                        id="phone"
                                        name="phone"
                                        value={phone}
                                        onChange={(e)=>{setPhone(e.target.value)}}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label 
                                        htmlFor="password"
                                        className="form-label">Password
                                    </label>
                                    <input 
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        name="password"
                                        value={password}
                                        onChange={(e)=>{setPassword(e.target.value)}}
                                    />
                                </div>
                                <div className="d-grid gap-2">
                                    <button 
                                        disabled={isSubmitting}
                                        type="submit"
                                        className="btn btn-warning btn-block">Login</button>
                                    <p className="text-center">Don't have account? <Link to="/register">Register here</Link></p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div></div>
        </Layout>
    );
}
   
export default Login;