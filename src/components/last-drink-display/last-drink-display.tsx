import React, { FunctionComponent } from 'react';
import { Drink } from '../../model/drink';
import { TimeDisplay } from '../time-display/time-display';
import { NumberDisplay } from '../number-display/number-display';

export interface ILastDrinkDisplay {
  deleteDrink(): void;
  // edit(): void;
  drink: Drink;
}

export const LastDrinkDisplay: FunctionComponent<ILastDrinkDisplay> = ({drink, deleteDrink}) => {
  return <span>
    <NumberDisplay number={drink.alcoholUnits} decimalPlaces={1}></NumberDisplay> units 
    (<NumberDisplay number={drink.volume} decimalPlaces={1}></NumberDisplay> {drink.volumeUnit} × <NumberDisplay number={drink.abv} decimalPlaces={1}></NumberDisplay>%) 
    @<TimeDisplay datetime={drink.time}></TimeDisplay>
    <button>Edit</button>
    <button onClick={deleteDrink}>×</button>
  </span>;
}
