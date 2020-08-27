import React, { FunctionComponent } from 'react';

export interface IDateDisplay {
  datetime: Date;
  format: string;
}

export const DateDisplay: FunctionComponent<IDateDisplay> = ({datetime, format}) => {
  let display = format.toLocaleUpperCase();
  display = display.replace('YYYY', datetime.getFullYear().toString());
  display = display.replace('YY', datetime.getFullYear().toString().substring(2,4));
  const month = datetime.getMonth() + 1;
  display = display.replace('MM', month < 10 ? '0' + month : month.toString());
  const day = datetime.getDate();
  display = display.replace('DD', day < 10 ? '0' + day : day.toString());
  return <span>{display}</span>;
}
