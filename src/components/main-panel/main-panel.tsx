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
import { TrueFalseSelectionModal } from '../modal-true-false-selection/modal-true-false-selection';
import { IHistorySessionDto } from '../../model/history-session-dto';
import { AboutPanel } from '../about-panel/about-panel';
import { MainStateService } from '../../services/main-state-service';
import { Disclaimer } from '../disclaimer/disclaimer';
import { HowToPanel } from '../how-to-panel/how-to-panel';
import { DisplayMode, InstallService } from '../../services/install-service';

const MINUTE = 1000 * 60;
const TIMEOUT_CHECK_INTERVAL = MINUTE * 2;
const TIMEOUT_AFTER =  MINUTE * 120;

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
  sessionMax: number;
  hourlyRate: number;
  hourlyRateMax: number;
  rollingWeeklyTotal: number;
  rollingWeeklyRemaining: number;
  rollingWeeklyMax: number;
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
  showDisclaimer: boolean;
  showTimeoutPrompt: boolean;
  showInstallButton: boolean;
  displayMode: DisplayMode,
  installable: boolean;
}

export interface IMainPanelProps {
  settingsService: SettingsService;
  sessionService: SessionService;
  historyService: HistoryService;
  mainStateService: MainStateService;
  installService: InstallService;
  version: string;
}

class MainPanel extends React.Component<IMainPanelProps, IMainPanelState> {
  private _settingsService: SettingsService;
  private _sessionService: SessionService;
  private _historyService: HistoryService;
  private _mainStateService: MainStateService;
  private _installService: InstallService;
  private _activeSession: ActiveSession | null;
  private _history: History;
  private _lastTimeoutCheckTime: Date;

  constructor(props: IMainPanelProps) {
    super(props);
    this._settingsService = props.settingsService;
    this._sessionService = props.sessionService;
    this._historyService = props.historyService;
    this._mainStateService = props.mainStateService;
    this._installService = props.installService;
    this._activeSession = this._loadSession();
    this._history = this._loadHistory();

    this._lastTimeoutCheckTime = this._activeSession?.lastDrink?.time || new Date();

    const viewedHowToTab = this._mainStateService.viewedHowToTab;
    this.state = {
      activeTabLabel: viewedHowToTab ? 'Session' : 'How-To',
      sessionState: this._activeSession ? this._getUpdatedSessionState() : null,
      history: this._history,
      showCancelSessionWarning: false,
      showDeleteHistoryWarning: false,
      settingsState: this._getSettingsStateFromService(),
      showDisclaimer: !this._mainStateService.acceptedDisclaimer,
      showTimeoutPrompt: false,
      showInstallButton: false,
      displayMode: DisplayMode.BROWSERTAB,
      installable: false
    };
  }

  public componentDidMount():void {
    this._setCheckForTimeout();
    this._installService.addDisplayModeSetListener(result => {
      this.setState(prevState => {
        return {
          showInstallButton: result === DisplayMode.BROWSERTAB && prevState.installable,
          displayMode: result
        };
      });
    });
    this._installService.addInstallAvailableListener(() => {
      this.setState(prevState => {
        return {
          showInstallButton: prevState.displayMode === DisplayMode.BROWSERTAB,
          installable: true
        };
      });
    });
  }

  private _promptForInstall(): void {
    this._installService.promptToInstall(() => {
      this.setState({showInstallButton: false});
    });
  }

  private _setCheckForTimeout(): void {
    setInterval(this._checkTimeForTimeout.bind(this), TIMEOUT_CHECK_INTERVAL);
  }

  private _checkTimeForTimeout(): void {
    if (this._passedTimeout()) {
      this.setState({
        showTimeoutPrompt: true,
        activeTabLabel: 'Session'
      });
    }
  }

  private _passedTimeout(): boolean {
    if (!this.state.sessionState) {
      return false;
    }
    const currentTime = new Date();

    const diff = currentTime.valueOf() - this._lastTimeoutCheckTime.valueOf();
    if (diff >= TIMEOUT_AFTER) {
      return true;
    }
    return false;
  }

