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

  const formatTime = (time) => {
    const date = new Date(time);
    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = date.getHours() >= 12 ? 'pm' : 'am';

    return `${hours}:${minutes} ${ampm}`;
  };

  const renderClassCard = (cls) => {
    const instructorName = cls.instructor ? cls.instructor : 'No Instructor';
    return (
      <div className="card mb-3">
        <div className="card-header" style={{ backgroundColor: '#007bff', color: 'white' }}>
          {formatTime(cls.time)}
        </div>
        <div className="card-body">
          <h5 className="card-title">{cls.name}</h5>
          <p className="card-text">
            <i className="bi bi-person instructor-name"></i> {instructorName}
          </p>
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
      <div className="col">
        <h5>{formatDate(date)}</h5>
        {classesOnDate.map((cls) => renderClassCard(cls))}
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
