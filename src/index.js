import React from 'react';
import ReactDOM from 'react-dom';
import ForceGraph3D from 'react-force-graph-3d';
import './index.css';


function NodeInfo(props) {
	return (
		<div className='box_info' id='node_info'>
			<a href={props.nodeInfo.node.external_URL} target="_blank">
  			<h5>{props.nodeInfo.node.name} ({props.nodeInfo.node.country})</h5>
			</a>
			<img src={props.nodeInfo.node.image}></img>
			<div className="node_info_box">
  			<p>{props.nodeInfo.node.description}</p>
  			<br></br>
  			<p>Country: {props.nodeInfo.node.country}</p>
  			<p onClick={props.closeBoxFun}>Close</p>
			</div>
		</div>)

}

class FilterGraph extends React.Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);

    this.state = {
      playerOn: true,
      bandOn: true,
      venueOn: false,
      festivalOn: false,
      albumOn: false,

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
      const res = await fetch('http://localhost:5000/api/countries/?format=json');
      const res2 = await fetch('http://localhost:5000/api/all_instruments/?format=json');
      
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
    // queryParams = 
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
    // console.log(this.state.isActive)
  }

  render(){
    return (<React.Fragment>
      <div id="controls" className="box_info">
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
          <input type="checkbox" name="venueOn" checked={this.state.venueOn} onChange={this.handleInputChange} />Venues
          <select name='venue_country' value={this.state.venue_country} onChange={this.handleInputChange} className="select_margin">
          <option value="all">All countries</option>
            {this.state.list_countries.venue.map( x => 
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
          <input type="checkbox" name="albumOn" checked={this.state.albumOn} onChange={this.handleInputChange} />Albums
          <select name='album_country' value={this.state.album_country} onChange={this.handleInputChange} className="select_margin">
          <option value="all">All countries</option>
            {this.state.list_countries.album.map( x => 
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

class Search extends React.Component {
  render(){
    return (<React.Fragment>
      
    </React.Fragment>)
  }
}

class DjangoVerse extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			gypsyJazzScene: {'nodes': [], 'links': []},
			queryParams: '&player=on&band=on',
			nodeInfo: null,
		}
	}

  async componentDidMount() {
  	// ASYNC VERSION
    try {
      // const res = await fetch('http://localhost:5000/players/?format=json');
      const res = await fetch('http://localhost:5000/api/D3endpoint/?format=json' + this.state.queryParams);
      
      const gypsyJazzScene = await res.json();
      this.setState({
        gypsyJazzScene
      });
    } catch (e) {
      console.log(e);
    }
    console.log(this.state.queryParams) 
  }

  reloadGraph(newQueryParams) {
    // "&festival=on&player=on&venue=on&band=on"
    this.setState({queryParams: newQueryParams});
    // console.log(this.state.queryParams)
    this.componentDidMount()
  }


  _handleClick = node => {
    // update state to render NodeInfo
    this.setState({'nodeInfo': {node}})
    // Aim at node from outside it
    const distance = 40;
    const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);

    this.fg.cameraPosition(
      { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
      node, // lookAt ({ x, y, z })
      3000  // ms transition duration
    );
  };

  handleCloseNodeInfo(){
    this.setState({'nodeInfo': null});
  }

  render() {
    return (
      <React.Fragment>
        {this.state.nodeInfo && <NodeInfo nodeInfo={this.state.nodeInfo} closeBoxFun={() => {this.handleCloseNodeInfo()}}/>}
        <FilterGraph reloadGraph={(newQueryParams) => {this.reloadGraph(newQueryParams)}}/>
        <Search/>
        <ForceGraph3D
          ref={el => { this.fg = el; }}
          graphData={this.state.gypsyJazzScene}
          nodeLabel="name"
          nodeAutoColorBy="country"
          onNodeClick={this._handleClick}
        />
      </React.Fragment>
      );
    }
}


ReactDOM.render(
	<DjangoVerse/>,
	document.getElementById("leroot"),
	)
