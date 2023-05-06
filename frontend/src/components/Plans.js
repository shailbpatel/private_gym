import React from 'react';
// import './Plans.css';

function Plans({ plans }) {
  return (<>
    <h2 className="text-center my-5">Memberships</h2>
    <div className="row row-cols-1 row-cols-md-2 g-4">
      {plans.map((plan) => (
        <div className="col" key={plan.name}>
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">{plan.name}</h5>
              <p className="card-text">${plan.price} ({plan.duration} days)</p>
            </div>
          </div>
        </div>
      ))}
    </div>
    </>
  );
  
}

export default Plans;