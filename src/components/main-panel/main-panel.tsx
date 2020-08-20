import * as React from 'react';
import { Tabs } from '../tabs/tabs';
import { Tab } from '../tabs/tab';
import { SettingsPanel } from '../settings-panel/settings-panel';
import { HistoryPanel } from '../history-panel/history-panel';
import { SettingsService } from '../../services/settings-service';
import { ActiveSessionPanel } from '../session-panel/active-session-panel/active-session-panel';
import { IActiveSession, ActiveSession } from '../../model/active-session';
import { VolumeUnit } from '../../model/unit';
import { Drink } from '../../model/drink';
import { NoSessionPanel } from '../session-panel/no-session-panel/no-session-panel';
import './main-panel.scss';
import { SessionService } from '../../services/session-service';
import { LocalStorageService } from '../../services/local-storage-service';

interface IMainPanelState {
  activeTabLabel: string;
  activeSessionExists: boolean;
  lastDrink: Drink | null; 
  nextDrinkTime: Date | null;
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
  private sessionService = new SessionService(new LocalStorageService());
  private activeSession: IActiveSession = new ActiveSession(
    this.settingsService.sessionMax, 
    this.settingsService.weeklyMax, 
    0,  // TODO Load from storage
    this.settingsService.consumptionRate);

  constructor(props: any) {
    super(props);

    this.state = {
      activeTabLabel: 'NoSession',
      activeSessionExists: false,
      lastDrink: this.activeSession.lastDrink, 
      nextDrinkTime: this.activeSession.nextDrinkTime,
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
      lastDrink: this.activeSession.lastDrink, 
      nextDrinkTime: this.activeSession.nextDrinkTime,
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

  private beginNewSession(): void {
    this.setState({activeTabLabel:'Session'});
  }

  public render() {
    return <Tabs activeTabLabel={this.state.activeTabLabel} activeTabChanged={this.changeTab.bind(this)}>
      <Tab label="NoSession">
        <NoSessionPanel onBeginNewSession={this.beginNewSession.bind(this)}></NoSessionPanel>
      </Tab>
      <Tab label="Session">
        <ActiveSessionPanel 
          addDrink={this.addDrink.bind(this)}
          lastDrink={this.state.lastDrink}
          nextDrinkTime={this.state.nextDrinkTime}
          sessionTotal={this.state.sessionTotal}
          sessionRemaining={this.state.sessionRemaining}
          hourlyRate={this.state.hourlyRate}
          rollingWeeklyTotal={this.state.rollingWeeklyTotal}
          rollingWeeklyRemaining={this.state.rollingWeeklyRemaining}
          lastVolume={this.state.lastVolume}
          lastAbv={this.state.lastAbv}
          lastVolumeUnit={this.state.lastVolumeUnit}
        >
        </ActiveSessionPanel>
      </Tab>
      <Tab label="Settings"><SettingsPanel settingsService={this.settingsService}></SettingsPanel></Tab>
      <Tab label="History"><HistoryPanel></HistoryPanel></Tab>
    </Tabs>
  }
}

export { MainPanel };
