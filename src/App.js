import React, { Component, Fragment } from 'react';
import './App.css';
import { ReactComponent as IconBlue } from './img/icon-blue-line-small.svg';
import { ReactComponent as IconGreenB } from './img/icon-green-line-b-small.svg';
import { ReactComponent as IconGreenC } from './img/icon-green-line-c-small.svg';
import { ReactComponent as IconGreenD } from './img/icon-green-line-d-small.svg';
import { ReactComponent as IconGreenE } from './img/icon-green-line-e-small.svg';
import { ReactComponent as IconMattapan } from './img/icon-mattapan-line-small.svg';
import { ReactComponent as IconOrange } from './img/icon-orange-line-small.svg';
import { ReactComponent as IconRed } from './img/icon-red-line-small.svg';

class App extends Component {
  constructor() {
    super();
    this.state = {
      subwayRoutes: [],
    };

    this.icons = {
      'Blue Line': <IconBlue aria-hidden focusable="false" />,
      'Green Line B': <IconGreenB aria-hidden focusable="false" />,
      'Green Line C': <IconGreenC aria-hidden focusable="false" />,
      'Green Line D': <IconGreenD aria-hidden focusable="false" />,
      'Green Line E': <IconGreenE aria-hidden focusable="false" />,
      'Mattapan Trolley': <IconMattapan aria-hidden focusable="false" />,
      'Orange Line': <IconOrange aria-hidden focusable="false" />,
      'Red Line': <IconRed aria-hidden focusable="false" />,
    };
  }

  async getResource(
    { fields, filters, name, sort } = { fields: [], filters: [] }
  ) {
    const url = 'https://api-v3.mbta.com';
    const filtersQuery = filters
      .map(([key, value]) => `filter[${key}]=${value}`)
      .join('&');
    const fieldsQuery = fields
      .map(([key, value]) => `fields[${key}]=${value}`)
      .join('&');
    const sortQuery = sort ? `sort=${sort}` : '';

    const response = await fetch(
      `${url}/${name}?${filtersQuery}&${fieldsQuery}&${sortQuery}`
    );
    const json = response.json();
    return json;
  }

  async componentDidMount() {
    const subwayRoutes = [];

    // Load subway routes, only including relevant data for bandwith/performance\
    // reasons.
    const routes = await this.getResource({
      // subway includes "light rail" (type = 0) and "heavy rail" (type = 1)
      filters: [['type', '0,1']],
      fields: [['route', 'long_name']],
      name: 'routes',
    });

    // Get stops for each route
    /* routes.data.forEach(async route => {
      const stops = await this.getResource({
        filters: [["route", route.id]],
        fields: [["stop", "name"]],
        name: 'stops',
      });
      subwayRoutes.push({
        name: route.attributes.long_name,
        stops: stops.data.map(node => node.attributes.name)
      });

      // sort routes by name
      subwayRoutes.sort((routeA, routeB) => {
        if (routeA.name < routeB.name) return -1;
        if (routeA.name > routeB.name) return 1;
        return 0;
      });

      this.setState({
        subwayRoutes
      });
    }); */

    // Get stops for each route
    // We're using for await...of instead of forEach, because forEach won't
    // work asynchronously. We want to wait for everything to be loaded before
    // rendering it.
    for await (let route of routes.data) {
      const stops = await this.getResource({
        filters: [['route', route.id]],
        fields: [['stop', 'name']],
        name: 'stops',
      });
      subwayRoutes.push({
        name: route.attributes.long_name,
        stops: stops.data.map((node) => node.attributes.name),
      });

      // sort routes by name
      subwayRoutes.sort((routeA, routeB) => {
        if (routeA.name < routeB.name) return -1;
        if (routeA.name > routeB.name) return 1;
        return 0;
      });
    }

    this.setState({
      subwayRoutes,
    });
  }

  render() {
    console.log('render');
    const { subwayRoutes } = this.state;
    const loading = subwayRoutes.length === 0;

    // sort routes from least to most number of stops
    let largestRoute;
    let smallestRoute;
    if (!loading) {
      const sortedSubwayRoutes = subwayRoutes.slice();
      sortedSubwayRoutes.sort(
        (routeA, routeB) => routeA.stops.length - routeB.stops.length
      );
      largestRoute = sortedSubwayRoutes[sortedSubwayRoutes.length - 1];
      smallestRoute = sortedSubwayRoutes[0];
    }

    // get stops with more than one route
    const stopsWithConnections = [];
    // TODO: get rid of flat because it's not supported by IE11 (this needs
    // to be refactored anyway)
    const stops = subwayRoutes.map((route) => route.stops).flat();
    var countedStops = stops.reduce((allStops, stop) => {
      if (stop in allStops) {
        allStops[stop]++;
      } else {
        allStops[stop] = 1;
      }
      return allStops;
    }, {});
    Object.entries(countedStops).forEach(([key, value]) => {
      if (value > 1) stopsWithConnections.push(key);
    });

    // get routes for all stops with connections
    // this should be part of the stuff above...
    const subwayStopsWithConnections = [];
    subwayRoutes.forEach((route) => {
      route.stops.forEach((stop) => {
        if (stopsWithConnections.includes(stop)) {
          const stops = subwayStopsWithConnections.find(
            (element) => element.name === stop
          );
          if (!stops) {
            subwayStopsWithConnections.push({
              name: stop,
              routes: [route.name],
            });
          } else {
            stops.routes.push(route.name);
          }
        }
      });
    });

    return (
      <Fragment>
        <h1>MBTA API</h1>
        {loading && <span>loading...</span>}
        {!loading && (
          <Fragment>
            <h2>Subway Routes</h2>
            <ul>
              {subwayRoutes.map(({ name }) => (
                <li key={name}>
                  <span className="icon">{this.icons[name]}</span>
                  <span>{name}</span>
                </li>
              ))}
            </ul>
            <h2>Stops</h2>
            <ul>
              {largestRoute && (
                <li>
                  Route with the most stops: {largestRoute.name} (
                  {largestRoute.stops.length} stops)
                </li>
              )}
              {smallestRoute && (
                <li>
                  Route with the least stops: {smallestRoute.name} (
                  {smallestRoute.stops.length} stops)
                </li>
              )}
              <li>
                <span>Stops with connections:</span>
                <ul>
                  {subwayStopsWithConnections.map((stop) => (
                    <li key={stop.name}>
                      {stop.name}{' '}
                      {stop.routes.map((name) => (
                        <span className="icon" key={name}>
                          {this.icons[name]}
                        </span>
                      ))}
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
            <h2>Trip Planner</h2>
            <select value={this.state.stopA} onChange={this.handleStopAChange}>
              {stops.map((stop) => (
                <option value={stop}>{stop}</option>
              ))}
            </select>
            <select value={this.state.stopB} onChange={this.handleStopBChange}>
              {stops.map((stop) => (
                <option value={stop}>{stop}</option>
              ))}
            </select>
          </Fragment>
        )}
      </Fragment>
    );
  }
}

export default App;
