import React from 'react';
import Layout from '../components/Layout';
import {Image} from '@chakra-ui/react'
function AboutUs() {
  return (
    <Layout>
      <div className="container">
        <div className="row">
          <div className="col-lg-8 mx-auto">
            {/*<h2 className="text-center">Spartan GYM</h2>*/}
            <Image src='./San_Jose_State_University_logo.svg' h="80%" w="100%"/>
            {/*<p>Some may call it a tagline, but for us, it’s a way of life. It’s our Monday-thru-every-day mantra. An unfiltered philosophy that drives us to create a community and a gym for all.*/}
            {/*<br /><br />No judgments means room for everyone, regardless of shape, size, age, race, gender or fitness level. No matter your workout of choice, we want you to feel good while reaching your goals.</p>*/}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AboutUs;
