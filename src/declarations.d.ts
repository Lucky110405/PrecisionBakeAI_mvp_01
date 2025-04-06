declare module '*.jsx' {
  import React from 'react';
  const Component: React.ComponentType<any>;
  export default Component;
}

declare module '*.js' {
  const exportedValue: any;
  export default exportedValue;
}