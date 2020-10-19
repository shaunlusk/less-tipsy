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
    return this.props.show ? 'modal-true-false modal-true-false-display-block' : 'modal-true-false modal-true-false-display-none';
  }

  public render() {
    return <div className={this._showHideClassName()}>
        <div className="modal-true-false-main">
          <div className="modal-true-false-title">{this.props.title}</div>
          <div className="modal-true-false-content">{this.props.children}</div>
          <div className="modal-true-false-buttons">
            <button className="modal-true-false-buttons-reject" onClick={() => this.props.handleClose(false)}>{this.props.rejectText}</button>
            <span className="modal-true-false-buttons-spacer"></span>
            <button className="modal-true-false-buttons-accept" onClick={() => this.props.handleClose(true)}>{this.props.acceptText}</button>
          </div>
        </div>
      </div>;
  }
}
