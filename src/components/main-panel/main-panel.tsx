import * as React from 'react';
import './main-panel.scss';
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
import { HistoryService } from '../../services/history-service';
import { TrueFalseSelectionModal } from '../modal/modal-true-false-selection';

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

interface IHistoricalSessionState {
  unitsConsumed: number;
  sessionMax: number;
  weeklyMax: number;
  rollingWeekly: number;
  date: Date;
}

interface IHistoryState {
  sessions: IHistoricalSessionState[];
}

interface IMainPanelState {
  activeTabLabel: string;
  sessionState: ISessionState | null;
  history: IHistoryState;
  showCancelSessionWarning: boolean;
}

class MainPanel extends React.Component<any, IMainPanelState> {
  private _settingsService = SettingsService.getInstance();
  private _sessionService = new SessionService(new LocalStorageService());
  private _historyService = new HistoryService(new LocalStorageService());
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
    const history = this._historyService.loadHistory();
    if (history) {
      this._history = history;
    } else {
      this._history = new History();
    }

    this.state = {
      activeTabLabel: 'Session',
      sessionState: activeSession ? this.getUpdatedSessionState() : null,
      history: this._history,
      showCancelSessionWarning: false
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

  private getUpdatedHistorySate(): IHistoryState {
    const sessions: IHistoricalSessionState[] = this._history.sessions.map(session => ({
      unitsConsumed: session.unitsConsumed,
      sessionMax: session.sessionMax,
      weeklyMax: session.weeklyMax,
      rollingWeekly: session.rollingWeekly,
      date: session.date
    }));
    return {sessions};
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
    this._historyService.saveHistory(this._history);

    this._activeSession = new ActiveSession(
      this._settingsService.sessionMax, 
      this._settingsService.weeklyMax, 
      0,
      this._settingsService.consumptionRate);
    this._sessionService.saveSession(this._activeSession);
    this.setState({
      activeTabLabel:'Session',
      sessionState: null,
      history: this.getUpdatedHistorySate()
    });
  }

  public showCancelSessionWarning(): void {
    this.setState({showCancelSessionWarning: true});
  }

  public confirmCancelSession(result: boolean) {
    if (result) {
      this._activeSession = new ActiveSession(
        this._settingsService.sessionMax, 
        this._settingsService.weeklyMax, 
        0,
        this._settingsService.consumptionRate);
      this._sessionService.deleteSession();
      this.setState({
        activeTabLabel:'Session',
        sessionState: null,
        showCancelSessionWarning: false
      });
    } else {
      this.setState({showCancelSessionWarning: false});
    }
  }

  public render() {
    return <Tabs activeTabLabel={this.state.activeTabLabel} activeTabChanged={this.changeTab.bind(this)}>
      {this.state.sessionState ? 
        <Tab label="Session">
          <ActiveSessionPanel 
            addDrink={this.addDrink.bind(this)}
            finishSession={this.finishSession.bind(this)}
            cancelSession={this.showCancelSessionWarning.bind(this)}
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
          <TrueFalseSelectionModal 
            title="Cancel Session?"
            show={this.state.showCancelSessionWarning}
            acceptText="Cancel Session" 
            rejectText="Keep Current Session" 
            handleClose={this.confirmCancelSession.bind(this)}
          >
            Are you sure you want to cancel the current session?  This cannot be undone!
          </TrueFalseSelectionModal>
        </Tab>
      : <Tab label="Session">
          <NoSessionPanel onBeginNewSession={this.beginNewSession.bind(this)}></NoSessionPanel>
        </Tab> }
      <Tab label="Settings"><SettingsPanel settingsService={this._settingsService}></SettingsPanel></Tab>
      <Tab label="History"><HistoryPanel sessions={this.state.history.sessions}></HistoryPanel></Tab>
    </Tabs>
  }
}

export { MainPanel };
