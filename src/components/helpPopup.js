import React from 'react';
import Button from 'react-bootstrap/Button';

import './helpPopup.css';


function HelpPopup(props) {

	return (<React.Fragment>
			<div className='helpBox'>
				<div className='helpBoxHeader'>
					<h3>DjangoVerse help {props.numHelp}</h3> 
					<div className="HelpBoxHr"></div>
				</div>
			
				<div className='helpBoxBody'>
					<p>{props.body}</p>
				</div>

				<div className='helpBoxFooter'>
					<Button variant="success" onClick={props.handleClose}>
			            Got it!
		          </Button>
				</div>
				
			</div>

		</React.Fragment>)
}

export default HelpPopup;