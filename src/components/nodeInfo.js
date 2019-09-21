import React from 'react';
import ReactTooltip from 'react-tooltip'
import Button from 'react-bootstrap/Button';

import './nodeInfo.css';


function NodeInfo(props) {
  // number of players rendered in the graph that the selected player has gigged with
  const giggedWithLength = props.nodeInfo.node.gigged_with.filter(x => props.arrayNodeIDs.includes(x)).length
	const stringInstruments = props.nodeInfo.node.instrument.map(x => x['name']).join(", ")

  return (
		<div className='box_info' id='node_info'>
      <div className='row node_info_header'>
        {props.nodeInfo.node.external_URL? 
          (<a className="node_info_node_name" href={props.nodeInfo.node.external_URL} target="_blank"  rel="noopener noreferrer">
          <h5 >{props.nodeInfo.node.name} ({props.countryCodes[props.nodeInfo.node.country]})</h5>
        </a>) : 
          (<h5 className="node_info_node_name">{props.nodeInfo.node.name} ({props.countryCodes[props.nodeInfo.node.country]})</h5>)}
          <div className="node_info_close_edit">
            <a title="edit" className="node_info_edit" href={`http://www.londondjangocollective.com/api/forms/player/${props.nodeInfo.node.id}/edit`}>
              <i className='fa fa-pencil'></i>
            </a>
            <button title="close" type="button"  aria-label="Close" className="close node_info_close" onClick={props.closeBoxFun}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
      </div>

      <div className="nodeInfoHr"></div>

			<div className="node_info_box">

      
                    
        {props.nodeInfo.node.thumbnail && 
          <React.Fragment>
          <div className='row'>
            <div className='col-6 col-xs-6 col-md-6  NodeInfoCols'>
              <img src={props.nodeInfo.node.thumbnail} className="node_info_image" alt="player"></img>
            </div>
          <div className='col-6 col-xs-6 col-md-6  NodeInfoCols'>
              <NodeInfoList 
              nodeInfo={props.nodeInfo} 
              handleModalYoutubeShow={props.handleModalYoutubeShow}
              arrayNodeIDs={props.arrayNodeIDs}
              />
          </div>
          </div>
        </React.Fragment>
        }
            
        {!props.nodeInfo.node.thumbnail && 
          <React.Fragment>
            <NodeInfoList 
            nodeInfo={props.nodeInfo} 
            handleModalYoutubeShow={props.handleModalYoutubeShow}
            arrayNodeIDs={props.arrayNodeIDs}
            />
        </React.Fragment>
        }
          
      


  			<p className="node_info_description">{props.nodeInfo.node.description}</p>
			</div>
		</div>)
}

function NodeInfoList(props){
  // number of players rendered in the graph that the selected player has gigged with
  const giggedWithLength = props.nodeInfo.node.gigged_with.filter(x => props.arrayNodeIDs.includes(x)).length
  const stringInstruments = props.nodeInfo.node.instrument.map(x => x['name']).join(", ")
    return (<React.Fragment>
                <ul className="node_info_list">
            <li>Instrument{props.nodeInfo.node.instrument.length >1 ? "s":""}: {stringInstruments}</li>
            <li>
              <span className="relative">
                {giggedWithLength} Connection{giggedWithLength === 1 ? "":"s"}
                <div data-tip data-for='Connection_info' data-multiline={true}  className='help-tip-question-mark'>
                </div>
              </span>
            </li>
            <ReactTooltip id='Connection_info' type='dark'>
              <span>A connection means that<br></br> the players have gigged together</span>
            </ReactTooltip>

            {props.nodeInfo.node.video_embed && 
              <li>
                <Button variant="outline-light" onClick={props.handleModalYoutubeShow}>
                  Listen <i class="fa fa-youtube-play" aria-hidden="true"></i>
                </Button>
              </li>
            }
          </ul>
      </React.Fragment>)
}

// <li><i class="fa fa-youtube-play" aria-hidden="true"></i> Check out their music</li>
export default NodeInfo;