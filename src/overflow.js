// Homemade search bar
        <form onSubmit={props.handleSubmit}>
          <label>
            <input type='text' value={props.searchTerm} onChange={props.handleChange} placeholder='search..' />
          </label>
          <input type='submit' value='Submit' />
        </form>
      <div>
        <h4>Results:</h4>
        <ul>
          {props.filteredList.map(x => (<li>{x.name}</li>))}
        </ul>
      </div>






        <ReactSearchBox
        placeholder="Search for people"
        data={props.allData}
        onSelect={record => console.log('selected: ' + record)}
        // onFocus={() => {
        //   console.log('This function is called when is focussed')
        // }}
        onChange={value => console.log(value)}
        fuseConfigs={{
          threshold: 0.05,
        }}
      />




    // Homemade search bar: goes in render() function of DjangoVerse component
      <Search handleSubmit={this.handleSearchSubmit} handleChange={this.handleSearchChange} 
        searchTerm={this.state.searchTerm} filteredList={this.state.filteredList} 
        />