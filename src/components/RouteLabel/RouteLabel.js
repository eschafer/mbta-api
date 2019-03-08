import React, { Component } from 'react';
import './RouteLabel.scss';

class RouteLabel extends Component {
  render() {
    const { children, routeId } = this.props;

    return (
      <span className={`route-label ${routeId.toLowerCase()}`}>{children}</span>
    );
  }
}

export default RouteLabel;
