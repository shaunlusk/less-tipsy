import * as React from 'react';
import { Tabs } from '../tabs/tabs';
import { Tab } from '../tabs/tab';
import { SettingsTab } from '../settings-tab/settings-tab';
import { HistoryTab } from '../history-tab/history-tab';
import { SettingsService } from '../../services/settings-service';
import { SessionTab } from '../session-tab/session-tab';
import './main-panel.scss';
import { IActiveSession, ActiveSession } from '../../model/active-session';
import { VolumeUnit } from '../../model/unit';

interface IMainPanelState {
  tabs: Tab[];
}

class MainPanel extends React.Component<any, IMainPanelState> {
  private settingsService = SettingsService.getInstance();
  private activeSession: IActiveSession = new ActiveSession(
    this.settingsService.sessionMax, 
    this.settingsService.weeklyMax, 
    0,  // TODO Load from storage
    this.settingsService.consumptionRate);

  constructor(props: any) {
    super(props);

    this.state = {
      tabs: [
        new Tab({name:'Session', content:<SessionTab 
          lastDrink={this.activeSession.lastDrink ? this.activeSession.lastDrink.time : null}
          nextDrink={this.activeSession.nextDrinkTime}
          sessionTotal={this.activeSession.unitsConsumed}
          sessionRemaining={this.activeSession.sessionRemaining}
          hourlyRate={this.activeSession.hourlyRate}
          rollingWeeklyTotal={this.activeSession.rollingWeeklyTotal}
          rollingWeeklyRemaining={this.activeSession.rollingWeeklyRemaining}
          lastVolume={this.activeSession.lastDrink ? this.activeSession.lastDrink.volume : 12}
          lastAbv={this.activeSession.lastDrink ? this.activeSession.lastDrink.abv : 5}
          lastVolumeUnit={this.activeSession.lastDrink ? this.activeSession.lastDrink.volumeUnit : VolumeUnit.Ounces}
        ></SessionTab>}),
        new Tab({name:'Settings', content:<SettingsTab settingsService={this.settingsService}></SettingsTab>}),
        new Tab({name:'History', content:<HistoryTab></HistoryTab>})
      ]
    };
  }

  // private tabs: Tab[] = [
  //   new Tab({name:'Session', content:<SessionTab 
  //     lastDrink={this.activeSession.lastDrink ? this.activeSession.lastDrink.time : null}
  //     nextDrink={this.activeSession.nextDrinkTime}
  //     sessionTotal={this.activeSession.unitsConsumed}
  //     sessionRemaining={this.activeSession.sessionRemaining}
  //     hourlyRate={this.activeSession.hourlyRate}
  //     rollingWeeklyTotal={this.activeSession.rollingWeeklyTotal}
  //     rollingWeeklyRemaining={this.activeSession.rollingWeeklyRemaining}
  //     lastVolume={this.activeSession.lastDrink ? this.activeSession.lastDrink.volume : 12}
  //     lastAbv={this.activeSession.lastDrink ? this.activeSession.lastDrink.abv : 5}
  //     lastVolumeUnit={this.activeSession.lastDrink ? this.activeSession.lastDrink.volumeUnit : VolumeUnit.Ounces}
  //   ></SessionTab>}),
  //   new Tab({name:'Settings', content:<SettingsTab settingsService={this.settingsService}></SettingsTab>}),
  //   new Tab({name:'History', content:<HistoryTab></HistoryTab>}),
  // ];

  render() {
    return <Tabs activeTabName="Session" tabs={this.state.tabs}></Tabs>
  }
}

export { MainPanel };
