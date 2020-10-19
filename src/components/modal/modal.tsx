import * as React from 'react';
import './modal.scss';

export interface IModalProps {
  handleClose(): void;
  show?: boolean;
  buttonText: string;
  title:string;
}

export class Modal extends React.Component<IModalProps, any> {
  private _showHideClassName(): string {
    return this.props.show ? 'modal modal-display-block' : 'modal modal-display-none';
  }

  public render() {
    return <div className={this._showHideClassName()}>
        <div className="modal-main">
          <div className="modal-title">{this.props.title}</div>
          <div className="modal-content">{this.props.children}</div>
          <div className="modal-buttons">
            <button className="modal-button" onClick={() => this.props.handleClose()}>{this.props.buttonText}</button>
          </div>
        </div>
      </div>;
  }
}
