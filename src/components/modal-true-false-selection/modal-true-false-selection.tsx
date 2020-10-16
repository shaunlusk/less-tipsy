import * as React from 'react';
import './modal-true-false-selection.scss';

export interface ITrueFalseSelectionModalProps {
  handleClose(response: boolean): void;
  show?: boolean;
  acceptText: string;
  rejectText: string;
  title:string;
}

export class TrueFalseSelectionModal extends React.Component<ITrueFalseSelectionModalProps, any> {
  private _showHideClassName(): string {
    return this.props.show ? 'modal display-block' : 'modal display-none';
  }

  public render() {
    return <div className={this._showHideClassName()}>
        <div className="modal-main">
          <div className="modal-title">{this.props.title}</div>
          <div className="modal-content">{this.props.children}</div>
          <div className="modal-buttons">
            <button className="modal-buttons-reject" onClick={() => this.props.handleClose(false)}>{this.props.rejectText}</button>
            <span className="modal-buttons-spacer"></span>
            <button className="modal-buttons-accept" onClick={() => this.props.handleClose(true)}>{this.props.acceptText}</button>
          </div>
        </div>
      </div>;
  }
}
