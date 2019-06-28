import React from 'react';
import ReactDOM from 'react-dom';
import ForceGraph3D from 'react-force-graph-3d';
import './index.css';


function NodeInfo(props) {
	console.log(props.nodeInfo.node.name)
		return (<div className='box_info' id='node_info'>
				<a href={props.nodeInfo.node.url} target="_blank">
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



class MyApp extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			gypsyJazzScene: {'nodes': [], 'links': []},
			queryparams: '&player=on&band=on',
			nodeInfo: null,
		}
	}

  async componentDidMount() {

  	// ASYNC VERSION
    try {
      // const res = await fetch('http://localhost:5000/players/?format=json');
      const res = await fetch('http://localhost:5000/D3endpoint/?format=json' + this.state.queryparams);
      
      const gypsyJazzScene = await res.json();
      this.setState({
        gypsyJazzScene
      });
    } catch (e) {
      console.log(e);
    }
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

    render() {
      return (
      	<div>
      	{this.state.nodeInfo && <NodeInfo nodeInfo={this.state.nodeInfo} closeBoxFun={() => this.setState({'nodeInfo': null})}/>}
      	<ForceGraph3D
              ref={el => { this.fg = el; }}
              graphData={this.state.gypsyJazzScene}
              nodeLabel="name"
              nodeAutoColorBy="country"
              onNodeClick={this._handleClick}
            />
        </div>
            );
    }
}


ReactDOM.render(
	<MyApp/>,
	document.getElementById("leroot"),
	)
