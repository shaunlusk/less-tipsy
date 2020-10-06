import * as React from 'react';
import { DateDisplay } from '../date-display/date-display';
import { NumberDisplay } from '../number-display/number-display';
import { FileService } from '../../services/file-service';
import './history-panel.scss';
import { IHistorySessionDto } from '../../model/history-session-dto';
import { Modal } from '../modal/modal';

export interface IHistoryPanelSession {
  unitsConsumed: number;
  sessionMax: number;
  weeklyMax: number;
  rollingWeekly: number;
  date: Date;
}

export interface IHistoryPanelProps {
  deleteHistory(): void;
  importHistory(importSession: IHistorySessionDto[]): void;
  sessions: IHistoryPanelSession[];
}

interface IHistoryPanelState {
  showImportFailedModal: boolean;
  showImportSuccessModal: boolean;
}

class HistoryPanel extends React.Component<IHistoryPanelProps, IHistoryPanelState> {
  public constructor(props: IHistoryPanelProps) {
    super(props);
    this.state = {
      showImportFailedModal: false,
      showImportSuccessModal: false
    };
  }

  private _importHistory(file: File) {
    FileService.importHistory(file).then(sessions => {
      if (!sessions) return;
      this._showImportSuccessModal();
      this.props.importHistory(sessions);
    }).catch(err => {
      console.error(err);
      this._showImportFailedModal();
    });
  }

  private _exportHistory() {
    FileService.exportHistory(this.props.sessions.map<IHistorySessionDto>(session => ({
      date: session.date,
      sessionMax: session.sessionMax,
      weeklyMax: session.weeklyMax,
      rollingWeekly: session.rollingWeekly,
      unitsConsumed: session.unitsConsumed
    })));
  }

  private _showImportFailedModal() {
    this.setState({showImportFailedModal: true});
  }

  private _hideImportFailedModal() {
    this.setState({showImportFailedModal: false});
  }

  private _showImportSuccessModal() {
    this.setState({showImportSuccessModal: true});
  }

  private _hideImportSuccessModal() {
    this.setState({showImportSuccessModal: false});
  }

  public render() {
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
        <div className="history-panel-buttons">
          <button disabled={this.props.sessions.length === 0} onClick={this.props.deleteHistory}>Delete History</button>
          <button disabled={this.props.sessions.length === 0} onClick={this._exportHistory.bind(this)}>Export History</button>
          <label className="import-label" htmlFor="upload-file">Import History</label>
          <input type="file" name="file" id="upload-file" accept=".csv" onChange={(event) => this._importHistory(event.target.files![0])}/>
        </div>
        <Modal
          title="Import Error"
          show={this.state.showImportFailedModal}
          buttonText="Ok" 
          handleClose={this._hideImportFailedModal.bind(this)}
        >Import file format was not valid.</Modal>
        <Modal
          title="Import Success"
          show={this.state.showImportSuccessModal}
          buttonText="Ok" 
          handleClose={this._hideImportSuccessModal.bind(this)}
        >History import was successful.</Modal>
      </div>
  }
}

export { HistoryPanel };
