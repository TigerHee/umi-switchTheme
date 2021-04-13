// import React from 'react';
import { withRouter } from 'react-router';

const withRouterHOC = () => Components => {

  return withRouter(Components);
};

export default withRouterHOC;
