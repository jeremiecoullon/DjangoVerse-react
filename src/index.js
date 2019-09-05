import React from 'react';
import Select from 'react-select'
import ReactDOM from 'react-dom';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Switch from 'react-switch';

// import SpriteText from 'three-spritetext';
import './index.css';
import './navbar.css';
import './MyFontsWebfontsKit.css';

const APIdomain = 'https://londondjangocollective.herokuapp.com/'
// const APIdomain = 'http://localhost:5000/'

function NodeInfo(props) {
  // <img src={props.nodeInfo.node.image}></img>
	return (
		<div className='box_info' id='node_info'>
			<a href={props.nodeInfo.node.external_URL} target="_blank">
  			<h5>{props.nodeInfo.node.name} ({props.nodeInfo.node.country})</h5>
			</a>
			<div className="node_info_box">
  			<p>{props.nodeInfo.node.description}</p>
  			<br></br>
  			<p>Country: {props.nodeInfo.node.country}</p>
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
        placefholder= "Search..."
        openMenuOnClick={false}
        styles={customStyles}
      />
      </div>
    </React.Fragment>)
}

function DVInfo(props) {
  return (<React.Fragment>
      <div className="DVInfoWrapper">
        
        <div className="DVInfoHeader">
          <h2>How does this work?</h2>
        </div>
          <div className="DVInfoHr"></div>
        <div className="DVInfoBody">
          <p>The DjangoVerse is essentially Wikipedia for Gypsy Jazz. You can find players, bands, and festivals in this interactive 3D graph. You can also data to this yourself! </p>
          <p>more info!</p>
        </div>

        <div className="DVInfoFooter">
          Close button
        </div>
      </div>
    </React.Fragment>)
}

