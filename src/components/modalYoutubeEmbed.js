import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import './modalBoxes.css';
import './modalYoutubeEmbed.css';


function ModalYoutubeEmbed(props) {
  return (
    <React.Fragment>
      <Modal 
      show={props.show} 
      onHide={props.handleClose}
      size="lg"
      // dialogClassName="modal-YoutubeEmbed"
      aria-labelledby="contained-modal-title-vcenter"
      >

        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
        	<iframe width="100%" className="youtubeEmbediframe" src={props.YoutubeID} frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleClose}>
            Close
          </Button>
        </Modal.Footer>

      </Modal>
    </React.Fragment>
  );
}

export default ModalYoutubeEmbed;