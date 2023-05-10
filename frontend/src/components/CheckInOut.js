import React, { useState } from 'react';
import axios from 'axios';

function CheckInOut(props) {
  const [phone, setPhone] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

    const handleCheckIn = (event) => {
        event.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        axios.post('/checkin/', {
        user_phone: phone,
        location_id: parseInt(props.locationId),
        }, {
        headers: {
            Authorization: `Token ${localStorage.getItem('token')}`,
        },
        })
        .then(response => {
            if (response.data.success) {
                setErrorMessage(response.data.error);
                setSuccessMessage('Check-in successful');
                setPhone('');
            } else {
                setSuccessMessage('');
                setErrorMessage(response.data.error);
            }
        })
        .catch(error => {
            setErrorMessage(error.response.data.error);
        });
    }

    const handleCheckOut = (event) => {
        event.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        axios.post('/checkout/', {
        user_phone: phone,
        location_id: parseInt(props.locationId),
        }, {
        headers: {
            Authorization: `Token ${localStorage.getItem('token')}`,
        },
        })
        .then(response => {
            if (response.data.success) {
                setErrorMessage(response.data.error);
                setSuccessMessage('Check-out successful');
                setPhone('');
            } else {
                setSuccessMessage('');
                setErrorMessage(response.data.error);
            }
        })
        .catch(error => {
            setErrorMessage(error.response.data.error);
        });
    }

  return (
    <div className="container">
      {successMessage &&
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      }
      {errorMessage &&
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      }
      <form>
        <div className="form-group" style={{width: 400 + "px"}}>
          <label htmlFor="phoneInput">Phone:</label>
          <input type="tel" className="form-control" id="phoneInput" placeholder="Enter phone" value={phone} onChange={e => setPhone(e.target.value)} />
        </div>
        <p></p>
        <button type="submit" className="btn btn-warning" onClick={handleCheckIn}>Check In</button>
        &nbsp;
        <button type="submit" className="btn btn-outline-warning" onClick={handleCheckOut}>Check Out</button>
      </form>
    </div>
  );
}

export default CheckInOut;