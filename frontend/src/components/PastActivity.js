import React from 'react';
import { Table } from 'antd';
import { groupBy } from 'lodash';

function PastActivity({ pastActivity }) {
  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Class',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
    },
  ];

  const expandedRowRender = (record) => {
    if (record.usage) {
      var usageData = record.usage.map((item, index) => ({
        key: `usage_${index}`,
        name: item.name,
      }));
  
      const columns = [
        { title: 'Equipments used', dataIndex: 'name', key: 'name' },
      ];
  
      console.log(record);
      if (record.checkout) {
        usageData.push({
          key: 'checkout',
          name: `Checked Out at ${record.checkout}`,
        });
      }
  
      return (
        <Table
          dataSource={usageData}
          columns={columns}
          pagination={false}
        />
      );
    }
  };
  
  

  const groupByDate = groupBy(pastActivity, (item) => new Date(item.time).toLocaleDateString());
  const tableData = [];
  for (const date in groupByDate) {
    if (groupByDate.hasOwnProperty(date)) {
      const classes = groupByDate[date];
      for (let i = 0; i < classes.length; i++) {
        const item = classes[i];
        tableData.push({
          key: `${date}_${i}`,
          date: date,
          location: item.location,
          name: item.name,
          time: new Date(item.time).toLocaleTimeString(),
          usage: item.usage,
        });
      }
    }
  }

  return (
    <Table
      dataSource={tableData}
      columns={columns}
      expandedRowRender={expandedRowRender}
      pagination={false}
    />
  );
}

export default PastActivity;
