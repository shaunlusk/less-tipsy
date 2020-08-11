import * as React from 'react';
import './settings-panel.scss';

class SettingsPanel extends React.Component<any, any> {
  render() {
    return <div className="settings-container">
      <h3>Settings Panel</h3>
      <div className="settings-input max-per-session">
        <div className="settings-label">Max Per Session</div>
        <input type="text" size={2} maxLength={2} name="maxPerSessionInput"></input>
      </div>
      <div className="settings-input max-per-week">
        <div className="settings-label">Max Per Week</div>
        <input type="text" size={2} maxLength={2} name="maxPerWeekInput"></input>
      </div>
      <h4>Session Rate</h4>
      <div className="settings-input session-rate-units">
        <div className="settings-label">Units...</div>
        <input type="text" size={2} maxLength={2} name="units"></input>
        </div>
      <div className="settings-input session-rate-minutes">
        <div className="settings-label">...Per Hour</div>
        <input type="text" size={2} maxLength={2} name="minutes"></input>
      </div>
    </div>
  }
}

export { SettingsPanel };
