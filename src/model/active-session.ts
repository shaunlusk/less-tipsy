import { Drink } from "./drink";

export class ActiveSession {
  private _drinks: Drink[] = [];
  private _date: Date = new Date();

  public addDrink(drink: Drink): void {
    this._drinks.push(drink);
  }

  public get date(): Date {
    return this._date;
  }
  
  public get unitsConsumed(): number {
    return this._drinks.reduce((prevValue, value) => prevValue + value.alcoholUnits, 0);
  }
}