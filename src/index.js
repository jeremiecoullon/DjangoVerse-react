import React from 'react';
import Select from 'react-select'
import ReactDOM from 'react-dom';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Switch from 'react-switch';
import makeAnimated from 'react-select/animated';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import SpriteText from 'three-spritetext';
import './index.css';
import './navbar.css';
import './MyFontsWebfontsKit.css';

const APIdomain = 'https://londondjangocollective.herokuapp.com/'
// const APIdomain = 'http://localhost:5000/'

function NodeInfo(props) {
  // number of players rendered in the graph that the selected player has gigged with
  const giggedWithLength = props.nodeInfo.node.gigged_with.filter(x => props.arrayNodeIDs.includes(x)).length
	return (
		<div className='box_info' id='node_info'>

    {props.nodeInfo.node.external_URL? (<a href={props.nodeInfo.node.external_URL} target="_blank" rel="noopener">
        <h5 className="node_info_node_name">{props.nodeInfo.node.name} ({props.countryCodes[props.nodeInfo.node.country]})</h5>
      </a>) : (<h5 className="node_info_node_name">{props.nodeInfo.node.name} ({props.countryCodes[props.nodeInfo.node.country]})</h5>)}
      <i>Gigged with {giggedWithLength} players</i>
			<div className="node_info_box">
      {props.nodeInfo.node.thumbnail && <img src={props.nodeInfo.node.thumbnail} className="node_info_image"></img>}
      <br></br>
  			<p>{props.nodeInfo.node.description}</p>
  			<p onClick={props.closeBoxFun}>Close</p>
			</div>
		</div>)
}

function Search(props) {
  const customStyles = {
    control: styles => ({ ...styles, backgroundColor: 'white', 'width': 250}),
  };
  return (<React.Fragment>
      <div className="box_search"> 
      <Select
        value={props.selectedOption}
        options={props.searchList}
        onChange={props.handleChange}
        placeholder= "Search player..."
        openMenuOnClick={false}
        styles={customStyles}
      />
      </div>
    </React.Fragment>)
}


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
          <p>The DjangoVerse is a 3D graph of players in the Gypsy Jazz scene around the world. The different colours correspond to different countries. Two players are linked if they have gigged together.</p>
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
          You can <a href="http://www.londondjangocollective.com/api/forms/player/add" target="_blank" rel="noopener">add players</a> to this yourself, or <a href="http://www.londondjangocollective.com/api/forms/player/list" target="_blank" rel="noopener">edit existing players</a>. 
          You can add information such as:
          </p>
          <ul>
          <li>What they play and who they've gigged with</li>
          <li>A short description of who they are</li>
          <li>A picture of them</li>
          <li>A URL to their website</li>
          </ul>
          <p>You can also <a href="http://www.londondjangocollective.com/api/forms/instrument/add" target="_blank" rel="noopener">add</a> or <a href="http://www.londondjangocollective.com/api/forms/instrument/list" target="_blank" rel="noopener">edit</a> instruments.</p>
        </div>

        <div className="DVInfoHr"></div>

        <div className="DVInfoBody">
          <h2>Contribute</h2>
          <p>
          Send any feedback, bugs, or other to jeremie.coullon@gmail.com. You can open an issue or make a pull request on  <a href="https://github.com/jeremiecoullon/DjangoVerse-react" target="_blank" rel="noopener">Github</a>
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


