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
import { History } from '../../model/history';
import { NoSessionPanel } from '../session-panel/no-session-panel/no-session-panel';
import { SessionService } from '../../services/session-service';
import { LocalStorageService } from '../../services/local-storage-service';
import { HistoricalSession } from '../../model/historical-session';
import './main-panel.scss';

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
  history: History;
}

class MainPanel extends React.Component<any, IMainPanelState> {
  private _settingsService = SettingsService.getInstance();
  private _sessionService = new SessionService(new LocalStorageService());
  private _activeSession: IActiveSession;
  private _history: History;

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
    this._history = new History();

    this.state = {
      activeTabLabel: 'Session',
      sessionState: activeSession ? this.getUpdatedSessionState() : null,
      history: this._history
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

  private finishSession(): void {
    const histSession = new HistoricalSession(
      this._activeSession.unitsConsumed,
      this._activeSession.date,
      this._activeSession.sessionMax,
      this._activeSession.weeklyMax,
      this._activeSession.rollingWeeklyTotal
    );
    this._history.addSession(histSession);

    this._activeSession = new ActiveSession(
      this._settingsService.sessionMax, 
      this._settingsService.weeklyMax, 
      0,
      this._settingsService.consumptionRate);
    this._sessionService.saveSession(this._activeSession);
    this.setState({
      activeTabLabel:'Session',
      sessionState: null,
      history: this._history
    });
  }

  public render() {
    return <Tabs activeTabLabel={this.state.activeTabLabel} activeTabChanged={this.changeTab.bind(this)}>
      {this.state.sessionState ? 
        <Tab label="Session">
          <ActiveSessionPanel 
            addDrink={this.addDrink.bind(this)}
            finishSession={this.finishSession.bind(this)}
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
      <Tab label="History"><HistoryPanel history={this.state.history}></HistoryPanel></Tab>
    </Tabs>
  }
}

export { MainPanel };
