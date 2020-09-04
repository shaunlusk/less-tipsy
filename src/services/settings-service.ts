import { ILocalStorageService } from "./local-storage-service";

export interface ISettingsService {
  weeklyMax: number;
  sessionMax: number;
  alcoholUnits: number;
  hours: number;
  consumptionRate: number;
  historySessionsToKeep: number;
}

export interface IUpdateSettingsProps {
  weeklyMax: number;
  sessionMax: number;
  alcoholUnits: number;
  hours: number;
  historySessionsToKeep: number;
}

const WeeklyMaxStorageKey = 'WeeklyMax';
const SessionMaxStorageKey = 'SessionMax';
const HoursStorageKey = 'HoursRate';
const AlcoholUnitsStorageKey = 'AlcoholUnitsRate';
const HistorySessionsToKeepStorageKey = 'HistorySessionsToKeep';

const DefaultWeeklyMax = 14;
const DefaultSessionMax = 4;
const DefaultHours = 1;
const DefaultAlcoholUnits = 2;
const DefaultHistorySessionsToKeep = 60;

class SettingsService implements ISettingsService {
  private _storageService: ILocalStorageService;

  private _weeklyMax: number = DefaultWeeklyMax;
  private _sessionMax: number = DefaultSessionMax;
  private _alcoholUnits: number = DefaultAlcoholUnits;
  private _hours: number = DefaultHours;
  private _historySessionsToKeep: number = DefaultHistorySessionsToKeep;

  public constructor(storageService: ILocalStorageService) {
    this._storageService = storageService;

    this.weeklyMax = this._storageService.getNumber(WeeklyMaxStorageKey) || DefaultWeeklyMax;
    this.sessionMax = this._storageService.getNumber(SessionMaxStorageKey) || DefaultSessionMax;
    this.alcoholUnits = this._storageService.getNumber(AlcoholUnitsStorageKey) || DefaultAlcoholUnits;
    this.hours = this._storageService.getNumber(HoursStorageKey) || DefaultHours;
    this.historySessionsToKeep = this._storageService.getNumber(HistorySessionsToKeepStorageKey) || DefaultHistorySessionsToKeep;
  }

  public updateSettings(updates: IUpdateSettingsProps) {
    this.weeklyMax = updates.weeklyMax;
    this.sessionMax = updates.sessionMax;
    this.hours = updates.hours;
    this.alcoholUnits = updates.alcoholUnits;
    this.historySessionsToKeep = updates.historySessionsToKeep;
  }

  public restoreDefaults() {
    this.weeklyMax = DefaultWeeklyMax;
    this.sessionMax = DefaultSessionMax;
    this.alcoholUnits = DefaultAlcoholUnits;
    this.hours = DefaultHours;
    this.historySessionsToKeep = DefaultHistorySessionsToKeep;
  }

  public get weeklyMax(): number {
    return this._weeklyMax;
  }

  public set weeklyMax(value: number) {
    if (value === this._weeklyMax) return;
    this._weeklyMax = value;
    this._storageService.put(WeeklyMaxStorageKey, value);
  }

  public get sessionMax(): number {
    return this._sessionMax;
  }

  public set sessionMax(value: number) {
    if (value === this._sessionMax) return;
    this._sessionMax = value;
    this._storageService.put(SessionMaxStorageKey, value);
  }

  public get hours(): number {
    return this._hours;
  }

  public set hours(value: number) {
    if (value === this._hours) return;
    this._hours = value;
    this._storageService.put(HoursStorageKey, value);
  }

  public get alcoholUnits(): number {
    return this._alcoholUnits;
  }

  public set alcoholUnits(value: number) {
    if (value === this._alcoholUnits) return;
    this._alcoholUnits = value;
    this._storageService.put(AlcoholUnitsStorageKey, value);
  }

  public get consumptionRate(): number {
    return this.alcoholUnits / this.hours;
  }

  public set historySessionsToKeep(value: number) {
    if (value === this._historySessionsToKeep) return;
    this._historySessionsToKeep = value;
    this._storageService.put(HistorySessionsToKeepStorageKey, value);
  }

  public get historySessionsToKeep(): number {
    return this._historySessionsToKeep;
  }
}

export { SettingsService };