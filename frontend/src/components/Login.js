import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';

import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import CheckButton from 'react-validation/build/button';

import { login } from '../actions/auth';

const required = (value) => {
    if (!value) {
        return (
        <div className="alert alert-danger" role="alert">
            This field is required!
        </div>
        );
    }
};

const Login = (props) => {
    let navigate = useNavigate();
    
    const form = useRef();
    const checkBtn = useRef();

    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { isLoggedIn } = useSelector(state => state.auth);
    const { message } = useSelector(state => state.message);

    const dispatch = useDispatch();

    const onChangePhone = (e) => {
        const phone = e.target.value;
        setPhone(phone);
    };

    const onChangePassword = (e) => {
        const password = e.target.value;
        setPassword(password);
    };

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        form.current.validateAll();

        if (checkBtn.current.context._errors.length === 0) {
            dispatch(login(phone, password))
            .then(() => {
                navigate('/');
                // window.location.reload();
            })
            .catch(() => {
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            return <Navigate to="/" />;
        }
    }, [isLoggedIn]);

    return (
        <div className="col-md-12">
            <div className="card card-container border-0">
                <Form onSubmit={handleLogin} ref={form}>
                    <div className="form-group">
                        <label htmlFor="phone">Phone</label>
                        <Input
                            type="text"
                            className="form-control"
                            name="phone"
                            value={phone}
                            onChange={onChangePhone}
                            validations={[required]}
                        />
                    </div>
                    <br />
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <Input
                            type="password"
                            className="form-control"
                            name="password"
                            value={password}
                            onChange={onChangePassword}
                            validations={[required]}
                        />
                    </div>
                    <br />
                    <div className="form-group">
                        <button className="btn btn-primary btn-block" disabled={loading}>
                            { loading && (<span className="spinner-border spinner-border-sm"></span>) }
                            <span>Login</span>
                        </button>
                    </div>

                    { message && (
                        <div className="form-group">
                            <div className="alert alert-danger" role="alert">
                                {message}
                            </div>
                        </div>
                    )}
                    <CheckButton style={{ display: 'none' }} ref={checkBtn} />
                </Form>
            </div>
        </div>
    );
};

export default Login;