function NavBar(props) {
  return (<React.Fragment>
      <Navbar className="lenavbar" expand="lg">
        <a href="https://londondjangocollective.herokuapp.com/djangoverse" target="_parent" class="navbar-brand navbar-LDC" id="LDC-in-navbar">DjangoVerse</a>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <p className="navbar-links fa fa-question-circle DVInfoButton" onClick={props.handleToggleDVInfo}> Info</p>
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
      bandOn: true,
      // venueOn: false,
      festivalOn: true,
      // albumOn: false,

      player_country: 'all',
      festival_country: 'all',
      band_country: 'all',
      venue_country: 'all',
      album_country: 'all',

      list_countries: {
        'band': ['FR',], 
        'player': ['FR',], 
        'festival': ['FR',], 
        'venue': ['FR',], 
        'album': ['FR',]},

      instrument: 'all',
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
    queryParams = queryParams +  (this.state.bandOn ? '&band=on' : "")
    queryParams = queryParams +  (this.state.venueOn ? '&venue=on' : "")
    queryParams = queryParams +  (this.state.festivalOn ? '&festival=on' : "")
    queryParams = queryParams +  (this.state.albumOn ? '&album=on' : "")

    queryParams = queryParams + ((this.state.player_country !== 'all') ? ('&player_country=' + this.state.player_country) : "")
    queryParams = queryParams + ((this.state.band_country !== 'all') ? ('&band_country=' + this.state.band_country) : "")
    queryParams = queryParams + ((this.state.festival_country !== 'all') ? ('&festival_country=' + this.state.festival_country) : "")
    queryParams = queryParams + ((this.state.album_country !== 'all') ? ('&album_country=' + this.state.album_country) : "")
    queryParams = queryParams + ((this.state.venue_country !== 'all') ? ('&venue_country=' + this.state.venue_country) : "")

    queryParams = queryParams + ((this.state.instrument !== 'all') ? ('&instrument=' + this.state.instrument) : "")

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

  render(){
    return (<React.Fragment>
      <div id="controls" className="box_info">

      <h3>Filter DjangoVerse</h3>
      <form onSubmit={this.handleSubmit}>
        <div>
          <input type="checkbox" name="playerOn" checked={this.state.playerOn} onChange={this.handleInputChange} />Players
          <select name='player_country' value={this.state.player_country} onChange={this.handleInputChange} className="select_margin">
          <option value="all">All countries</option>
            {this.state.list_countries.player.map( x => 
              (<option value={x[0]}>{x[1]}</option>))}            
          </select>
        </div>

        <div>
          <input type="checkbox" name="bandOn" checked={this.state.bandOn} onChange={this.handleInputChange} />Bands
          <select name='band_country' value={this.state.band_country} onChange={this.handleInputChange} className="select_margin">
          <option value="all">All countries</option>
            {this.state.list_countries.band.map( x => 
              (<option value={x[0]}>{x[1]}</option>))}            
          </select>
        </div>

        <div>
          <input type="checkbox" name="festivalOn" checked={this.state.festivalOn} onChange={this.handleInputChange} />Festivals
          <select name='festival_country' value={this.state.festival_country} onChange={this.handleInputChange} className="select_margin">
          <option value="all">All countries</option>
            {this.state.list_countries.festival.map( x => 
              (<option value={x[0]}>{x[1]}</option>))}            
          </select>
        </div>


        <div>
        </div>
        <select name='instrument' value={this.state.instrument} onChange={this.handleInputChange} className="select_margin">
          <option value="all">All instruments</option>
          {this.state.list_instruments.map(x => 
            (<option value={x}>{x}</option>))}
          </select>

        <div>
        <label>
        Is Active:
          <select name='isActive' value={this.state.isActive} onChange={this.handleInputChange} className="select_margin">
            <option value='all'>All</option>
            <option value='True'>Active</option>
            <option value='False'>Inactive</option>
          </select>
        </label>
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
			queryParams: '&player=on&band=on&festival=on',
			nodeInfo: null,
      selectedOption: null,
      'toggleFilter': true,
      'toggleDVInfo': false
		}
    this.handleToggleFilter = this.handleToggleFilter.bind(this);
	}

  async componentDidMount(addLights=true) {
  	// ASYNC VERSION
    try {
      // const res = await fetch('http://localhost:5000/players/?format=json');
      const res = await fetch(APIdomain+'api/D3endpoint/?format=json' + this.state.queryParams);
      
      const gypsyJazzScene = await res.json();
      this.setState({
        gypsyJazzScene
      });
    } catch (e) {
      console.log(e);
    }

    // manually set the link distance between nodes
    this.fg.d3Force('link').distance(link => {
      // console.log(link)
      if ((link.target.type === 'festival') || (link.source.type === 'festival')){
          // link distance for festivals depends on number of players and bands played
          let count = link.target.playersplayed.length + link.target.bandsplayed.length
          return 40 + count*2
            // return 150
          }
      else
        {return 40}
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

  handleToggleDVInfo() {
    const currentDVInfo = this.state.toggleDVInfo;
    this.setState({'toggleDVInfo': !currentDVInfo})
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


  render() {
    // add 'value' and 'label' to each node
    let searchList = this.state.gypsyJazzScene.nodes.map(obj => {
      obj['value'] = obj.name;
      obj['label'] = obj.name;
      return obj
    })
// <Search selectedOption={this.state.selectedOption} searchList={searchList} handleChange={this.handleChangeSearch} />
    return (

      <React.Fragment>
        <NavBar 
        selectedOption={this.state.selectedOption} 
        searchList={searchList} 
        handleChange={this.handleChangeSearch}
        handleToggleFilter={() => this.handleToggleFilter()}
        toggleFilter={this.state.toggleFilter}
        handleToggleDVInfo={() => this.handleToggleDVInfo()}
        />

        {this.state.nodeInfo && <NodeInfo nodeInfo={this.state.nodeInfo} closeBoxFun={() => {this.handleCloseNodeInfo()}}/>}
        
        {this.state.toggleFilter && <FilterGraph reloadGraph={(newQueryParams) => {this.reloadGraph(newQueryParams)}}/>}

        {this.state.toggleDVInfo && <DVInfo/>}
        

        <ForceGraph3D
          ref={el => { this.fg = el; }}
          graphData={this.state.gypsyJazzScene}
          nodeLabel="name"  
          onNodeClick={this._handleClick}
          nodeVal={this.getNodeSize}
          nodeAutoColorBy="country"
          linkWidth={0.7}
          // Note: need to set enableNodeDrag to false so that onNodeClick works on mobile
          enableNodeDrag={false}
          nodeOpacity={1}
          backgroundColor={"black"}
          // nodeThreeObject={node => {
            // const sprite = new SpriteText(node.name);
            // sprite.color = node.color;
            // sprite.textHeight = 8;
            // return sprite;
          // }}
          // TODO: modify force so that nodes are further apart

        />
      </React.Fragment>
      );
    }
}


ReactDOM.render(
	<DjangoVerse/>,
	document.getElementById("leroot"),
	)
