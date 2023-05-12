import React, { useState, useEffect } from 'react';
import axios from 'axios';

function LogActivity() {
  const [equipmentList, setEquipmentList] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [hours, setHours] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchEquipmentList();
  }, []);

  const fetchEquipmentList = () => {
    const authToken = localStorage.getItem('token');
    axios.get('/equipments', { headers: { Authorization: `Token ${authToken}` } })
      .then((response) => {
        if (response.data.success) {
          setEquipmentList(response.data.data.map((equipment) => equipment.name));
        } else {
          setErrorMessage(response.data.error);
        }
      })
      .catch((error) => {
        setErrorMessage('Failed to fetch equipment list');
        console.error('Failed to fetch equipment list', error);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const authToken = localStorage.getItem('token');
    axios.post('/log_activity', {
      equipment_id: selectedEquipment,
      hours: hours,
    }, { headers: { Authorization: `Token ${authToken}` } })
      .then((response) => {
        if (response.data.success) {
          setSuccessMessage('Activity logged successfully');
          setSelectedEquipment('');
          setHours('');
        } else {
          setErrorMessage(response.data.error);
        }
      })
      .catch((error) => {
        setErrorMessage('Failed to log activity');
        console.error('Failed to log activity', error);
      });
  };

  return (
    <div className="container">
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="equipment">Select Equipment:</label>
          <select
            id="equipment"
            className="form-control"
            value={selectedEquipment}
            onChange={(e) => setSelectedEquipment(e.target.value)}
            required
          >
            <option value="">Select Equipment</option>
            {equipmentList.map((equipment) => (
              <option key={equipment} value={equipment.id}>
                {equipment}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="hours">Number of Hours:</label>
          <input
            type="number"
            id="hours"
            className="form-control"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            required
          />
        </div>
        <p></p>
        <button type="submit" className="btn btn-primary">Log Activity</button>
      </form>
    </div>
  );
}

export default LogActivity;
