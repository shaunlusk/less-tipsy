import * as React from 'react';
import './settings-panel.scss';

interface ISettingsPanelProps {
  sessionMax: string;
  weeklyMax: string;
  units: string;
  hours: string;
  historySessionsToKeep: string;
  areInputsValid: boolean;
  changesExist: boolean;
  onChangeSessionMax(sessionMax: string): void;
  onChangeWeeklyMax(weeklyMax: string): void;
  onChangeUnits(units: string): void;
  onChangeHours(hours: string): void;
  onChangeHistorySessions(historySessionsToKeep: string): void;
  onCancelChanges(): void;
  onRestoreDefaults(): void;
  onSaveSettings(): void;
}

class SettingsPanel extends React.Component<ISettingsPanelProps, any> {

  render() {
    return <div className="settings-container">
      <h3>Settings</h3>
      <div className="settings-input max-per-session">
        <div className="settings-label">Max Per Session</div>
        <input 
          type="number" 
          value={this.props.sessionMax} 
          size={5} 
          maxLength={5} 
          min={0.1}
          max={12}
          step={1}
          name="maxPerSessionInput"
          onChange={e => this.props.onChangeSessionMax(e.target.value)}
        ></input>
      </div>
      <div className="settings-input max-per-week">
        <div className="settings-label">Max Per Week</div>
        <input 
          type="number" 
          value={this.props.weeklyMax} 
          size={5} 
          maxLength={5}
          min={0.1}
          max={49}
          step={1}
          name="maxPerWeekInput"
          onChange={e => this.props.onChangeWeeklyMax(e.target.value)}
        ></input>
      </div>
      <h4>Session Rate</h4>
      <div className="settings-input session-rate-units">
        <div className="settings-label">Units...</div>
        <input 
          type="number" 
          value={this.props.units} 
          size={5} 
          maxLength={5} 
          min={0.1}
          max={12}
          step={1}
          name="units"
          onChange={e => this.props.onChangeUnits(e.target.value)}
        ></input>
        </div>
      <div className="settings-input session-rate-hour">
        <div className="settings-label">...Per Hours</div>
        <input 
          type="number" 
          value={this.props.hours} 
          size={5} 
          maxLength={5}
          min={0.1}
          max={12} 
          step={1}
          name="hours"
          onChange={e => this.props.onChangeHours(e.target.value)}
        ></input>
      </div>
      <h4>History</h4>
      <div className="settings-input keep-history-sessions">
        <div className="settings-label">History Sessions to Keep</div>
        <input 
          type="number" 
          value={this.props.historySessionsToKeep} 
          size={3} 
          maxLength={3}
          min={0}
          step={1}
          max={366} 
          name="historySessions"
          onChange={e => this.props.onChangeHistorySessions(e.target.value)}
        ></input>
      </div>
      <div className="settings-buttons">
        <button onClick={this.props.onSaveSettings} disabled={!this.props.changesExist || !this.props.areInputsValid}>Save</button>
        <button onClick={this.props.onCancelChanges} disabled={!this.props.changesExist}>Cancel Changes</button>
        <button onClick={this.props.onRestoreDefaults}>Restore Defaults</button>
      </div>
    </div>
  }
}

export { SettingsPanel };
