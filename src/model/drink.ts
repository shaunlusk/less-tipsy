import { VolumeUnit } from "./unit";

const MillilitersPerOunce = 29.574;

export class Drink {
  private _amount: number;
  private _amountUnit: VolumeUnit;
  private _abv: number;
  
  constructor(amount: number, amountUnit: VolumeUnit, abv: number) {
    this._amount = amount;
    this._amountUnit = amountUnit;
    this._abv = abv;
  }

  public get amount(): number {
    return this._amount;
  }

  public get amountUnit(): VolumeUnit {
    return this._amountUnit;
  }

  public get abv(): number {
    return this._abv;
  }

  /* Calculation based on nhs.uk:
  * You can work out how many units there are in any drink by multiplying the 
  * total volume of a drink (in ml) by its ABV (measured as a percentage) and 
  * dividing the result by 1,000.
  * strength (ABV) x volume (ml) ÷ 1,000 = units
  * For freedom units, convert from oz to ml first.
  */
 public get alcoholUnits(): number {
    const volume = this._amountUnit === VolumeUnit.Ounces ? this._amount * MillilitersPerOunce : this._amount;
    const units = this._abv * volume / 1000;
    return units;
  }
}
