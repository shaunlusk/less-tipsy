import { SettingsService } from './settings-service';
import { SessionService } from './session-service';
import { HistoryService } from './history-service';
import { LocalStorageService } from './local-storage-service';
import { MainStateService } from './main-state-service';

export class Initializer {
  private _settingsService: SettingsService;
  private _sessionService: SessionService;
  private _historyService: HistoryService;
  private _mainStateService: MainStateService;

  public constructor() {
    const localStorageService = new LocalStorageService();
    this._sessionService = new SessionService(localStorageService);
    this._settingsService = new SettingsService(localStorageService);
    this._historyService = new HistoryService(localStorageService, this._settingsService.historySessionsToKeep);
    this._mainStateService = new MainStateService(localStorageService);
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

  public get mainStateService() {
    return this._mainStateService;
  }
}
