import { Drink } from "./drink";

export class ActiveSession {
  private _drinks: Drink[] = [];
  private _sessionMax: number;
  private _date: Date = new Date();
  private _targetHourlyRate: number;

  public constructor(sessionMax: number, targetHourlyRate: number) {
    this._sessionMax = sessionMax;
    this._targetHourlyRate = targetHourlyRate;
  }

  public addDrink(drink: Drink): void {
    this._drinks.push(drink);
  }

  public deleteLast(): void {
    this._drinks.splice(this._drinks.length - 1, 1);
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

    const timeDiff = (currentTime.valueOf() - startTime.valueOf()) / 1000 / 60 / 60 + 1;
    return this.unitsConsumed / timeDiff;
  }

  public get targetHourlyRate(): number {
    return this._targetHourlyRate;
  }

  public get nextDrinkTime(): Date | null {
    if (!this.lastDrink) {
      return null;
    }
    return new Date(this.lastDrink.time.valueOf() + (this.lastDrink!.alcoholUnits / this._targetHourlyRate) * 60 * 60 * 1000);
  }
}