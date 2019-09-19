import React from 'react';
import ReactTooltip from 'react-tooltip'

import './nodeInfo.css';


function NodeInfo(props) {
  // number of players rendered in the graph that the selected player has gigged with
  const giggedWithLength = props.nodeInfo.node.gigged_with.filter(x => props.arrayNodeIDs.includes(x)).length
	const stringInstruments = props.nodeInfo.node.instrument.map(x => x['name']).join(", ")

  return (
		<div className='box_info' id='node_info'>
      <div className='row node_info_header'>
        {props.nodeInfo.node.external_URL? 
          (<a href={props.nodeInfo.node.external_URL} target="_blank"  rel="noopener noreferrer">
          <h5 className="node_info_node_name">{props.nodeInfo.node.name} ({props.countryCodes[props.nodeInfo.node.country]})</h5>
        </a>) : 
          (<h5 className="node_info_node_name">{props.nodeInfo.node.name} ({props.countryCodes[props.nodeInfo.node.country]})</h5>)}

          <button type="button" className="close node_info_close" aria-label="Close" onClick={props.closeBoxFun}>
            <span aria-hidden="true">&times;</span>
          </button>
      </div>

      <div className="nodeInfoHr"></div>

			<div className="node_info_box">
      {props.nodeInfo.node.thumbnail && <img src={props.nodeInfo.node.thumbnail} className="node_info_image" alt="player"></img>}
      <ul className="node_info_list">
        <li>Instrument{props.nodeInfo.node.instrument.length >1 ? "s":""}: {stringInstruments}</li>
        <li><span data-tip data-for='Connection_info' data-multiline={true} id="Connection_darken">{giggedWithLength} Connection{giggedWithLength === 1 ? "":"s"}</span></li>

        
        <ReactTooltip id='Connection_info' type='dark'>
          <span>A connection means that<br></br> the players have gigged together</span>
        </ReactTooltip>

      </ul>
  			<p className="node_info_description">{props.nodeInfo.node.description}</p>
			</div>
		</div>)
}

export default NodeInfo;