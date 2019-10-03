import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import './modalBoxes.css';

function ModalDVInfo(props) {

  return (
    <React.Fragment>
      <Modal 
      show={props.show} 
      onHide={props.handleClose}
      size="lg"
      dialogClassName="modal-custom-width"
      aria-labelledby="contained-modal-title-vcenter"
      >

        <Modal.Header closeButton>
          <Modal.Title>What is this?</Modal.Title>
        </Modal.Header>
        <Modal.Body>

        <div className="DVInfoBody">
          <h2>The DjangoVerse</h2>
          <p>The DjangoVerse is a 3D graph of players in the Gypsy Jazz scene around the world.</p>
          <p>The different colours correspond to different countries. Two players are linked if they have gigged together.</p>
          <p>Some things you can do with the DjangoVerse are:</p>
          <ul>
          <li><b>On desktop:</b> hover over a player to get the country they're based in, and click on them to zoom in</li>
          <li><b>On mobile:</b> click once on a player to get the country they're based in, and click a second time to zoom in</li>
          <li>Use the search box the nagivation bar to find and zoom in to a specific player.</li>
          <li>Click the "Toggle Filter" button in the navigation bar to filter the players: only display specific countries and instruments.</li>
          </ul>
        </div>

        <div className="DVInfoHr"></div>

        <div className="DVInfoBody">
        <h2>Add Players</h2>
          <p>
          You can <a href="http://www.londondjangocollective.com/djangoverse/forms/player/add" target="_parent"  rel="noopener noreferrer">add players</a> to this yourself, or <a href="http://www.londondjangocollective.com/djangoverse/forms/player/list" target="_parent"  rel="noopener noreferrer">edit existing players</a>. 
          You can add information such as:
          </p>
          <ul>
          <li>What they play and who they've gigged with</li>
          <li>Which country they're based in</li>
          <li>A short description of who they are</li>
          <li>A picture of them</li>
          <li>A youtube video of them playing</li>
          <li>A URL to their website</li>
          </ul>
          <p>You can also <a href="http://www.londondjangocollective.com/djangoverse/forms/instrument/add" target="_parent"  rel="noopener noreferrer">add</a> or <a href="http://www.londondjangocollective.com/djangoverse/forms/instrument/list" target="_parent"  rel="noopener noreferrer">edit</a> instruments.</p>
        </div>

        <div className="DVInfoHr"></div>

        <div className="DVInfoBody">
          
          <p>
          The DjangoVerse is a project by the <a href="http://londondjangocollective.com/" target="_parent" rel="noopener noreferrer">London Django Collective</a>
          </p>
          <div>


          </div>
        </div>

        <div className="DVInfoBody">
          <h2>Contribute</h2>
          <p>
          Send any feedback, bugs, or other to jeremie.coullon@gmail.com. You can open an issue or make a pull request on  <a href="https://github.com/jeremiecoullon/DjangoVerse-react" target="_parent"  rel="noopener noreferrer">Github</a>
          </p>
        </div>


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

export default ModalDVInfo;