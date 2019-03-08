import React, { Component, Fragment } from 'react';
import RouteIcon from './components/RouteIcon';
import { groupBy } from 'lodash';
import { getSubwayRoutes } from './api/MbtaApi';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      subwayRoutes: [],
    };
  }

  // (I'm loading data this way based off familiarity, but I'd probably look into
  // using hooks instead with more time)
  async componentDidMount() {
    const subwayRoutes = await getSubwayRoutes();

    this.setState({
      subwayRoutes,
    });
  }

  getStops(routes) {
    // array of stop-route objects
    const stopRouteCombinations = routes
      // add route data to each stop
      .map((route) => {
        return route.stops.map((stop) => ({
          ...stop,
          route: {
            id: route.id,
            name: route.name,
          },
        }));
      })
      .flat();

    // array of stop objects, with routes grouped inside
    const stops = groupBy(stopRouteCombinations, 'id');
    const stopsArray = Object.values(stops);

    return stopsArray.map((stop) => ({
      id: stop[0].id,
      name: stop[0].name,
      routes: stop.map((node) => ({
        id: node.route.id,
        name: node.route.name,
      })),
    }));
  }

  getStopsWithConnections(routes) {
    // array of stop-route objects
    const stopRouteCombinations = routes
      // add route data to each stop
      .map((route) => {
        return route.stops.map((stop) => ({
          ...stop,
          route: {
            id: route.id,
            name: route.name,
          },
        }));
      })
      .flat();

    // array of stop objects, with routes grouped inside
    const stops = groupBy(stopRouteCombinations, 'id');
    const stopsArray = Object.values(stops).filter((stop) => stop.length > 1);
    const stopsWithConnections = stopsArray.map((stop) => ({
      id: stop[0].id,
      name: stop[0].name,
      routes: stop.map((node) => ({
        id: node.route.id,
        name: node.route.name,
      })),
    }));

    return stopsWithConnections;
  }

  render() {
    const { subwayRoutes } = this.state;
    const loading = subwayRoutes.length === 0;

    if (loading) {
      return 'loading...';
    }

    // sort routes from least to most number of stops
    let largestRoute;
    let smallestRoute;
    const sortedSubwayRoutes = subwayRoutes.slice();
    sortedSubwayRoutes.sort(
      (routeA, routeB) => routeA.stops.length - routeB.stops.length
    );
    largestRoute = sortedSubwayRoutes[sortedSubwayRoutes.length - 1];
    smallestRoute = sortedSubwayRoutes[0];

    const stops = this.getStops(subwayRoutes);

    // get stops with more than one route
    const subwayStopsWithConnections = this.getStopsWithConnections(
      subwayRoutes
    );

    return (
      <Fragment>
        <h1>MBTA API</h1>
        <h2>Subway Routes</h2>
        <ul>
          {subwayRoutes.map(({ id, name }) => (
            <li key={`subway-routes-${id}`}>
              <RouteIcon routeId={id} />
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
                  {stop.routes.map(({ id }) => (
                    <RouteIcon key={`connection-stops-${id}`} routeId={id} />
                  ))}
                </li>
              ))}
            </ul>
          </li>
        </ul>
        <h2>Trip Planner</h2>
        <select value={this.state.stopA} onChange={this.handleStopAChange}>
          <Fragment>
            {stops.map((stop) => (
              <option value={`option-a-${stop.id}`}>{stop.name}</option>
            ))}
          </Fragment>
        </select>
        <select value={this.state.stopB} onChange={this.handleStopBChange}>
          <Fragment>
            {stops.map((stop) => (
              <option value={`option-b-${stop.id}`}>{stop.name}</option>
            ))}
          </Fragment>
        </select>
      </Fragment>
    );
  }
}

export default App;
