import React, { Component, Fragment } from 'react';
import './App.css';

const mbtaApiUrl = 'https://api-v3.mbta.com';

class App extends Component {
  constructor() {
    super();
    this.state = {
      subwayRoutes: []
    };
    this.getRoutes = this.getRoutes.bind(this);
  }

  async getRoutes({ fields, filters, sort } = { fields: [], filters: [] }) {
    try {
      const filtersQuery = filters.map(([key, value]) => `filter[${key}]=${value}`).join('&');
      const fieldsQuery = `fields[route]=${fields.join(',')}`;
      const sortQuery = sort ? `sort=${sort}` : '';

      const response = await fetch(
        `${mbtaApiUrl}/routes?${filtersQuery}&${fieldsQuery}&${sortQuery}`
      );
      const json = await response.json();
      return json;

    } catch(error) {
      console.log('error', error);
    }
  }

  async componentDidMount() {
    // Load subway routes, only including relevant data for bandwith/performance
    // reasons. Sorting because that makes sense to me :)
    const json = await this.getRoutes({
      filters: [
        // subway includes "light rail" (type = 0) and "heavy rail" (type = 1)
        ['type', '0,1']
      ],
      fields: ['long_name'],
      sort: 'long_name'
    });
    const subwayRoutes = json.data.map(node => node.attributes.long_name);
    this.setState({
      subwayRoutes
    });
  }

  render() {
    const { subwayRoutes } = this.state;

    return (
      <Fragment>
        <h1>MBTA API</h1>
        <h2>Subway Routes</h2>
        <ul>
          {subwayRoutes.map(subwayRoute => (
            <li key={subwayRoute}>{subwayRoute}</li>
          ))}
        </ul>
      </Fragment>
    );
  }
}

export default App;
