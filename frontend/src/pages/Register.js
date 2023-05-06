import React,{ useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useNavigate } from "react-router-dom"
import Layout from "../components/Layout"
  
function Register() {
    const navigate = useNavigate();
    const [phone, setPhone] = useState("")
    const [first_name, setFirstName] = useState("")
    const [last_name, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [validationErrors, setValidationErrors] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
 
    useEffect(()=>{
        if(localStorage.getItem('token') !== "" && localStorage.getItem('token') !== null){
            navigate("/");
        }
    },[]) // eslint-disable-line react-hooks/exhaustive-deps
 
    const registerAction = (e) => {
        e.preventDefault();
        setIsSubmitting(true)
        let payload = {
            phone: phone,
            first_name: first_name,
            last_name: last_name,
            email:email,
            password:password,
            password_confirmation:confirmPassword
        }
        axios.post('/users/signup', payload)
        .then((r) => {
            if(r.status === 200) {
                setIsSubmitting(false)
                localStorage.setItem('token', r.data.token)
                navigate("/");
            } else {
                setIsSubmitting(false)
                setValidationErrors(r.data.error)
            }
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
            <div className="row justify-content-md-center mt-5">
                <div className="col-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title mb-4">Register</h5>
                            {validationErrors !== "" &&
                                        <div className="flex flex-col">
                                            <small  className="text-danger">
                                            {validationErrors}
                                            </small >
                                        </div>
                                    }
                            <form onSubmit={(e)=>registerAction(e)}>
                                <div className="mb-3">
                                    <label 
                                        htmlFor="first_name"
                                        className="form-label">First Name
                                    </label>
                                    <input 
                                        type="text"
                                        className="form-control"
                                        id="first_name"
                                        name="first_name"
                                        value={first_name}
                                        onChange={(e)=>{setFirstName(e.target.value)}}
                                    />
                                    <label 
                                        htmlFor="last_name"
                                        className="form-label">Last Name
                                    </label>
                                    <input 
                                        type="text"
                                        className="form-control"
                                        id="last_name"
                                        name="last_name"
                                        value={last_name}
                                        onChange={(e)=>{setLastName(e.target.value)}}
                                    />
                                    <label 
                                        htmlFor="phone"
                                        className="form-label">Phone
                                    </label>
                                    <input 
                                        type="text"
                                        className="form-control"
                                        id="phone"
                                        name="phone"
                                        value={phone}
                                        onChange={(e)=>{setPhone(e.target.value)}}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label 
                                        htmlFor="email"
                                        className="form-label">Email address
                                    </label>
                                    <input 
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        name="email"
                                        value={email}
                                        onChange={(e)=>{setEmail(e.target.value)}}
                                    />
                                    {validationErrors.email !== undefined &&
                                        <div className="flex flex-col">
                                            <small  className="text-danger">
                                            {validationErrors.email[0]}
                                            </small >
                                        </div>
                                    }
                                     
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
                                        onChange={(e)=>setPassword(e.target.value)}
                                    />
                                    {validationErrors.password !== undefined &&
                                        <div className="flex flex-col">
                                            <small  className="text-danger">
                                            {validationErrors.password[0]}
                                            </small >
                                        </div>
                                    }
                                </div>
                                <div className="mb-3">
                                    <label 
                                        htmlFor="confirm_password"
                                        className="form-label">Confirm Password
                                    </label>
                                    <input 
                                        type="password"
                                        className="form-control"
                                        id="confirm_password"
                                        name="confirm_password"
                                        value={confirmPassword}
                                        onChange={(e)=>setConfirmPassword(e.target.value)}
                                    />
                                </div>
                                <div className="d-grid gap-2">
                                    <button 
                                        disabled={isSubmitting}
                                        type="submit"
                                        className="btn btn-primary btn-block">Register Now
                                    </button>
                                    <p 
                                        className="text-center">Have already an account <Link to="/">Login here</Link>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
   
export default Register;