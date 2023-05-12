import {React, useEffect } from 'react'
import LineChart from './lineChart';

   
function Analytics(props) {

    const convertedData = props.gymList.map(item => ({
        label: item.name,
        value: item.id.toString()
      }));

    return(
        <>
        <div className="container">Analytics component</div>
        <LineChart gymList={convertedData} locationId={props.locationId}/>
        </>
    )
}
   
export default Analytics;