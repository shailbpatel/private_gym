import {React, useEffect } from 'react'
import CheckinChart from './CheckinChart';
import HoursInGym from './HoursInGym';
import EnrollmentChart from './EnrollmentChart';

   
function Analytics(props) {

    const convertedData = props.gymList.map(item => ({
        label: item.name,
        value: item.id.toString()
      }));

    return(
        <div className="d-flex">
        <CheckinChart gymList={convertedData} locationId={props.locationId}/>
        <HoursInGym gymList={convertedData} locationId={props.locationId}/>
        <EnrollmentChart gymList={convertedData} locationId={props.locationId}/>
        </div>
    )
}
   
export default Analytics;