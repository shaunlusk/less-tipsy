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

interface ISessionState {
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

interface IMainPanelState {
  activeTabLabel: string;
  sessionState: ISessionState | null;
}

class MainPanel extends React.Component<any, IMainPanelState> {
  private _settingsService = SettingsService.getInstance();
  private _sessionService = new SessionService(new LocalStorageService());
  private _activeSession: IActiveSession;

  constructor(props: any) {
    super(props);
    const activeSession = this._sessionService.loadSession();
    if (activeSession) {
      this._activeSession = activeSession;
    } else {
      this._activeSession = new ActiveSession(
        this._settingsService.sessionMax, 
        this._settingsService.weeklyMax, 
        0,
        this._settingsService.consumptionRate);
    }

    this.state = {
      activeTabLabel: 'Session',
      sessionState: activeSession ? this.getUpdatedSessionState() : null
    };
  }

  public addDrink(drink: Drink): void {
    this._activeSession.addDrink(drink);
    this._sessionService.saveSession(this._activeSession);
    this.setState({ sessionState: this.getUpdatedSessionState() }); 
  }

  public changeTab(label: string) {
    this.setState({activeTabLabel:label});
  }

  private getUpdatedSessionState(): ISessionState {
    const sessionState: ISessionState = {
      lastDrink: this._activeSession.lastDrink, 
      nextDrinkTime: this._activeSession.nextDrinkTime,
      sessionTotal: this._activeSession.unitsConsumed,
      sessionRemaining: this._activeSession.sessionRemaining,
      hourlyRate: this._activeSession.hourlyRate,
      rollingWeeklyTotal: this._activeSession.rollingWeeklyTotal,
      rollingWeeklyRemaining: this._activeSession.rollingWeeklyRemaining,
      lastVolume: this._activeSession.lastDrink ? this._activeSession.lastDrink.volume : 12,
      lastAbv: this._activeSession.lastDrink ? this._activeSession.lastDrink.abv : 5,
      lastVolumeUnit: this._activeSession.lastDrink ? this._activeSession.lastDrink.volumeUnit : VolumeUnit.Ounces  
    };

    return sessionState;
  }

  private beginNewSession(): void {
    this.setState({
      activeTabLabel:'Session',
      sessionState: this.getUpdatedSessionState()
    });
  }

  public render() {
    return <Tabs activeTabLabel={this.state.activeTabLabel} activeTabChanged={this.changeTab.bind(this)}>
      {this.state.sessionState ? 
        <Tab label="Session">
          <ActiveSessionPanel 
            addDrink={this.addDrink.bind(this)}
            lastDrink={this.state.sessionState.lastDrink}
            nextDrinkTime={this.state.sessionState.nextDrinkTime}
            sessionTotal={this.state.sessionState.sessionTotal}
            sessionRemaining={this.state.sessionState.sessionRemaining}
            hourlyRate={this.state.sessionState.hourlyRate}
            rollingWeeklyTotal={this.state.sessionState.rollingWeeklyTotal}
            rollingWeeklyRemaining={this.state.sessionState.rollingWeeklyRemaining}
            lastVolume={this.state.sessionState.lastVolume}
            lastAbv={this.state.sessionState.lastAbv}
            lastVolumeUnit={this.state.sessionState.lastVolumeUnit}
          >
          </ActiveSessionPanel>
        </Tab>
      : <Tab label="Session">
          <NoSessionPanel onBeginNewSession={this.beginNewSession.bind(this)}></NoSessionPanel>
        </Tab> }
      <Tab label="Settings"><SettingsPanel settingsService={this._settingsService}></SettingsPanel></Tab>
      <Tab label="History"><HistoryPanel></HistoryPanel></Tab>
    </Tabs>
  }
}

export { MainPanel };
