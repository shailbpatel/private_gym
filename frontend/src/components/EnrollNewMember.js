import React, { useState } from 'react'
import axios from 'axios'

function EnrollNewMember(props) {
  const [phone, setPhone] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [selectedPlanId, setSelectedPlan] = useState('');

  const handlePlanChange = (event) => {
    setSelectedPlan(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault()
    setErrorMessage('')

    axios.post('/users/enroll_member/', {
        phone: phone,
        role: 1,
        plan_id: selectedPlanId
    })
    .then(response => {
        if(response.data.success) {
            setErrorMessage('')
            setSuccessMessage('Member enrolled successfully!')
            setPhone('')
        } else {
            setSuccessMessage('')
            setErrorMessage(response.data.error)
        }
    })
    .catch(error => {
        setSuccessMessage('')
        setErrorMessage('Failed to enroll member. Please try again.')
        console.error('Failed to enroll member', error)
    })
  }

  return(
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
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="phoneInput">Phone:</label>
          <input type="tel" className="form-control" id="phoneInput" placeholder="Enter phone" value={phone} onChange={e => setPhone(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="plan">Membership Plan</label>
          <select className="form-control" id="plan" value={props.plans[selectedPlanId]} onChange={handlePlanChange}>
            <option value="">Select Plan</option>
            {props.plans.map((plan) => (
              <option key={plan.name} value={plan.id}>{plan.name}</option>
            ))}
          </select>
        </div>
        <p></p>
        <button type="submit" className="btn btn-primary">Enroll</button>
      </form>
    </div>
  )
}
   
export default EnrollNewMember;