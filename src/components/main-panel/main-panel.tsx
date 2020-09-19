import * as React from 'react';
import './main-panel.scss';
import { Tabs } from '../tabs/tabs';
import { Tab } from '../tabs/tab';
import { SettingsPanel } from '../settings-panel/settings-panel';
import { HistoryPanel } from '../history-panel/history-panel';
import { SettingsService } from '../../services/settings-service';
import { ActiveSessionPanel } from '../session-panel/active-session-panel/active-session-panel';
import { ActiveSession } from '../../model/active-session';
import { VolumeUnit } from '../../model/unit';
import { Drink } from '../../model/drink';
import { History } from '../../model/history';
import { NoSessionPanel } from '../session-panel/no-session-panel/no-session-panel';
import { SessionService } from '../../services/session-service';
import { HistoricalSession } from '../../model/historical-session';
import { HistoryService } from '../../services/history-service';
import { TrueFalseSelectionModal } from '../modal/modal-true-false-selection';
import { IHistorySessionDto } from '../../model/history-session-dto';

interface ISettingsState {
  sessionMax: string;
  weeklyMax: string;
  units: string;
  hours: string;
  historySessionsToKeep: string;
  areInputsValid: boolean;
  changesExist: boolean;
}

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
  settingsState: ISettingsState;
  sessionState: ISessionState | null;
  history: IHistoryState;
  showCancelSessionWarning: boolean;
  showDeleteHistoryWarning: boolean;
}

export interface IMainPanelProps {
  settingsService: SettingsService;
  sessionService: SessionService;
  historyService: HistoryService;
}

class MainPanel extends React.Component<IMainPanelProps, IMainPanelState> {
  private _settingsService: SettingsService;
  private _sessionService: SessionService;
  private _historyService: HistoryService;
  private _activeSession: ActiveSession | null;
  private _history: History;

  constructor(props: IMainPanelProps) {
    super(props);
    this._settingsService = props.settingsService;
    this._sessionService = props.sessionService;
    this._historyService = props.historyService;
    this._activeSession = this._loadSession();
    this._history = this._loadHistory();

    this.state = {
      activeTabLabel: 'History',
      sessionState: this._activeSession ? this._getUpdatedSessionState() : null,
      history: this._history,
      showCancelSessionWarning: false,
      showDeleteHistoryWarning: false,
      settingsState: this._getSettingsStateFromService()
    };
  }

  private _loadHistory(): History {
    let history = this._historyService.loadHistory();
    if (!history) {
      history = new History();
    }
    return history;
  }

  private _loadSession(): ActiveSession | null {
    let activeSession = this._sessionService.loadSession();
    return activeSession;
  }

  private _refreshHistory(): void {
    this._historyService.saveHistory(this._history);
    this._history = this._loadHistory();
    this.setState({history: this._getUpdatedHistorySate()});
  }

  private _refreshSettings(): void {
    const newSettingsState = this._getSettingsStateFromService();
    this.setState({settingsState: newSettingsState});
  }

  private _addDrink(drink: Drink): void {
    if (!this._activeSession) {
      throw new Error('No Active Session.');
    }
    this._activeSession.addDrink(drink);
    this._sessionService.saveSession(this._activeSession);
    this.setState({ sessionState: this._getUpdatedSessionState() }); 
  }

  private _changeTab(label: string) {
    this.setState({activeTabLabel:label});
  }

