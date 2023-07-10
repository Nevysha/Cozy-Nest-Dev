import React, { createContext, useState, useEffect, useContext } from 'react';

import defaultConfig from '@client/default-config.json';

const savedConfig = localStorage.getItem('COZY_NEST_CONFIG');

// Create the context
export const ConfigContext = createContext(null);

// Create a provider component
export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(savedConfig || defaultConfig);

  useEffect(() => {

    // Fetch the configuration when the component mounts
    //TODO NEVYSHA - ensure it's called once
    (async () => {
      const response = await fetch(`/cozy-nest/config`);
      const data = await response.json();
      localStorage.setItem('COZY_NEST_CONFIG', JSON.stringify(data));
      setConfig(data);
    })();
  }, []);

  // Provide the config to children
  return (
    <ConfigContext.Provider value={config}>
      {children}
    </ConfigContext.Provider>
  );
};

// Create a hook to use the context
export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};
