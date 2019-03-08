import React from 'react';
import { shallow } from 'enzyme';
import axe from 'axe-core';
import { mountToDoc } from '../../tests/helpers';

import RouteIcon from './RouteIcon';

it('renders without crashing', () => {
  shallow(<RouteIcon />);
});

it('does not have accessibility violations', (done) => {
  const routeIconComponent = mountToDoc(<RouteIcon routeId="Blue" />);
  const routeIconNode = routeIconComponent.getDOMNode();

  const config = {
    rules: {
      'color-contrast': { enabled: false },
      'link-in-text-block': { enabled: false },
    },
  };
  axe.run(routeIconNode, config, (err, { violations }) => {
    expect(err).toBe(null);
    expect(violations).toHaveLength(0);
    done();
  });
});
