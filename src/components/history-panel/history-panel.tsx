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
        {this.props.sessions.length === 0 
          ? <span>No Sessions</span>
          : <div className="history-panel-sessions">
              <div className="header col1">Date</div>
              <div className="header col2">Units</div>
              <div className="header col3">Session Max</div>
              <div className="header col4">Rolling Weekly</div>
              <div className="header col5">Weekly Max</div>
            {this.props.sessions.map(session => {
                  return <React.Fragment key={'session-' + (idx++)}>
                    <div className="col1"><DateDisplay datetime={session.date} format="YYYY-MM-DD"></DateDisplay></div> 
                    <div className="col2"><NumberDisplay number={session.unitsConsumed} decimalPlaces={1}></NumberDisplay></div>
                    <div className="col3"><NumberDisplay number={session.sessionMax} decimalPlaces={1}></NumberDisplay></div>
                    <div className="col4"><NumberDisplay number={session.rollingWeekly} decimalPlaces={1}></NumberDisplay></div>
                    <div className="col5"><NumberDisplay number={session.weeklyMax} decimalPlaces={1}></NumberDisplay></div>
                  </React.Fragment>
                })}
            </div>
        }
        <div className="history-panel-buttons">
          <button className="btn btn-danger delete-history-button" disabled={this.props.sessions.length === 0} onClick={this.props.deleteHistory}>Delete History</button>
          <div className="history-panel-buttons-import-export">
            <button className="btn export-button" disabled={this.props.sessions.length === 0} onClick={this._exportHistory.bind(this)}>Export History</button>
            <label className="btn import-label" htmlFor="upload-file">Import History</label>
            <input type="file" name="file" id="upload-file" accept=".csv" onChange={(event) => this._importHistory(event.target.files![0])}/>
          </div>
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
