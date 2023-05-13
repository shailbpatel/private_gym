import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';

const BottomNavBar = () => {
    return (
        <Navbar
            // fixed="bottom"
            bg="dark"
            variant="dark"
            expand="lg"
            className="justify-content-center"
        >
            <Nav>
                <h6 className="text-center">CMPE 202 - NetSpartans</h6>
               </Nav>
        </Navbar>
    );
};

export default BottomNavBar;
