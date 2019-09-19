import React from 'react';
import Select from 'react-select'

import './search.css';

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

export default Search;