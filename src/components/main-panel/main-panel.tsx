import * as React from 'react';
import { Tabs } from '../tabs/tabs';
import { Tab } from '../tabs/tab';
import { SettingsTab } from '../settings-tab/settings-tab';
import { HistoryTab } from '../history-tab/history-tab';
import { SettingsService } from '../../services/settings-service';
import './main-panel.scss';

class MainPanel extends React.Component<any, any> {
  private tabs: Tab[] = [
    new Tab({name:'Session', content:<div>Session</div>}),
    new Tab({name:'Settings', content:<SettingsTab settingsService={SettingsService.getInstance()}></SettingsTab>}),
    new Tab({name:'History', content:<HistoryTab></HistoryTab>}),
  ];

  render() {
    return <Tabs activeTabName="Settings" tabs={this.tabs}></Tabs>
  }
}

export { MainPanel };
