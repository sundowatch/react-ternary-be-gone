import React from 'react';

const Case = ({ when, children, default: isDefault = false }) => {
  // This component is just a marker for Conditional to process
  return <>{children}</>;
};

export default Case;