class FilterGraph extends React.Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);

    this.state = {
      playerOn: true,
      player_country: [],
      list_countries: {
        'player': ['FR',]},

      instrument: [],
      list_instruments: [],

      isActive: 'all',
    }
  }


  async componentDidMount() {
    // ASYNC VERSION
    try {
      const res = await fetch(APIdomain+'api/countries/?format=json');
      const res2 = await fetch(APIdomain+'api/all_instruments/?format=json');
      
      const list_countries = await res.json();
      this.setState({
        list_countries
      });
      const instruments = await res2.json();
      this.setState({
        list_instruments: instruments.instruments
      });
    } catch (e) {
      console.log(e);
    } 
  }
  
  handleSubmit(event) {
    let queryParams = this.state.playerOn ? '&player=on' : ""

    // Player countries: if state is empty array: return empty string (so keep all countries)
    // else: concatenate list of country codes
    const playerCountryQuery = (this.state.player_country === []) ? "" : this.state.player_country.map(x => "&player_country=" + x).join("")
    queryParams = queryParams + playerCountryQuery

    // Instrument: same as player: if empty list, get all instruments. Else, create an array of OR filters
    const playerInstrumentQuery = (this.state.instrument === []) ? "" : this.state.instrument.map(x => "&instrument=" + x).join("")
    queryParams = queryParams + playerInstrumentQuery

    // queryParams = queryParams + ((this.state.instrument !== 'all') ? ('&instrument=' + this.state.instrument) : "")
    queryParams = queryParams + ((this.state.isActive !== 'all') ? ('&active=' + this.state.isActive) : "")

    this.props.reloadGraph(queryParams)
    event.preventDefault();
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    })
  }

  handleCountryChange = selectedOption => {
    // set State to either empty array or list of country codes
    const countryArray = (selectedOption === null)? [] : selectedOption.map(x => x['value']);
    this.setState({
      player_country: countryArray
    })
   }

  handleInstrumentChange = selectedOption => {
    const InstrumentArray = (selectedOption === null)? [] : selectedOption.map(x => x['value']);
    this.setState({
      instrument: InstrumentArray
    });
 }

 handleisActiveChange = selectedOption => {
  this.setState({
    isActive: selectedOption['value']
  })
 }

  render(){

    const animatedComponents = makeAnimated();
    const countryOptions = this.state.list_countries.player.map( x => ({value: x[0], label: x[1]}))
    const instrumentOptions = this.state.list_instruments.map(x => ({value: x, label: x}))
    const activeOtions = [{value: 'all', label: 'All'}, {value: 'True', label: 'Active'}, {value: 'False', label: 'Inactive'}]

    return (<React.Fragment>
      <div id="controls" className="box_info">

      <h3>Filter DjangoVerse</h3>
      <i>Leave empty to select all</i>
      <form onSubmit={this.handleSubmit}>

          <Select
            // defaultValue={[countryOptions[2], countryOptions[3]]}
            isMulti
            components={animatedComponents}
            name="player_country"
            options={countryOptions}
            className="select_margin"
            classNamePrefix="select"
            onChange={this.handleCountryChange}
            placeholder="Countries.."
          />

        <Select
            // defaultValue={[instrumentOptions[2], instrumentOptions[3]]}
            isMulti
            components={animatedComponents}
            name="instrument"
            options={instrumentOptions}
            className="select_margin"
            classNamePrefix="select"
            onChange={this.handleInstrumentChange}
            placeholder="Instruments.."
          />

        <div>        
            <Select
            // defaultValue={[instrumentOptions[2], instrumentOptions[3]]}
            components={animatedComponents}
            name="isactive"
            options={activeOtions}
            className="select_margin"
            classNamePrefix="select"
            onChange={this.handleisActiveChange}
            placeholder="Is active..."
          />
        </div>

        <div>
          <input type="submit" value="Reload" className="select_margin" />
        </div>
      </form>
      </div>
    </React.Fragment>)
  }
}


