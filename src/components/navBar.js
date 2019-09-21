import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Search from './search';
import Button from 'react-bootstrap/Button';

import logo_small from '../img/logo_small.png';
import './navbar.css';

// <Button variant="outline-primary" className="navbar-buttons" href="http://www.londondjangocollective.com/">
  // <img src={logo_small} className="LDC_logo"></img>
// </Button>

// <div className='navbar-links'>
  // <a href="http://www.londondjangocollective.com/"><img src={logo_small} className="LDC_logo"></img></a>
// </div>

function NavBar(props) {
  return (<React.Fragment>
      <Navbar className="lenavbar" expand="lg" variant="dark" onToggle={props.handleNavCloseNodeInfo}>
        <a href="http://www.londondjangocollective.com/" className="LDC-navbar"><img src={logo_small} className="LDC_logo"></img></a>
        <a onClick={props.reloadGraphCurrentParams} target="_parent" className="navbar-brand navbar-DV" id="DjangoVerse-title-navbar">DjangoVerse</a>

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
            <Button variant="outline-primary" className="navbar-buttons" href="http://www.londondjangocollective.com/api/forms/player/list">
              Add players
            </Button>
          </div>
          
          </Nav>
          <Search selectedOption={props.selectedOption} searchList={props.searchList} handleChange={props.handleChange}/>
        </Navbar.Collapse>
      </Navbar>
    </React.Fragment>)
 }


export default NavBar;