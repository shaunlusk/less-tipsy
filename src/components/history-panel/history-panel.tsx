import * as React from 'react';
import { DateDisplay } from '../date-display/date-display';
import { NumberDisplay } from '../number-display/number-display';
import './history-panel.scss';

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
          <div>Date</div>
          <div>Units</div>
          <div>Session Max</div>
          <div>Rolling Weekly</div>
          <div>Weekly Max</div>
        {this.props.sessions.map(session => {
          
          return <React.Fragment key={'session-' + (idx++)}>
            <div><DateDisplay datetime={session.date} format="YYYY-MM-DD"></DateDisplay></div> 
            <div><NumberDisplay number={session.unitsConsumed} decimalPlaces={1}></NumberDisplay></div>
            <div><NumberDisplay number={session.sessionMax} decimalPlaces={1}></NumberDisplay></div>
            <div><NumberDisplay number={session.rollingWeekly} decimalPlaces={1}></NumberDisplay></div>
            <div><NumberDisplay number={session.weeklyMax} decimalPlaces={1}></NumberDisplay></div>
          </React.Fragment>
        })}
        </div>
        <div className="history-panel-buttons"><button disabled={this.props.sessions.length === 0} onClick={this.props.deleteHistory}>Delete History</button></div>
      </div>
  }
}

export { HistoryPanel };
