import { Drink } from "./drink";

export class ActiveSession {
  private _drinks: Drink[] = [];
  private _sessionMax: number;
  private _weeklyMax: number;
  private _rollingWeekly: number;
  private _date: Date = new Date();

  constructor(sessionMax: number, weeklyMax: number, rollingWeekly: number) {
    this._sessionMax = sessionMax;
    this._weeklyMax = weeklyMax;
    this._rollingWeekly = rollingWeekly;
  }

  public addDrink(drink: Drink): void {
    this._drinks.push(drink);
  }

  public get date(): Date {
    return this._date;
  }
  
  public get unitsConsumed(): number {
    return this._drinks.reduce((prevValue, value) => prevValue + value.alcoholUnits, 0);
  }

  public get sessionMax(): number {
    return this._sessionMax;
  }
  
  public get weeklyMax(): number {
    return this._weeklyMax;
  }

  public get rollingWeekly(): number {
    return this._rollingWeekly + this.unitsConsumed;
  }
  
  public get isSessionOk(): boolean {
    return this.unitsConsumed <= this._sessionMax;
  }

  public get isWeeklyOk(): boolean {
    return this.rollingWeekly <= this._weeklyMax;
  }
}