import React from 'react';

import './Body.scss';

const Body: React.FC = (props) => {
  return <React.Fragment>{props.children}</React.Fragment>;
};

export default Body;
