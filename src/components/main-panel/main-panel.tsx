import * as React from 'react';
import { Tabs } from '../tabs/tabs';
import { Tab } from '../tabs/tab';
import { SettingsPanel } from '../settings-panel/settings-panel';
import { HistoryPanel } from '../history-panel/history-panel';
import './main-panel.scss';

class MainPanel extends React.Component<any, any> {
  private tabs: Tab[] = [
    new Tab({name:'Session', content:<div>Session</div>}),
    new Tab({name:'Settings', content:<SettingsPanel></SettingsPanel>}),
    new Tab({name:'History', content:<HistoryPanel></HistoryPanel>}),
  ];

  render() {
    return <Tabs activeTabName="Settings" tabs={this.tabs}></Tabs>
  }
}

export { MainPanel };
