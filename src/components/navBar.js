import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Search from './search';
import Button from 'react-bootstrap/Button';

import './navbar.css';

function NavBar(props) {
  return (<React.Fragment>
      <Navbar className="lenavbar" expand="lg" variant="dark" onToggle={props.handleNavCloseNodeInfo}>
        <a onClick={props.reloadGraphCurrentParams} target="_parent" className="navbar-brand navbar-LDC" id="LDC-in-navbar">DjangoVerse</a>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
          <div className='navbar-links'>
            <Button variant="outline-primary" className="navbar-buttons" onClick={props.handleModalDVInfoShow}>
              What is this?
            </Button>
          </div>
          <div className='navbar-links'>
            <Button variant="outline-primary" className="navbar-buttons" onClick={props.handleModalFilterShow}>
              Filter DjangoVerse
            </Button>
          </div>
          <div className='navbar-links'>
            <Button variant="outline-primary" className="navbar-buttons" href="http://www.londondjangocollective.com/">
              Back to LDC
            </Button>
          </div>
          </Nav>
          <Search selectedOption={props.selectedOption} searchList={props.searchList} handleChange={props.handleChange}/>
        </Navbar.Collapse>
      </Navbar>
    </React.Fragment>)
 }


export default NavBar;