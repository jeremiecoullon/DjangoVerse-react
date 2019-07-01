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
      'venueOn': false,
      'festivalOn': false,
      'albumOn': false,
    }
  }
  
  handleSubmit(event) {
    let queryParams = this.state.playerOn ? '&player=on' : ""
    queryParams = queryParams +  (this.state.bandOn ? '&band=on' : "")
    queryParams = queryParams +  (this.state.venueOn ? '&venue=on' : "")
    queryParams = queryParams +  (this.state.festivalOn ? '&festival=on' : "")
    queryParams = queryParams +  (this.state.albumOn ? '&album=on' : "")
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
  }

  render(){
    return (<React.Fragment>
      <div id="controls" className="box_info">
      <form onSubmit={this.handleSubmit}>
        <div>
          <input type="checkbox" name="playerOn" checked={this.state.playerOn} onChange={this.handleInputChange} />Players
        </div>
        <div>
          <input type="checkbox" name="bandOn" checked={this.state.bandOn} onChange={this.handleInputChange} />Bands
        </div>
        <div>
          <input type="checkbox" name="venueOn" checked={this.state.venueOn} onChange={this.handleInputChange} />Venues
        </div>
        <div>
          <input type="checkbox" name="festivalOn" checked={this.state.festivalOn} onChange={this.handleInputChange} />Festivals
        </div>
        <div>
          <input type="checkbox" name="albumOn" checked={this.state.albumOn} onChange={this.handleInputChange} />Albums
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
  }

  reloadGraph(newQueryParams) {
    // "&festival=on&player=on&venue=on&band=on"
    this.setState({queryParams: newQueryParams});
    console.log(this.state.queryParams)
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
