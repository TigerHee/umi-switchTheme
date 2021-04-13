import React, { useState } from 'react';
import { Waypoint } from 'react-waypoint';

const WaitWaypoint = ({ children }) => {
  const [watch, setWatch] = useState(false);

  return (
    <Waypoint onEnter={() => setWatch(true)}>
      {watch ? children : null}
    </Waypoint>
  );
};

export default WaitWaypoint;