  private _acceptDisclaimer(): void {
    this._mainStateService.acceptedDisclaimer = true;
    this.setState({showDisclaimer: false});
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

  private _getRollingWeeklyRemaining(): number {
    const remaining = this._settingsService.weeklyMax - this._getRollingWeeklyTotal();
    return remaining < 0 ? 0 : remaining;
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
      sessionMax: this._settingsService.sessionMax,
      hourlyRate: this._activeSession.hourlyRate,
      hourlyRateMax: this._settingsService.consumptionRate,
      rollingWeeklyTotal: this._getRollingWeeklyTotal(),
      rollingWeeklyRemaining: this._getRollingWeeklyRemaining(),
      rollingWeeklyMax: this._settingsService.weeklyMax,
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
      this._settingsService.consumptionRate);
    this._sessionService.saveSession(this._activeSession);
    this._lastTimeoutCheckTime = new Date();

    this.setState({
      activeTabLabel:'Session',
      sessionState: this._getUpdatedSessionState()
    });
  }

  private _getRollingWeeklyTotal(): number {
    let rollingWeeklyTotal = 0;
    const week = 1000 * 60 * 60 * 24 * 7;
    const pastWeek = new Date(this._activeSession!.date.getTime() - week);
    let idx = this._history.sessions.length - 1;
    while (idx >= 0) {
      const session = this._history.sessions[idx];
      if (session.date < pastWeek) break;
      rollingWeeklyTotal += session.unitsConsumed;
      idx--;
    }
    return rollingWeeklyTotal + this._activeSession!.unitsConsumed;
  }

  private _finishSession(): void {
    if (!this._activeSession) {
      throw new Error('No Active Session.');
    }
    const histSession = new HistoricalSession(
      this._activeSession.unitsConsumed,
      this._activeSession.date,
      this._activeSession.sessionMax,
      this._settingsService.weeklyMax,
      this._getRollingWeeklyTotal()
    );
    this._history.addSession(histSession);
    this._refreshHistory();

    this._activeSession = null;
    this._sessionService.deleteSession();

    this.setState({
      activeTabLabel:'Session',
      sessionState: null,
      showTimeoutPrompt: false
    });
  }

  private _warnCancelSession(): void {
    this.setState({showCancelSessionWarning: true});
  }

  private _finishCancelSession(result: boolean): void {
    if (result) {
      this._activeSession = new ActiveSession(
        this._settingsService.sessionMax, 
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

  private _handleDeleteLastDrink(): void {
    this._activeSession!.deleteLast();
    this._sessionService.saveSession(this._activeSession!);
    const newSessionState = this._getUpdatedSessionState();
    this.setState({sessionState: newSessionState});
  }

  private _handleSessionTimeout(result: boolean) {
    if (result) {
      this._finishSession();
    } else {
      this._lastTimeoutCheckTime = new Date();
      this.setState({
        showTimeoutPrompt: false
      });
    }
  }

  public render() {
    return <React.Fragment>{this.state.showDisclaimer ? <Disclaimer accept={this._acceptDisclaimer.bind(this)}></Disclaimer>
      : <div>
        {this.state.showInstallButton 
          ? <div className="add-button" onClick={this._promptForInstall.bind(this)}>
            <img id="add-icon" alt="Add to Home Screen" src="./beer192.png"></img>
            <label htmlFor="add-icon">Add to Home Screen</label>
          </div>
          : null}
        <Tabs activeTabLabel={this.state.activeTabLabel} activeTabChanged={this._changeTab.bind(this)}>
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
              sessionMax={this.state.sessionState.sessionMax}
              hourlyRate={this.state.sessionState.hourlyRate}
              hourlyRateMax={this.state.sessionState.hourlyRateMax}
              rollingWeeklyTotal={this.state.sessionState.rollingWeeklyTotal}
              rollingWeeklyRemaining={this.state.sessionState.rollingWeeklyRemaining}
              rollingWeeklyMax={this.state.sessionState.rollingWeeklyMax}
              lastVolume={this.state.sessionState.lastVolume}
              lastAbv={this.state.sessionState.lastAbv}
              lastVolumeUnit={this.state.sessionState.lastVolumeUnit}
              deleteLastDrink={this._handleDeleteLastDrink.bind(this)}
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
            <TrueFalseSelectionModal 
              title="Finish Session?"
              show={this.state.showTimeoutPrompt}
              acceptText="Finish Session" 
              rejectText="Keep Current Session" 
              handleClose={this._handleSessionTimeout.bind(this)}
            >
              It has been more than 2 hours since your last drink.  Would you like to finish the current session?
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
        <Tab label="How-To">
          <HowToPanel viewedHowToPanel={() => this._mainStateService.viewedHowToTab = true}></HowToPanel>
        </Tab>
        <Tab label="About">
          <AboutPanel></AboutPanel>
        </Tab>
      </Tabs>
        <div className="version">Version {this.props.version}</div>
      </div>}
    </React.Fragment>
  }
}

export { MainPanel };