  private _getUpdatedSessionState(): ISessionState {
    if (!this._activeSession) {
      throw new Error('No Active Session.');
    }
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

  private _getUpdatedHistorySate(): IHistoryState {
    const sessions: IHistoricalSessionState[] = this._history.sessions.map(session => ({
      unitsConsumed: session.unitsConsumed,
      sessionMax: session.sessionMax,
      weeklyMax: session.weeklyMax,
      rollingWeekly: session.rollingWeekly,
      date: session.date
    }));
    return {sessions};
  }

  private _beginNewSession(): void {
    this._activeSession = new ActiveSession(
      this._settingsService.sessionMax, 
      this._settingsService.weeklyMax, 
      this._getRollingWeeklyTotal(),
      this._settingsService.consumptionRate);
    this._sessionService.saveSession(this._activeSession);

    this.setState({
      activeTabLabel:'Session',
      sessionState: this._getUpdatedSessionState()
    });
  }

  private _getRollingWeeklyTotal(): number {
    let rollingWeeklyTotal = 0;
    const week = 1000 * 60 * 60 * 24 * 7;
    const pastWeek = new Date(Date.now() - week);
    let idx = this._history.sessions.length - 1;
    while (idx >= 0) {
      const session = this._history.sessions[idx];
      if (session.date < pastWeek) break;
      rollingWeeklyTotal += session.unitsConsumed;
      idx--;
    }
    return rollingWeeklyTotal;
  }

  private _finishSession(): void {
    if (!this._activeSession) {
      throw new Error('No Active Session.');
    }
    const histSession = new HistoricalSession(
      this._activeSession.unitsConsumed,
      this._activeSession.date,
      this._activeSession.sessionMax,
      this._activeSession.weeklyMax,
      this._activeSession.rollingWeeklyTotal
    );
    this._history.addSession(histSession);
    this._refreshHistory();

    this.setState({
      activeTabLabel:'Session',
      sessionState: null
    });
  }

  private _warnCancelSession(): void {
    this.setState({showCancelSessionWarning: true});
  }

  private _finishCancelSession(result: boolean): void {
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

  private _warnDeleteHistory(): void {
    this.setState({showDeleteHistoryWarning: true});
  }

  private _finishDeleteHistory(result: boolean): void {
    if (result) {
      this._historyService.deleteHistory();
      this._history = new History();
      this.setState({
        history: this._history,
        showDeleteHistoryWarning: false
      });
    }  else {
      this.setState({showDeleteHistoryWarning: false});
    }
  }

  private _areSettingsValid(newSettingsState: ISettingsState): boolean {
    if (!this._hasValue(newSettingsState.weeklyMax) 
      || !this._hasValue(newSettingsState.sessionMax)
      || !this._hasValue(newSettingsState.units)
      || !this._hasValue(newSettingsState.hours)
      || !this._hasValue(newSettingsState.historySessionsToKeep)) {
      return false;
    }

    return true;
  }

  private _hasValue(value: string): boolean {
    return value !== null && value.trim().length > 0;
  }

  private _validateStateSettings(newSettingsState: ISettingsState) {
    if (this._areSettingsValid(newSettingsState)) {
      newSettingsState.areInputsValid = true;
    } else {
      newSettingsState.areInputsValid = false;
    }
  }

  private _handleChangeSettingSessionMax(value: string): void {
    const newSettingsState: ISettingsState = {...this.state.settingsState, sessionMax: value};
    if (value !== this.state.settingsState.sessionMax) {
      newSettingsState.changesExist = true;
    }
    this._validateStateSettings(newSettingsState);
    this.setState({settingsState: newSettingsState});
  }

  private _handleChangeSettingWeeklyMax(value: string): void {
    const newSettingsState: ISettingsState = {...this.state.settingsState, weeklyMax: value};
    if (value !== this.state.settingsState.weeklyMax) {
      newSettingsState.changesExist = true;
    }
    this._validateStateSettings(newSettingsState);
    this.setState({settingsState: newSettingsState});
  }

  private _handleChangeSettingUnits(value: string): void {
    const newSettingsState: ISettingsState = {...this.state.settingsState, units: value};
    if (value !== this.state.settingsState.units) {
      newSettingsState.changesExist = true;
    }
    this._validateStateSettings(newSettingsState);
    this.setState({settingsState: newSettingsState});
  }

  private _handleChangeSettingHours(value: string): void {
    const newSettingsState: ISettingsState = {...this.state.settingsState, hours: value};
    if (value !== this.state.settingsState.hours) {
      newSettingsState.changesExist = true;
    }
    this._validateStateSettings(newSettingsState);
    this.setState({settingsState: newSettingsState});
  }

  private _handleChangeSettingHistorySessions(value: string): void {
    const newSettingsState: ISettingsState = {...this.state.settingsState, historySessionsToKeep: value};
    if (value !== this.state.settingsState.historySessionsToKeep) {
      newSettingsState.changesExist = true;
    }
    this._validateStateSettings(newSettingsState);
    this.setState({settingsState: newSettingsState});
  }

  private _handleCancelSettingsChanges(): void {
    this._refreshSettings();
  }

  private _handleRestoreDefaultSettings(): void {
    this.props.settingsService.restoreDefaults();
    this._historyService.sessionsToKeep = this.props.settingsService.historySessionsToKeep;
    const newSettingsState = this._getSettingsStateFromService();
    this.setState({settingsState: newSettingsState});
  }

  private _getSettingsStateFromService(): ISettingsState {
    return {
      weeklyMax: this._settingsService.weeklyMax.toString(),
      sessionMax: this._settingsService.sessionMax.toString(),
      units: this._settingsService.alcoholUnits.toString(),
      hours: this._settingsService.hours.toString(),
      historySessionsToKeep: this._settingsService.historySessionsToKeep.toString(),
      areInputsValid: true,
      changesExist: false
    };
  }
  
  private _handleSaveSettings(): void {
    const sessionsToKeep = parseInt(this.state.settingsState.historySessionsToKeep);
    this._settingsService.updateSettings({
      weeklyMax: parseFloat(this.state.settingsState.weeklyMax),
      sessionMax: parseFloat(this.state.settingsState.sessionMax),
      alcoholUnits: parseFloat(this.state.settingsState.units),
      hours: parseFloat(this.state.settingsState.hours),
      historySessionsToKeep: sessionsToKeep,
    });
    this._historyService.sessionsToKeep = sessionsToKeep;
    this._refreshHistory();
    this._refreshSettings();
  }

  private _importHistory(sessions: IHistorySessionDto[]): void {
    for (const session of sessions) {
      this._history.addSession(new HistoricalSession(
        session.unitsConsumed,
        session.date,
        session.sessionMax,
        session.weeklyMax,
        session.rollingWeekly
      ));
    }
    this._history.sessions.sort((a, b) => a.date < b.date ? -1 : a.date === b.date ? 0 : 1);
    this._refreshHistory();
  }

  public render() {
    return <Tabs activeTabLabel={this.state.activeTabLabel} activeTabChanged={this._changeTab.bind(this)}>
      {this.state.sessionState ? 
        <Tab label="Session">
          <ActiveSessionPanel 
            addDrink={this._addDrink.bind(this)}
            finishSession={this._finishSession.bind(this)}
            cancelSession={this._warnCancelSession.bind(this)}
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
            handleClose={this._finishCancelSession.bind(this)}
          >
            Are you sure you want to cancel the current session?  This cannot be undone!
          </TrueFalseSelectionModal>
        </Tab>
      : <Tab label="Session">
          <NoSessionPanel onBeginNewSession={this._beginNewSession.bind(this)}></NoSessionPanel>
        </Tab> }
      <Tab label="Settings"><SettingsPanel 
        sessionMax={this.state.settingsState.sessionMax}
        weeklyMax={this.state.settingsState.weeklyMax} 
        units={this.state.settingsState.units}
        hours={this.state.settingsState.hours}
        historySessionsToKeep={this.state.settingsState.historySessionsToKeep}
        changesExist={this.state.settingsState.changesExist}
        areInputsValid={this.state.settingsState.areInputsValid}
        onChangeSessionMax={this._handleChangeSettingSessionMax.bind(this)}
        onChangeWeeklyMax={this._handleChangeSettingWeeklyMax.bind(this)}
        onChangeUnits={this._handleChangeSettingUnits.bind(this)}
        onChangeHours={this._handleChangeSettingHours.bind(this)}
        onChangeHistorySessions={this._handleChangeSettingHistorySessions.bind(this)}
        onCancelChanges={this._handleCancelSettingsChanges.bind(this)}
        onRestoreDefaults={this._handleRestoreDefaultSettings.bind(this)}
        onSaveSettings={this._handleSaveSettings.bind(this)}
      ></SettingsPanel></Tab>
      <Tab label="History">
        <HistoryPanel 
          sessions={this.state.history.sessions} 
          deleteHistory={this._warnDeleteHistory.bind(this)}
          importHistory={this._importHistory.bind(this)}
        ></HistoryPanel>
        <TrueFalseSelectionModal 
            title="Delete Session?"
            show={this.state.showDeleteHistoryWarning}
            acceptText="Delete History" 
            rejectText="Keep History" 
            handleClose={this._finishDeleteHistory.bind(this)}
          >
            Are you sure you want to delete the <b>entire</b> history?  This cannot be undone!
          </TrueFalseSelectionModal>
      </Tab>
    </Tabs>
  }
}

export { MainPanel };
