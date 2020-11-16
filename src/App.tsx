import React from 'react';
import { MainPanel } from './components/main-panel/main-panel';
import './App.scss';
import { Initializer } from './services/initializer';

function App() {
  const initializer = new Initializer();
  return (
    <div className="App">
      <h1>Less Tipsy</h1>
      <MainPanel 
        settingsService={initializer.settingsService}
        sessionService={initializer.sessionService}
        historyService={initializer.historyService}
        mainStateService={initializer.mainStateService}
        installService={initializer.installService}
      />
    </div>
  );
}

export default App;
