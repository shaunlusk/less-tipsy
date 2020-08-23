import React, { FunctionComponent } from 'react';

export interface INumberDisplayProps {
  number: number;
  decimalPlaces: number;
}

export const NumberDisplay: FunctionComponent<INumberDisplayProps> = ({number, decimalPlaces}) => {
  const multiplier = Math.pow(10, decimalPlaces);
  const display = Math.round(number * multiplier) / multiplier;
  return <span>{display}</span>;
}