class DjangoVerse extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			gypsyJazzScene: {'nodes': [], 'links': []},
			queryParams: '&player=on',
			nodeInfo: null,
      selectedOption: null,
      'toggleFilter': false,
      'toggleDVInfo': true,
      list_countries: {
        'player': ['FR',]
      },
		}
    this.handleToggleFilter = this.handleToggleFilter.bind(this);
	}

  async componentDidMount(addLights=true) {
  	// ASYNC VERSION
    try {
      // const res = await fetch('http://localhost:5000/players/?format=json');
      const res = await fetch(APIdomain+'api/D3endpoint/?format=json' + this.state.queryParams);
      const res2 = await fetch(APIdomain+'api/countries/?format=json');
      
      const gypsyJazzScene = await res.json();
      this.setState({
        gypsyJazzScene
      });
      const list_countries = await res2.json();
      this.setState({
        list_countries
      });
    } catch (e) {
      console.log(e);
    }

    // manually set the link distance between nodes
    this.fg.d3Force('link').distance(link => {
      if ((link.target.type === 'festival') || (link.source.type === 'festival')){
          // link distance for festivals depends on number of players and bands played
          let count = link.target.playersplayed.length + link.target.bandsplayed.length
          return 40 + count*2
            // return 150
          }
      else
        {
          let count = link.target.gigged_with.length + link.source.gigged_with.length;
          // it seems that if a node has many connections and if the links are long, then that nodes will end up on the edge
          // of the graph. It would be better to have them in the centre. So maybe define `link_dist` to that 'many connections' ==> 'shorter links'
          // const link_dist = 50 + 1000 * (1/count)
          const link_dist = 150 + 2*count
          return link_dist
        }
    })
    // only add lights if loading data for the first time. 
    // In `reloadGraph()` below: set addLights=false otherwise you keep adding more lights to the scene
    if (addLights === true) {
      this.addLights()  
    }
    }

  reloadGraph(newQueryParams) {
    // Callback: only reload graph after updated params
    this.setState({queryParams: newQueryParams}, () => this.componentDidMount(false));
    const zValue = Math.cbrt(this.state.gypsyJazzScene.nodes.length)*150;
    this.fg.cameraPosition(
      { x: 0, y: 0, z:  zValue}, // reposition the camera
      { x: 0, y: 0, z: 0}, // look at the center
      2500  // ms transition duration
    );
    this.setState({
      nodeInfo: null,
      selectedOption: null,
    });

  }

  


  _handleClick = node => {
    // update state to render NodeInfo
    this.setState({'nodeInfo': {node}})
    // Aim at node from outside it
    let distance = 80
    if (node.type === 'festival'){
        distance = 200;
      }
    // else {
    //   distance = 100
    // }
    const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);

    this.fg.cameraPosition(
      { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
      node, // lookAt ({ x, y, z })
      2500  // ms transition duration
    );
  };

  // skybox(){
    // NEED TO FIX CORS PROBLEM
  //   var directions  = ["https://steemverse.com/img/skyboxes/Stars01/leftImage.png", "https://steemverse.com/img/skyboxes/Stars01/rightImage.png", "https://steemverse.com/img/skyboxes/Stars01/upImage.png", "https://steemverse.com/img/skyboxes/Stars01/downImage.png", "https://steemverse.com/img/skyboxes/Stars01/frontImage.png", "https://steemverse.com/img/skyboxes/Stars01/backImage.png"];
  //   var reflectionCube = new THREE.CubeTextureLoader().load(directions, function(){
  //     reflectionCube.format = THREE.RGBFormat;
  //     this.fg.scene.background = reflectionCube;
  //   });
  // }
  addLights() {
    // this is better lighting than the default
    var light = new THREE.PointLight(0xff0000, 50, 1)
    var ambientLight = new THREE.AmbientLight(0xbbbbbb, 0.15)
    var dirLight  = new THREE.DirectionalLight(0xffffff, 0.6)
    light.position.set(50, 50, 50);
    this.fg.scene().add(light);
    this.fg.scene().add(ambientLight);
    this.fg.scene().add(dirLight);
  }

  handleCloseNodeInfo(){
    this.setState({'nodeInfo': null});
  }

  handleToggleFilter() {
    const currentToggleValue = this.state.toggleFilter;
    this.setState({'toggleFilter': !currentToggleValue})
  }

  handleChangeSearch = selectedOption => {
    this.setState({selectedOption: selectedOption}, () => this._handleClick(selectedOption));
 }

 getNodeSize(node) {
    let nodeSize;
    switch (node.type) {
      case 'player':
        nodeSize = 1
        break;
      case 'band':
        nodeSize = 20
        break;
      case 'festival':
        nodeSize = 140
        break;
      default:
        nodeSize = 5;
    }
    return nodeSize
  }

  lalaFun(node){
    return node.name
  }


