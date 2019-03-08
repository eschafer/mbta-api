const getResource = async (
  { fields, filters, name, sort } = { fields: [], filters: [] }
) => {
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
};

export const getSubwayRoutes = async () => {
  const subwayRoutes = [];

  // Load subway routes, only including relevant data for bandwith/performance
  // reasons.
  const routes = await getResource({
    // subway includes "light rail" (type = 0) and "heavy rail" (type = 1)
    filters: [['type', '0,1']],
    fields: [['route', 'long_name']],
    name: 'routes',
  });

  // Get stops for each route
  // We're using for await...of instead of forEach, because forEach won't
  // work asynchronously. We want to wait for everything to be loaded before
  // rendering it.
  for await (let route of routes.data) {
    const stops = await getResource({
      filters: [['route', route.id]],
      fields: [['stop', 'name']],
      name: 'stops',
    });
    subwayRoutes.push({
      id: route.id,
      name: route.attributes.long_name,
      stops: stops.data.map((node) => ({
        id: node.id,
        name: node.attributes.name,
      })),
    });

    // sort routes by name
    subwayRoutes.sort((routeA, routeB) => {
      if (routeA.name < routeB.name) return -1;
      if (routeA.name > routeB.name) return 1;
      return 0;
    });
  }

  return subwayRoutes;
};
