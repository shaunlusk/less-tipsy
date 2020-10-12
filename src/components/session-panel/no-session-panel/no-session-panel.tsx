import * as React from 'react';

export interface INoSessionPanelProps {
  onBeginNewSession(): void;
}

export class NoSessionPanel extends React.Component<INoSessionPanelProps, any> {
  public render() {
    return <div>
      <h3>No Active Sessions</h3>
      <div>
        <button className="btn" onClick={this.props.onBeginNewSession}>Begin New Session</button>
      </div>
    </div>
  }
}
