import React from 'react';
import Button from 'react-bootstrap/Button';
// import posed from 'react-pose';

import './helpPopup.css';


// const Box = posed.div((
// 	{
// 		hidden: { opacity: 0, transition: { duration: 1000 } },
// 		visible: { opacity: 1, transition: { duration: 1000 } }
// 	}
//   ))
// <Box className="box helpBox testBox" pose={props.isVisible ? 'visible' : 'hidden'} />;
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