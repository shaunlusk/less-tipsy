import React, { FunctionComponent } from 'react';
import { Drink } from '../../model/drink';
import { TimeDisplay } from '../time-display/time-display';
import { NumberDisplay } from '../number-display/number-display';
import { VolumeUnit } from '../../model/unit';
import { DrinkInput } from '../drink-input/drink-input';

export interface ILastDrinkDisplay {
  deleteDrink(): void;
  drink: Drink;
  editting: boolean;
  volume: string;
  volumeUnit: VolumeUnit;
  abv: string;
  onChangeVolume(value: string) : void;
  onChangeUnit(value: string) : void;
  onChangeAbv(value: string) : void;
  onSaveChanges(): void; 
  onCancelChanges(): void;
}

/*
  currentVolume: string;
  currentVolumeUnit: VolumeUnit;
  currentAbv: string;
  onChangeVolume(value: string) : void;
  onChangeUnit(value: string) : void;
  onChangeAbv(value: string) : void;*/

export const LastDrinkDisplay: FunctionComponent<ILastDrinkDisplay> = (props) => {
  return <React.Fragment>
    {props.editting 
      ? <DrinkInput
          volume={props.volume}
          volumeUnit={props.volumeUnit}
          abv={props.abv}
          onChangeVolume={props.onChangeVolume}
          onChangeUnit={props.onChangeUnit}
          onChangeAbv={props.onChangeAbv}
        ></DrinkInput>
      : <span>
          <NumberDisplay number={props.drink.alcoholUnits} decimalPlaces={1}></NumberDisplay> units 
          (<NumberDisplay number={props.drink.volume} decimalPlaces={1}></NumberDisplay> {props.drink.volumeUnit} × <NumberDisplay number={props.drink.abv} decimalPlaces={1}></NumberDisplay>%) 
          @<TimeDisplay datetime={props.drink.time}></TimeDisplay>
          <button>Edit</button>
          <button onClick={props.deleteDrink}>×</button>
      </span>
  }
  </React.Fragment>;
}
