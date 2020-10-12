import React, { FunctionComponent } from 'react';
import { Drink } from '../../model/drink';
import { TimeDisplay } from '../time-display/time-display';
import { NumberDisplay } from '../number-display/number-display';
import './last-drink-display.scss';

export interface ILastDrinkDisplay {
  deleteDrink(): void;
  drink: Drink;
}

export const LastDrinkDisplay: FunctionComponent<ILastDrinkDisplay> = ({drink, deleteDrink}) => {
  return <span>
    <NumberDisplay number={drink.alcoholUnits} decimalPlaces={1}></NumberDisplay> units 
    (<NumberDisplay number={drink.volume} decimalPlaces={1}></NumberDisplay> {drink.volumeUnit} × <NumberDisplay number={drink.abv} decimalPlaces={1}></NumberDisplay>%) 
    @<TimeDisplay datetime={drink.time}></TimeDisplay>
    <button className="btn-x" onClick={deleteDrink}>×</button>
  </span>;
}
