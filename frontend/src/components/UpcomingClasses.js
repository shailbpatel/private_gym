import React from 'react';
import { Table } from 'antd';

function UpcomingClasses({ enrolledClasses }) {
  const today = new Date();

  const formatTime = (time) => {
    const date = new Date(time);
    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = date.getHours() >= 12 ? 'pm' : 'am';

    return `${hours}:${minutes} ${ampm}`;
  };

  // Filter classes that start from today or later
  const upcomingClasses =
    enrolledClasses &&
    enrolledClasses.filter((cls) => {
      const classDate = new Date(cls.time);
      return classDate >= today;
    });

  const classInfo = enrolledClasses.map((cls) => ({
      name: cls.name,
      time: formatTime(cls.time),
    }));
    
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    }, 
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
    }
  ]


  return (
    <div>
      {upcomingClasses.length === 0 ? <h3 className='text-center'>No upcoming classes</h3> : <div><Table dataSource={classInfo} columns={columns} /></div> }
    </div>
  );
}

export default UpcomingClasses;
