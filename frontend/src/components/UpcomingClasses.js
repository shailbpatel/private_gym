import React from 'react';

function UpcomingClasses({ props }) {
  const today = new Date();

  // Filter classes that start from today or later
  const upcomingClasses = props.enrolledClasses.filter((cls) => {
    const classDate = new Date(cls.time);
    return classDate >= today;
  });

  return (
    <h3>Upcoming classes</h3>
  );
}

export default UpcomingClasses;
