import { Drink } from "./drink";

export class ActiveSession {
  private _drinks: Drink[] = [];
  private _sessionMax: number;
  private _weeklyMax: number;
  private _rollingWeeklyTotal: number;
  private _date: Date = new Date();
  private _targetHourlyRate: number;

  constructor(sessionMax: number, weeklyMax: number, rollingWeeklyTotal: number, targetHourlyRate: number) {
    this._sessionMax = sessionMax;
    this._weeklyMax = weeklyMax;
    this._rollingWeeklyTotal = rollingWeeklyTotal;
    this._targetHourlyRate = targetHourlyRate;
  }

  public addDrink(drink: Drink): void {
    this._drinks.push(drink);
  }

  public get drinks(): Drink[] {
    return this._drinks;
  }
  
  public get lastDrink(): Drink | null {
    return this._drinks.length > 0 ? this._drinks[this._drinks.length - 1] : null;
  }

  public get date(): Date {
    return this._date;
  }

  public set date(date: Date) {
    this._date = date;
  }
  
  public get unitsConsumed(): number {
    return this._drinks.reduce((prevValue, value) => prevValue + value.alcoholUnits, 0);
  }

  public get sessionMax(): number {
    return this._sessionMax;
  }
  
  public get sessionRemaining(): number {
    const remaining = this._sessionMax - this.unitsConsumed;
    return remaining < 0 ? 0 : remaining;
  }

  public get hourlyRate(): number {
    if (this._drinks.length === 0) {
      return 0;
    }
    const startTime = this._drinks[0].time;
    const currentTime = new Date();
    // Add target hourly rate to prevent huge hourly rates and division by zero.
    const lastUnitAllowance = this.lastDrink!.alcoholUnits / this._targetHourlyRate;
    const timeDiff = (currentTime.valueOf() - startTime.valueOf()) / 1000 / 60 / 60 + lastUnitAllowance;
    return this.unitsConsumed / timeDiff;
  }

  public get targetHourlyRate(): number {
    return this._targetHourlyRate;
  }

  public get weeklyMax(): number {
    return this._weeklyMax;
  }

  public get rollingWeeklyTotal(): number {
    return this._rollingWeeklyTotal + this.unitsConsumed;
  }

  public get rollingWeeklyRemaining(): number {
    const remaining = this._weeklyMax - this.rollingWeeklyTotal;
    return remaining < 0 ? 0 : remaining; 
  }
  
  public get isHourlyRateOk(): boolean {
    return this.hourlyRate <= this._targetHourlyRate;
  }

  public get isSessionOk(): boolean {
    return this.unitsConsumed <= this._sessionMax;
  }

  public get isWeeklyOk(): boolean {
    return this.rollingWeeklyTotal <= this._weeklyMax;
  }

  public get nextDrinkTime(): Date | null {
    if (!this.lastDrink) {
      return null;
    }
    return new Date(Date.now() + (this.lastDrink!.alcoholUnits / this._targetHourlyRate) * 60 * 60 * 1000);
  }
}