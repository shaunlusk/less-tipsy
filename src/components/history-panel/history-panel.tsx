import * as React from 'react';
import { History } from '../../model/history';

export interface IHistoryPanelProps {
  history: History;
}

class HistoryPanel extends React.Component<IHistoryPanelProps, any> {
  render() {
    let idx = 0;
    return <div>
        <h3>History</h3>
        {this.props.history.sessions.map(session => (
          <div key={'session-' + (idx++)}>
            <span>{session.date.toString()}</span>
            <span>{session.unitsConsumed}</span>
          </div>
        ))}
      </div>
  }
}

export { HistoryPanel };
