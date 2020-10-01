import React, { FunctionComponent } from 'react';
import { VolumeUnit } from '../../model/unit';

export interface IDrinkInputProps {
  volume: string;
  volumeUnit: VolumeUnit;
  abv: string;
  onChangeVolume(value: string) : void;
  onChangeUnit(value: string) : void;
  onChangeAbv(value: string) : void;
}

export const DrinkInput: FunctionComponent<IDrinkInputProps> = (props) => {
  return <span>
      <input 
        type="number" 
        value={props.volume} 
        size={6} 
        min={1}
        max={1750}
        name="volume"
        onChange={e => props.onChangeVolume(e.target.value)}
      ></input>
        <select value={props.volumeUnit} onChange={e => props.onChangeUnit(e.target.value)}>
          <option value={VolumeUnit.Ounces}>Ounces</option>
          <option value={VolumeUnit.Milliliters}>Milliliters</option>
        </select>
      <div>ABV</div>
      <input 
          type="number" 
          value={props.abv} 
          size={5} 
          min={0.1}
          max={99.9}
          step={0.5}
          name="maxPerWeekInput"
          onChange={e => props.onChangeAbv(e.target.value)}
        ></input>
    </span>
}
