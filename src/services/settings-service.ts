import { ILocalStorageService, LocalStorageService } from "./local-storage-service";

export interface ISettingsService {
  weeklyMax: number;
  sessionMax: number;
  units: number;
  hours: number;
}

class SettingsService implements ISettingsService {
  private static _instance: SettingsService;
  public readonly WeeklyMaxStorageKey = 'WeeklyMax';
  public readonly SessionMaxStorageKey = 'SessionMax';
  public readonly HoursStorageKey = 'HoursRate';
  public readonly UnitsStorageKey = 'UnitRate';
  public readonly DefaultWeeklyMax = 14;
  public readonly DefaultSessionMax = 2;
  public readonly DefaultHours = 1;
  public readonly DefaultUnits = 1;
  private _weeklyMax!: number;
  private _sessionMax!: number;
  private _units!: number;
  private _hours!: number;
  private _storageService: ILocalStorageService;


  private constructor(storageService: ILocalStorageService) {
    this._storageService = storageService;

    const weeklyMax = this._storageService.getNumber(this.WeeklyMaxStorageKey) || this.DefaultWeeklyMax;
    this.weeklyMax = weeklyMax;

    const sessionMax = this._storageService.getNumber(this.SessionMaxStorageKey) || this.DefaultSessionMax;
    this.sessionMax = sessionMax;

    const units = this._storageService.getNumber(this.UnitsStorageKey) || this.DefaultUnits;
    this.units = units;

    const hours = this._storageService.getNumber(this.HoursStorageKey) || this.DefaultHours;
    this.hours = hours;
  }

  public static getInstance(): SettingsService {
    return SettingsService._instance ?? (SettingsService._instance = new SettingsService(new LocalStorageService()));
  }

  get weeklyMax(): number {
    return this._weeklyMax;
  }

  set weeklyMax(value: number) {
    if (value === this._weeklyMax) return;
    this._weeklyMax = value;
    this._storageService.put(this.WeeklyMaxStorageKey, value);
  }

  get sessionMax(): number {
    return this._sessionMax;
  }

  set sessionMax(value: number) {
    if (value === this._sessionMax) return;
    this._sessionMax = value;
    this._storageService.put(this.SessionMaxStorageKey, value);
  }

  get hours(): number {
    return this._hours;
  }

  set hours(value: number) {
    if (value === this._hours) return;
    this._hours = value;
    this._storageService.put(this.HoursStorageKey, value);
  }

  get units(): number {
    return this._units;
  }

  set units(value: number) {
    if (value === this._units) return;
    this._units = value;
    this._storageService.put(this.UnitsStorageKey, value);
  }
}

export { SettingsService };