// nodeThreeObject={node => {
//   const sprite = new SpriteText(node.name);
//   sprite.color = node.color;
//   sprite.textHeight = 8;
//   return sprite;
// }}

  render() {
    // add 'value' and 'label' to each node
    let searchList = this.state.gypsyJazzScene.nodes.map(obj => {
      obj['value'] = obj.name;
      obj['label'] = obj.name;
      return obj
    })
    // array of node IDs to that NodeInfo can filter 'gigged with' info
    const arrayNodeIDs = this.state.gypsyJazzScene.nodes.map( x => x['id'])
    // define an object converting country codes to country names for when user hovers over a node
    let countryCodes = {}
    this.state['list_countries']['player'].forEach( function (item, index) {
      countryCodes[item[0]] = item[1]
    })

    return (

      <React.Fragment>
        <NavBar 
        selectedOption={this.state.selectedOption} 
        searchList={searchList} 
        handleChange={this.handleChangeSearch}
        handleToggleFilter={() => this.handleToggleFilter()}
        toggleFilter={this.state.toggleFilter}
        handleModalDVInfoShow={() => this.props.handleModalDVInfoShow()}
        />

        {this.state.nodeInfo && <NodeInfo 
          nodeInfo={this.state.nodeInfo} 
          closeBoxFun={() => {this.handleCloseNodeInfo()}} 
          arrayNodeIDs={arrayNodeIDs} 
          countryCodes={countryCodes} />}
        
        {this.state.toggleFilter && <FilterGraph reloadGraph={(newQueryParams) => {this.reloadGraph(newQueryParams)}}/>}

        <ForceGraph3D
          ref={el => { this.fg = el; }}
          graphData={this.state.gypsyJazzScene}
          nodeLabel={node => countryCodes[node['country']]}
          onNodeClick={this._handleClick}
          nodeVal={this.getNodeSize}
          nodeAutoColorBy="country"
          linkWidth={0.7}
          // Note: need to set enableNodeDrag to false so that onNodeClick works on mobile
          enableNodeDrag={false}
          nodeOpacity={1}
          backgroundColor={"black"}

          nodeThreeObject={node => {
            // use a sphere as a drag handle
            const obj = new THREE.Mesh(
              new THREE.SphereGeometry(10),
              new THREE.MeshBasicMaterial({ depthWrite: false, transparent: true, opacity: 0 })
            );
            // add text sprite as child
            const sprite = new SpriteText(node.name);
            sprite.color = node.color;
            sprite.textHeight = 8;
            obj.add(sprite);
            return obj;
          }}
        />
      </React.Fragment>
      );
    }
}

class DVWrapper extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      'toggleDVInfo': true
    }
  }

  handleModalDVInfoShow() {
    this.setState({'toggleDVInfo': true})
  }
  handleModalDVInfoClose() {
    this.setState({'toggleDVInfo': false})
  }

  render() {
    return (<React.Fragment>
          <DjangoVerse handleModalDVInfoShow={() => this.handleModalDVInfoShow()}/>  
          <ModalDVInfo show={this.state.toggleDVInfo} handleClose={() => this.handleModalDVInfoClose()} />,
        </React.Fragment>)
  }
}


ReactDOM.render(
	// <DjangoVerse/>,
  <DVWrapper/>,
	document.getElementById("leroot"),
	)
