import React, { FunctionComponent } from 'react';

export interface ITimeDisplay {
  datetime: Date;
  twentyFourHourDisplay?: boolean;
}

export const TimeDisplay: FunctionComponent<ITimeDisplay> = ({datetime, twentyFourHourDisplay}) => {
  const baseHours = datetime.getHours(); 
  const displayHours = twentyFourHourDisplay || baseHours < 13 ? baseHours : baseHours - 12;
  const baseMinutes = datetime.getMinutes();
  const displayMinutes = baseMinutes > 9 ? `${baseMinutes}` : `0${baseMinutes}`;
  const amPm = twentyFourHourDisplay ? '' : baseHours > 11 ? 'PM' : 'AM';
  const display = `${displayHours}:${displayMinutes} ${amPm}`;
  return <span>{display}</span>;
}
