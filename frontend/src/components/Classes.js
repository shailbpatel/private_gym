import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../css/Classes.css"

function Classes(props) {
  const formatDate = (date) => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = daysOfWeek[date.getDay()];
    const month = date.toLocaleString('default', { month: 'long' });
    const dayOfMonth = date.getDate();
    const year = date.getFullYear();

    return `${dayOfMonth} ${month} ${year}`;
  };

  const enrollInClass = (cls) => {
    const authToken = localStorage.getItem('token');
    axios.post('users/enroll_class/', { "class_id": cls.id }, { headers: { Authorization: `Token ${authToken}` }})
      .then((response) => {
        if(response.data.success) {
          props.enrolledClassesCallback(response.data.data)
        }
      })
      .catch((error) => {
        console.error('Failed to enroll in class', cls.name, error);
      });
  };

  const formatTime = (time) => {
    const date = new Date(time);
    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = date.getHours() >= 12 ? 'pm' : 'am';

    return `${hours}:${minutes} ${ampm}`;
  };

  const renderClassCard = (cls) => {
    const instructorName = cls.instructor ? cls.instructor : 'No Instructor';
    const isEnrolled = props.enrolledClasses.some((enrolledClass) => enrolledClass.id === cls.id);

    return (
      <div className="card mb-3">
        <div className="card-header" style={{ backgroundColor: '#443C68', color: 'white' }}>
        {cls.name}
        </div>
        <div className="card-body">
          <h5 className="card-title">{formatTime(cls.time)}</h5>
          <p className="card-text">
            <i className="bi bi-person instructor-name"></i> {instructorName}
          </p>
          <p><i>spots left: {cls.spots_left}</i></p>
          {isEnrolled ? (
          <h6 className="text-success">Already enrolled</h6>
        ) : (<>
          {props.user && props.user.role === "member" ? (
          <>
          <button
            className="btn"
            style={{ backgroundColor: '#443C68', color: 'white' }}
            onClick={() => enrollInClass(cls)}
          >
            Enroll
          </button>
          </>) : (<></>)
          }
          </>
        )}
        </div>
      </div>
    );
  };
  

  const renderClassColumn = (date) => {
    const classesOnDate = props.classes.filter((cls) => {
      const clsDate = new Date(cls.time);
      return clsDate.getFullYear() === date.getFullYear() &&
        clsDate.getMonth() === date.getMonth() &&
        clsDate.getDate() === date.getDate();
    });
    return (
      <div className="col" key={date}>
        <h5>{formatDate(date)}</h5>
        {classesOnDate.map((cls) => (
        <div key={cls.id} style={{width: 150 + "px"}}>{renderClassCard(cls)}</div>
      ))}
      </div>
    );
  };

  const today = new Date();
  const dates = Array.from({ length: 7 }, (_, i) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + i));

  return (
    <>
    <div className="col d-flex justify-content-center">
      {dates.map((date) => renderClassColumn(date))}
    </div>
    </>
  );
}

export default Classes;
