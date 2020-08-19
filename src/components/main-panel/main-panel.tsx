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
import { Drink } from '../../model/drink';

interface IMainPanelState {
  activeTabLabel: string;
  lastDrink: Date | null; 
  nextDrink: Date | null;
  sessionTotal: number;
  sessionRemaining: number;
  hourlyRate: number;
  rollingWeeklyTotal: number;
  rollingWeeklyRemaining: number;
  lastVolume: number;
  lastAbv: number;
  lastVolumeUnit: VolumeUnit;
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
      activeTabLabel: 'Session',
      lastDrink: this.activeSession.lastDrink ? this.activeSession.lastDrink.time : null, 
      nextDrink: this.activeSession.nextDrinkTime,
      sessionTotal: this.activeSession.unitsConsumed,
      sessionRemaining: this.activeSession.sessionRemaining,
      hourlyRate: this.activeSession.hourlyRate,
      rollingWeeklyTotal: this.activeSession.rollingWeeklyTotal,
      rollingWeeklyRemaining: this.activeSession.rollingWeeklyRemaining,
      lastVolume: this.activeSession.lastDrink ? this.activeSession.lastDrink.volume : 12,
      lastAbv: this.activeSession.lastDrink ? this.activeSession.lastDrink.abv : 5,
      lastVolumeUnit: this.activeSession.lastDrink ? this.activeSession.lastDrink.volumeUnit : VolumeUnit.Ounces,
    };
  }

  public addDrink(drink: Drink): void {
    this.activeSession.addDrink(drink);
    this.updateState();
  }

  public changeTab(label: string) {
    this.setState({activeTabLabel:label});
  }

  private updateState(): void {
    this.setState({
      lastDrink: this.activeSession.lastDrink ? this.activeSession.lastDrink.time : null, 
      nextDrink: this.activeSession.nextDrinkTime,
      sessionTotal: this.activeSession.unitsConsumed,
      sessionRemaining: this.activeSession.sessionRemaining,
      hourlyRate: this.activeSession.hourlyRate,
      rollingWeeklyTotal: this.activeSession.rollingWeeklyTotal,
      rollingWeeklyRemaining: this.activeSession.rollingWeeklyRemaining,
      lastVolume: this.activeSession.lastDrink ? this.activeSession.lastDrink.volume : 12,
      lastAbv: this.activeSession.lastDrink ? this.activeSession.lastDrink.abv : 5,
      lastVolumeUnit: this.activeSession.lastDrink ? this.activeSession.lastDrink.volumeUnit : VolumeUnit.Ounces,
    });
  }

  public render() {
    return <Tabs activeTabLabel={this.state.activeTabLabel} activeTabChanged={this.changeTab.bind(this)}>
      <Tab label="Session">
        <SessionTab 
          addDrink={this.addDrink.bind(this)}
          lastDrink={this.state.lastDrink}
          nextDrink={this.state.nextDrink}
          sessionTotal={this.state.sessionTotal}
          sessionRemaining={this.state.sessionRemaining}
          hourlyRate={this.state.hourlyRate}
          rollingWeeklyTotal={this.state.rollingWeeklyTotal}
          rollingWeeklyRemaining={this.state.rollingWeeklyRemaining}
          lastVolume={this.state.lastVolume}
          lastAbv={this.state.lastAbv}
          lastVolumeUnit={this.state.lastVolumeUnit}
        >
        </SessionTab>
      </Tab>
      <Tab label="Settings"><SettingsTab settingsService={this.settingsService}></SettingsTab></Tab>
      <Tab label="History"><HistoryTab></HistoryTab></Tab>
    </Tabs>
  }
}

export { MainPanel };
