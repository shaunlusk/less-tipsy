import * as React from 'react';

export interface IHistoryPanelSession {
  unitsConsumed: number;
  sessionMax: number;
  weeklyMax: number;
  rollingWeekly: number;
  date: Date;
}

export interface IHistoryPanelProps {
  sessions: IHistoryPanelSession[];
}

class HistoryPanel extends React.Component<IHistoryPanelProps, any> {
  render() {
    let idx = 0;
    return <div>
        <h3>History</h3>
        {this.props.sessions.map(session => (
          <div key={'session-' + (idx++)}>
            <span>{session.date.toString()}</span>
            <span>{session.unitsConsumed}</span>
          </div>
        ))}
      </div>
  }
}

export { HistoryPanel };
