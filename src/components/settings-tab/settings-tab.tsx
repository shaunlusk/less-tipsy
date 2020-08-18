import * as React from 'react';
import { ISettingsService } from '../../services/settings-service';
import './settings-tab.scss';

interface ISettingsTabProps {
  settingsService: ISettingsService;
}

interface ISettingsTabState {
  sessionMax: string;
  weeklyMax: string;
  units: string;
  hours: string;
}

class SettingsTab extends React.Component<ISettingsTabProps, ISettingsTabState> {
  constructor(props: ISettingsTabProps) {
    super(props);
    this.state = {
      weeklyMax: props.settingsService.weeklyMax.toString(),
      sessionMax: props.settingsService.sessionMax.toString(),
      units: props.settingsService.units.toString(),
      hours: props.settingsService.hours.toString()
    };
  }

  handleChangeSessionMax(value: string) {
    this.setState({
      sessionMax: value
    }, () => {
      if (value && value.trim().length) {
        this.props.settingsService.sessionMax = parseFloat(value);
      }
    });
  }

  handleChangeWeeklyMax(value: string) {
    this.setState({
      weeklyMax: value
    }, () => () => {
      if (value && value.trim().length) {
        this.props.settingsService.sessionMax = parseFloat(value);
      }
    });
  }

  handleChangeUnits(value: string) {
    this.setState({
      units: value
    }, () => () => {
      if (value && value.trim().length) {
        this.props.settingsService.sessionMax = parseFloat(value);
      }
    });
  }

  handleChangeHours(value: string) {
    this.setState({
      hours: value
    }, () => () => {
      if (value && value.trim().length) {
        this.props.settingsService.sessionMax = parseFloat(value);
      }
    });
  }

  render() {
    return <div className="settings-container">
      <h3>Settings</h3>
      <div className="settings-input max-per-session">
        <div className="settings-label">Max Per Session</div>
        <input 
          type="number" 
          value={this.state.sessionMax} 
          size={5} 
          maxLength={5} 
          min={0.1}
          max={12}
          name="maxPerSessionInput"
          onChange={e => this.handleChangeSessionMax(e.target.value)}
        ></input>
      </div>
      <div className="settings-input max-per-week">
        <div className="settings-label">Max Per Week</div>
        <input 
          type="number" 
          value={this.state.weeklyMax} 
          size={5} 
          maxLength={5}
          min={0.1}
          max={49}
          name="maxPerWeekInput"
          onChange={e => this.handleChangeWeeklyMax(e.target.value)}
        ></input>
      </div>
      <h4>Session Rate</h4>
      <div className="settings-input session-rate-units">
        <div className="settings-label">Units...</div>
        <input 
          type="number" 
          value={this.state.units} 
          size={5} 
          maxLength={5} 
          min={0.1}
          max={12}
          name="units"
          onChange={e => this.handleChangeUnits(e.target.value)}
        ></input>
        </div>
      <div className="settings-input session-rate-hour">
        <div className="settings-label">...Per Hours</div>
        <input 
          type="number" 
          value={this.state.hours} 
          size={5} 
          maxLength={5}
          min={0.1}
          max={12} 
          name="hours"
          onChange={e => this.handleChangeHours(e.target.value)}
        ></input>
      </div>
    </div>
  }
}

export { SettingsTab };
