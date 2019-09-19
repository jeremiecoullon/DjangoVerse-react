import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Search from './search';
import Switch from 'react-switch';


function NavBar(props) {
  return (<React.Fragment>
      <Navbar className="lenavbar" expand="lg" variant="dark">
        <a href="http://londondjangocollective.com" target="_parent" class="navbar-brand navbar-LDC" id="LDC-in-navbar">DjangoVerse</a>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <p className="navbar-links fa fa-question-circle DVInfoButton" onClick={props.handleModalDVInfoShow}> What is this?</p>
            <p className="navbar-links fa"><span className="toggleFilterSpan">Toggle Filter:</span> <Switch className="navbar-switch-button" onChange={props.handleToggleFilter} checked={props.toggleFilter} /></p>
          </Nav>
          <Search selectedOption={props.selectedOption} searchList={props.searchList} handleChange={props.handleChange}/>
        </Navbar.Collapse>
      </Navbar>
    </React.Fragment>)
 }


export default NavBar;