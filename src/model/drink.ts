import { VolumeUnit } from "./unit";

const MillilitersPerOunce = 29.574;

export class Drink {
  private _volume: number;
  private _volumeUnit: VolumeUnit;
  private _abv: number;
  private _time: Date;
  
  constructor(amount: number, amountUnit: VolumeUnit, abv: number, time?: Date) {
    this._volume = amount;
    this._volumeUnit = amountUnit;
    this._abv = abv;
    this._time = time || new Date();
  }

  public get volume(): number {
    return this._volume;
  }

  public get volumeUnit(): VolumeUnit {
    return this._volumeUnit;
  }

  public get abv(): number {
    return this._abv;
  }

  public get time(): Date {
    return this._time;
  }

  /* Calculation based on nhs.uk:
  * You can work out how many units there are in any drink by multiplying the 
  * total volume of a drink (in ml) by its ABV (measured as a percentage) and 
  * dividing the result by 1,000.
  * strength (ABV) x volume (ml) ÷ 1,000 = units
  * For freedom units, convert from oz to ml first.
  */
 public get alcoholUnits(): number {
    const volume = this._volumeUnit === VolumeUnit.Ounces ? this._volume * MillilitersPerOunce : this._volume;
    const units = this._abv * volume / 1000;
    return units;
  }
}
