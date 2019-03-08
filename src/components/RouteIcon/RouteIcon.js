import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ReactComponent as IconBlue } from '../../icons/Icon/Subway Line/Blue/Small.svg';
import { ReactComponent as IconGreenB } from '../../icons/Icon/Subway Line/Green B/Small.svg';
import { ReactComponent as IconGreenC } from '../../icons/Icon/Subway Line/Green C/Small.svg';
import { ReactComponent as IconGreenD } from '../../icons/Icon/Subway Line/Green D/Small.svg';
import { ReactComponent as IconGreenE } from '../../icons/Icon/Subway Line/Green E/Small.svg';
import { ReactComponent as IconMattapan } from '../../icons/Icon/Subway Line/Red - Mattapan/Small.svg';
import { ReactComponent as IconOrange } from '../../icons/Icon/Subway Line/Orange/Small.svg';
import { ReactComponent as IconRed } from '../../icons/Icon/Subway Line/Red/Small.svg';
import './RouteIcon.scss';

class RouteIcon extends Component {
  constructor() {
    super();

    this.icons = {
      Blue: <IconBlue aria-hidden focusable="false" />,
      'Green-B': <IconGreenB aria-hidden focusable="false" />,
      'Green-C': <IconGreenC aria-hidden focusable="false" />,
      'Green-D': <IconGreenD aria-hidden focusable="false" />,
      'Green-E': <IconGreenE aria-hidden focusable="false" />,
      Mattapan: <IconMattapan aria-hidden focusable="false" />,
      Orange: <IconOrange aria-hidden focusable="false" />,
      Red: <IconRed aria-hidden focusable="false" />,
    };
  }

  render() {
    const { routeId } = this.props;
    return <span>{this.icons[routeId]}</span>;
  }
}

RouteIcon.props = {
  routeId: PropTypes.string.isRequired,
};

export default RouteIcon;
