import React from 'react';
import ReactDOM from 'react-dom';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';
import SpriteText from 'three-spritetext';

import NodeInfo from './components/nodeInfo';
import ModalDVInfo from './components/modalDVInfo';
import NavBar from './components/navBar';
import ModalFilterGraph from './components/modalFilterGraph';
import ModalYoutubeEmbed from './components/modalYoutubeEmbed';
import HelpPopup from './components/helpPopup';

import './index.css';
import './MyFontsWebfontsKit.css';
import backImage from './img/backImage.png';
import downImage from './img/downImage.png';
import frontImage from './img/frontImage.png';
import leftImage from './img/leftImage.png';
import rightImage from './img/rightImage.png';
import upImage from './img/upImage.png';

const APIdomain = 'https://londondjangocollective.herokuapp.com/';
// const APIdomain = 'http://localhost:5000/';





class DjangoVerse extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			gypsyJazzScene: {'nodes': [], 'links': []},
			queryParams: '&player=on',
			nodeInfo: null,
      selectedOption: null,
      toggleFilter: false,
      toggleModalFilter: false,
      toggleDVInfo: false,
      toggleModalYoutube: false,
      ModalYoutubeID: null,
      list_countries: {
        'player': ['FR',]
      },
      toggleHelpBox1: true,
      toggleHelpBox2: false,
		}
    this.handleToggleFilter = this.handleToggleFilter.bind(this);
    this.handleNavCloseNodeInfo = this.handleNavCloseNodeInfo.bind(this);
	}

  async componentDidMount(addLights=true) {
    try {
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
    // set 'showNode'=true for all nodes. when a node is clicked (in `_handleClick()`) then
    // all nodes that weren't clicked on will be made transparence
    this.state.gypsyJazzScene.nodes.forEach(function(e) {e['showNode']=true})

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
    this.skybox();
    }

  reCentreCamera(){
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

  reloadGraph(newQueryParams) {
    this.state.gypsyJazzScene.nodes.forEach(function(e) {
        e['highlightNode']=false; e['showNode']=true
      })
    // Callback: only reload graph after updated params
    this.setState({queryParams: newQueryParams}, () => this.componentDidMount(false));
    this.reCentreCamera();
  }
  reloadGraphCurrentParams() {
    this.reloadGraph(this.state.queryParams)
  }

  


  _handleClick = node => {
    // update state to render NodeInfo
    this.setState({nodeInfo: {node}})

    // if node has youtube ID, set state. Else set the state to null
    const ModalYoutubeIDState = node.video_embed? node.video_embed : null;
    this.setState({ModalYoutubeID: ModalYoutubeIDState});
    
    const giggedWith = this.state.gypsyJazzScene.nodes.filter(x => node.gigged_with.includes(x['id']))
    const numGiggedWith = giggedWith.length;
    // Aim at node from outside it
    let distance = Math.cbrt(1 + numGiggedWith)*150
    // if (node.type === 'festival'){
    //     distance = 400;
    //   }
    // else {
    //   distance = 100
    // }
    const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);

    this.fg.cameraPosition(
      { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
      node, // lookAt ({ x, y, z })
      1500  // ms transition duration
    );
    // un-highlight all nodes in case some of them are highlighted
    this.state.gypsyJazzScene.nodes.forEach(function(e) {e['highlightNode']=false})
    // highlight the links of the current node
    node.highlightNode = true

    // Make all nodes a bit transparent
    this.state.gypsyJazzScene.nodes.forEach(function(e) {e['showNode']=false})
    // Make selected node opaque again
    node.showNode=true
    // Make all connected players also opaque (used `giggedWith` as defined above)
    giggedWith.forEach(function(e) {e['showNode']=true})
  };

  linkColor(node) {
    // When a node is highlighted (on click), set the link color to red
    if (node.source.highlightNode || node.target.highlightNode){
        return 'red'}
      else{
          return 'grey'
        }
  }
  linkWidth(node){
    // When a node is highlighted (on click), make the link widere
   if (node.source.highlightNode || node.target.highlightNode){
        return 1.5}
      else{
          return 0.3
        }
  }

  skybox(){
    var directions  = [leftImage, rightImage, upImage, downImage, frontImage, backImage];
    var reflectionCube = new THREE.CubeTextureLoader().load(directions);
    this.fg.scene().background = reflectionCube;
  }

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
    // undo link highlighing
    this.state.gypsyJazzScene.nodes.forEach(function(e) {
      e['highlightNode']=false; e['showNode']=true
    })
    this.reCentreCamera();
  }
  handleNavCloseNodeInfo(e){
    // Close NodeInfo when opening the hamburger in the NavBar (but not when closing it)
    if (e){
      this.setState({'nodeInfo': null}); 
      // undo link highlighing
      this.state.gypsyJazzScene.nodes.forEach(function(e) {
        e['highlightNode']=false; e['showNode']=true
      })
    }
  }

  handleToggleFilter() {
    const currentToggleValue = this.state.toggleFilter;
    this.setState({'toggleFilter': !currentToggleValue})
  }

  handleChangeSearch = selectedOption => {
    this.setState({selectedOption: selectedOption}, () => this._handleClick(selectedOption));
 }


  handleModalDVInfoShow() {
    this.setState({'toggleDVInfo': true})
  }
  handleModalDVInfoClose() {
    this.setState({'toggleDVInfo': false})
  }

  handleModalFilterShow() {
    this.setState({'toggleModalFilter': true})
  }
  handleModalFilterClose() {
    this.setState({'toggleModalFilter': false})
  }

  handleModalYoutubeShow() {
    this.setState({'toggleModalYoutube': true})
  }
  handleModalYoutubeClose() {
    this.setState({'toggleModalYoutube': false})
  }

  handleHelpBox1Close() {
    this.setState({'toggleHelpBox1': false})
    setTimeout(() => this.setState({'toggleHelpBox2': true}), 1000)
  }
  handleHelpBox2Close() {
    this.setState({'toggleHelpBox2': false})
  }

  render() {
    // add 'value' and 'label' to each node
    let searchList = this.state.gypsyJazzScene.nodes.map(obj => {
      obj['value'] = obj.name;
      obj['label'] = obj.name;
      return obj
    })
    // array of node IDs so that NodeInfo can filter 'gigged with' info
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
        handleModalDVInfoShow={() => this.handleModalDVInfoShow()}
        handleModalFilterShow={() => this.handleModalFilterShow()}
        handleNavCloseNodeInfo={this.handleNavCloseNodeInfo}
        reloadGraphCurrentParams={() => this.reloadGraphCurrentParams()}
        />

        {this.state.nodeInfo && <NodeInfo 
          nodeInfo={this.state.nodeInfo} 
          closeBoxFun={() => {this.handleCloseNodeInfo()}} 
          arrayNodeIDs={arrayNodeIDs} 
          countryCodes={countryCodes} 
          handleModalYoutubeShow={() => this.handleModalYoutubeShow()}
          />}
        
        

        <ForceGraph3D
          ref={el => { this.fg = el; }}
          graphData={this.state.gypsyJazzScene}
          nodeLabel={node => countryCodes[node['country']]}
          onNodeClick={this._handleClick}
          nodeAutoColorBy="country"
          linkWidth={this.linkWidth}
          linkColor={this.linkColor}
          // Note: need to set enableNodeDrag to false so that onNodeClick works on mobile
          enableNodeDrag={false}
          nodeOpacity={1}
          backgroundColor={"black"}

          nodeThreeObject={node => {
            // use an invisible sphere to be able to click on a node
            const obj = new THREE.Mesh(
              new THREE.SphereGeometry(15),
              new THREE.MeshBasicMaterial({ depthWrite: false, transparent: true, opacity: 0 })
            );
            // add text sprite as child
            const sprite = new SpriteText(node.name);
            
            // transparency depends on whether node is clicked on
            if (node.showNode){
              sprite.color=node.color
            }
            else {
              sprite.color=node.color.concat('33'); // 1A: 10%, 26: 15%, 33: 20%, 4D: 30%, 66: 40%
            }

            sprite.textHeight = 8;
            obj.add(sprite);
            return obj;
          }}
        />

        <ModalDVInfo show={this.state.toggleDVInfo} handleClose={() => this.handleModalDVInfoClose()} />,

        <ModalFilterGraph 
        show={this.state.toggleModalFilter} 
        handleClose={() => this.handleModalFilterClose()} 
        reloadGraph={(newQueryParams) => {this.reloadGraph(newQueryParams)}}
        APIdomain={APIdomain}
        />,

        <ModalYoutubeEmbed
          show={this.state.toggleModalYoutube}
          handleClose={() => this.handleModalYoutubeClose()}
          YoutubeID={this.state.ModalYoutubeID}
        />

        {this.state.toggleHelpBox1 && 
          <HelpPopup
            isVisible={this.state.toggleHelpBox1}
            body={"Click on a player to see who they've gigged with (click twice on mobile)"}
            numHelp={"1/2"}
            handleClose={() => this.handleHelpBox1Close()}
          />}

        {this.state.toggleHelpBox2 && 
          <HelpPopup
            isVisible={this.state.toggleHelpBox2}
            body={"The colours represent the countries the players are based in"}
            numHelp={"2/2"}
            handleClose={() => this.handleHelpBox2Close()}
          />}

      </React.Fragment>
      );
    }
}


ReactDOM.render(
	<DjangoVerse/>,
	document.getElementById("leroot"),
	)
