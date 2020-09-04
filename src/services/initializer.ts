import { SettingsService } from './settings-service';
import { SessionService } from './session-service';
import { HistoryService } from './history-service';
import { ActiveSession } from '../model/active-session';
import { LocalStorageService } from './local-storage-service';
import { History } from '../model/history';

export class Initializer {
  private _settingsService: SettingsService;
  private _sessionService: SessionService;
  private _historyService: HistoryService;
  private _activeSession: ActiveSession;
  private _history: History;

  constructor() {
    const localStorageService = new LocalStorageService();
    this._sessionService = new SessionService(localStorageService);
    this._settingsService = new SettingsService(localStorageService);
    this._historyService = new HistoryService(localStorageService, this._settingsService.historySessionsToKeep);

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
  }

  public get sessionService() {
    return this._sessionService;
  }

  public get settingsService() {
    return this._settingsService;
  }

  public get historyService() {
    return this._historyService;
  }

  public get activeSession() {
    return this._activeSession;
  }

  public get history() {
    return this._history;
  }
}
