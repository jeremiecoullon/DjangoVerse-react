import React from 'react';
import ReactDOM from 'react-dom';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';
import SpriteText from 'three-spritetext';

import NodeInfo from './components/nodeInfo';
import ModalDVInfo from './components/ModalDVInfo';
import NavBar from './components/NavBar';
import ModalFilterGraph from './components/ModalFilterGraph';


import './index.css';
import './MyFontsWebfontsKit.css';

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
      toggleDVInfo: true,
      list_countries: {
        'player': ['FR',]
      },
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
    let distance = 200
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
      1500  // ms transition duration
    );
    // un-highlight all nodes in case some of them are highlighted
    this.state.gypsyJazzScene.nodes.forEach(function(e) {e['highlightNode']=false})
    // highlight the links of the current node
    node.highlightNode = true
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
  handleNavCloseNodeInfo(e){
    // Close NodeInfo when opening the hamburger in the NavBar (but not when closing it)
    if (e){
      this.setState({'nodeInfo': null}); 
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
        handleModalDVInfoShow={() => this.handleModalDVInfoShow()}
        handleModalFilterShow={() => this.handleModalFilterShow()}
        handleNavCloseNodeInfo={this.handleNavCloseNodeInfo}
        />

        {this.state.nodeInfo && <NodeInfo 
          nodeInfo={this.state.nodeInfo} 
          closeBoxFun={() => {this.handleCloseNodeInfo()}} 
          arrayNodeIDs={arrayNodeIDs} 
          countryCodes={countryCodes} />}
        
        

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
            sprite.color = node.color;
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

      </React.Fragment>
      );
    }
}


ReactDOM.render(
	<DjangoVerse/>,
	document.getElementById("leroot"),
	)
