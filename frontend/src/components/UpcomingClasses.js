import React from 'react';
import { List, Typography } from 'antd';

const { Title } = Typography;

function UpcomingClasses({ props }) {
  const today = new Date();

  // Filter classes that start from today or later
  const upcomingClasses = props.enrolledClasses.filter((cls) => {
    const classDate = new Date(cls.time);
    return classDate >= today;
  });

  return (
    <div>
      <Title level={3}>Upcoming Classes</Title>
      {upcomingClasses.length > 0 ? (
        <List
          dataSource={upcomingClasses}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={item.name}
                description={`Instructor: ${item.instructor} | Date: ${new Date(
                  item.time
                ).toLocaleDateString()} | Time: ${new Date(
                  item.time
                ).toLocaleTimeString()}`}
              />
            </List.Item>
          )}
        />
      ) : (
        <p>No upcoming classes.</p>
      )}
    </div>
  );
}

export default UpcomingClasses;
