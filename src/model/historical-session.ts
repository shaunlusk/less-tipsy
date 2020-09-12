
export class HistoricalSession {
  private _unitsConsumed: number;
  private _sessionMax: number;
  private _weeklyMax: number;
  private _rollingWeekly: number;
  private _date: Date;

  public constructor(
    unitsConsumed: number, 
    date: Date, 
    sessionMax: number, 
    weeklyMax: number, 
    rollingWeekly: number
  ) {
    this._unitsConsumed = unitsConsumed;
    this._sessionMax = sessionMax;
    this._weeklyMax = weeklyMax;
    this._rollingWeekly = rollingWeekly;
    this._date = date;
  }

  public get date(): Date {
    return this._date;
  }
  
  public get unitsConsumed(): number {
    return this._unitsConsumed;
  }

  public get sessionMax(): number {
    return this._sessionMax;
  }
  
  public get weeklyMax(): number {
    return this._weeklyMax;
  }

  public get rollingWeekly(): number {
    return this._rollingWeekly;
  }
  
  public get isSessionOk(): boolean {
    return this._unitsConsumed <= this._sessionMax;
  }

  public get isWeeklyOk(): boolean {
    return this._rollingWeekly <= this._weeklyMax;
  }
}