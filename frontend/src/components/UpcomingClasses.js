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

  // Group classes by date
  const classesByDate = enrolledClasses.reduce((acc, cls) => {
    const classDate = new Date(cls.time);
    const dateKey = classDate.toDateString();
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(cls);
    return acc;
  }, {});

  // Sort dates in ascending order
  const sortedDates = Object.keys(classesByDate).sort((a, b) => new Date(a) - new Date(b));

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
    }
  ];

  return (
    <div>
      {sortedDates.length === 0 ? (
        <h3 className='text-center'>No upcoming classes</h3>
      ) : (
        sortedDates.map((date) => (
          <div key={date} className='justify-content-center'>
            <h4 className='pl-1'>{new Date(date).toDateString()}</h4>
            <Table
              dataSource={classesByDate[date].map((cls) => ({
                key: cls.id,
                name: cls.name,
                location: cls.location,
                time: formatTime(cls.time),
              }))}
              columns={columns}
              pagination={false}
            />
          </div>
        ))
      )}
    </div>
  );
}

export default UpcomingClasses;
