import * as React from 'react';

export interface IHistoryPanelSession {
  unitsConsumed: number;
  sessionMax: number;
  weeklyMax: number;
  rollingWeekly: number;
  date: Date;
}

export interface IHistoryPanelProps {
  deleteHistory(): void;
  sessions: IHistoryPanelSession[];
}

class HistoryPanel extends React.Component<IHistoryPanelProps, any> {
  render() {
    let idx = 0;
    return <div>
        <h3>History</h3>
        <div className="history-panel-sessions">
        {this.props.sessions.map(session => (
          <div key={'session-' + (idx++)}>
            <span>{session.date.toString()}</span>
            <span>{session.unitsConsumed}</span>
          </div>
        ))}
        </div>
        <div className="history-panel-buttons"><button onClick={this.props.deleteHistory}>Delete History</button></div>
      </div>
  }
}

export { HistoryPanel };
