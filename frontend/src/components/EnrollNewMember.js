import React, { useState } from 'react'
import axios from 'axios'
import {Image} from "@chakra-ui/react";

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
      <div className="d-flex justify-content-around">
          <div>
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
                  <div className="form-group" style={{width: 400 + "px"}}>
                      <label htmlFor="phoneInput">Phone:</label>
                      <input type="tel" className="form-control" id="phoneInput" placeholder="Enter phone" value={phone} onChange={e => setPhone(e.target.value)} />
                  </div>
                  <div className="form-group" style={{width: 400 + "px"}}>
                      <label htmlFor="plan">Membership Plans</label>
                      <select className="form-control" id="plan" value={props.plans[selectedPlanId]} onChange={handlePlanChange}>
                          <option value="">Select Plan</option>
                          {props.plans.map((plan) => (
                              <option key={plan.name} value={plan.id}>{plan.name}</option>
                          ))}
                      </select>
                  </div>
                  <p></p>
                  <button type="submit" className="btn btn-warning">Enroll</button>
              </form>
          </div>
          <Image align='center-right' src='./gym_enrollment.svg' h="5%" w="30%"/>
      </div>

  )
}
   
export default EnrollNewMember;