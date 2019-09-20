import React from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import './modalBoxes.css';
import './modalFilterGraph.css';


class ModalFilterGraph extends React.Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);

    this.state = {
      playerOn: true,
      player_country: [],
      list_countries: {
        'player': []},

      instrument: [],
      list_instruments: [],

      isActive: 'all',
    }
  }


  async componentDidMount() {
    // ASYNC VERSION
    try {
      const res = await fetch(this.props.APIdomain+'api/countries/?format=json');
      const res2 = await fetch(this.props.APIdomain+'api/all_instruments/?format=json');
      
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
    const countryOptions = this.state.list_countries.player.map( x => ({value: x[0], label: x[1]}));
    const instrumentOptions = this.state.list_instruments.map(x => ({value: x, label: x}));
    const activeOptions = [{value: 'all', label: "All"}, {value: 'True', label: 'Active'}, {value: 'False', label: 'Inactive'}];
    
    // default values for the forms are the parameters used to previously reload the graph
    const defaultCountry = countryOptions.filter(x => this.state['player_country'].includes(x['value']));
    const defaultInstrument = instrumentOptions.filter(x => this.state['instrument'].includes(x['value']));
    const defaultActive = this.state.isActive === 'all'? [] : activeOptions.filter(x => this.state.isActive === x['value']);

    return (<React.Fragment>
      <Modal 
      show={this.props.show} 
      onHide={this.props.handleClose}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      >
        <Modal.Header closeButton>
            <Modal.Title>Filter DjangoVerse</Modal.Title>          
        </Modal.Header>
        <Modal.Body>
            <i>Leave empty to select all</i>
            <form onSubmit={this.handleSubmit}>

              <Select
                defaultValue={defaultCountry}
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
                defaultValue={defaultInstrument}
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
                defaultValue={defaultActive}
                components={animatedComponents}
                name="isactive"
                options={activeOptions}
                className="select_margin"
                classNamePrefix="select"
                onChange={this.handleisActiveChange}
                placeholder="Is active..."
              />
            </div>

            <div>
              <input type="submit" value="Reload" className="select_margin btn btn-light" />
            </div>
          </form>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>)
  }

}




export default ModalFilterGraph;