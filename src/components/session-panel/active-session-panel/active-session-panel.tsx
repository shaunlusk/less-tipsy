import * as React from 'react';
import { VolumeUnit } from '../../../model/unit';
import { Drink } from '../../../model/drink';
import { NumberDisplay } from '../../number-display/number-display';
import { TimeDisplay } from '../../time-display/time-display';
import { LastDrinkDisplay } from '../../last-drink-display/last-drink-display';
import './active-session-panel.scss';

export interface IActiveSessionPanelProps {
  addDrink(drink: Drink): void;
  finishSession(): void;
  cancelSession(): void;
  deleteLastDrink(): void;
  lastDrink: Drink | null;
  nextDrinkTime: Date | null;
  sessionTotal: number;
  sessionRemaining: number;
  sessionMax: number;
  hourlyRate: number;
  hourlyRateMax: number;
  rollingWeeklyTotal: number;
  rollingWeeklyRemaining: number;
  rollingWeeklyMax: number;
  lastVolume: number;
  lastAbv: number;
  lastVolumeUnit: VolumeUnit;
}

interface IActiveSessionPanelState {
  currentVolume: string;
  currentVolumeUnit: VolumeUnit;
  currentAbv: string;
}

export class ActiveSessionPanel extends React.Component<IActiveSessionPanelProps, IActiveSessionPanelState> {
  constructor(props: IActiveSessionPanelProps) {
    super(props);

    this.state = {
      currentVolume: props.lastVolume.toString(),
      currentAbv: props.lastAbv.toString(),
      currentVolumeUnit: props.lastVolumeUnit
    };
  }

  private _handleChangeVolume(value: string): void {
    this.setState({currentVolume: value});
  }
  
  private _handleChangeUnit(value: string): void {
    const unit = value as keyof typeof VolumeUnit;
    this.setState({currentVolumeUnit: VolumeUnit[unit]});
  }

  private _handleChangeAbv(value: string): void {
    this.setState({currentAbv: value});
  }

  private _addDrink() {
    if (!this._formIsValid()) return;
    const volume = parseFloat(this.state.currentVolume);
    const abv = parseFloat(this.state.currentAbv);
    const drink = new Drink(volume, this.state.currentVolumeUnit, abv);
    this.props.addDrink(drink);
  }

  private _formIsValid() {
    return this._isvolumeValid() && this._isAbvValid();
  }

  private _isvolumeValid(): boolean {
    return this.state.currentVolume !== null && this.state.currentVolume.trim().length > 0;
  }

  private _isAbvValid(): boolean {
    return this.state.currentAbv !== null && this.state.currentAbv.trim().length > 0;
  }

  private _cancelSession(): void {
    this.props.cancelSession();
  }

  private _isOverSessionMax(): boolean {
    return this.props.sessionTotal > this.props.sessionMax;
  }

  private _isOverWeeklyMax(): boolean {
    return this.props.rollingWeeklyTotal > this.props.rollingWeeklyMax;
  }

  private _isOverRate(): boolean {
    return this.props.hourlyRate > this.props.hourlyRateMax;
  }


  public render() {
    return <div>
      <div><strong>Add Drink</strong></div>
      <div className="add-drink">
        <div>
          <strong>Volume</strong>
        </div>
        <input 
          type="number" 
          value={this.state.currentVolume} 
          size={6} 
          min={1}
          max={1750}
          name="volume"
          onChange={e => this._handleChangeVolume(e.target.value)}
        ></input>
          <select value={this.state.currentVolumeUnit} onChange={e => this._handleChangeUnit(e.target.value)}>
            <option value={VolumeUnit.Ounces}>Ounces</option>
            <option value={VolumeUnit.Milliliters}>Milliliters</option>
          </select>
        <div><strong>ABV</strong></div>
        <input 
            type="number" 
            value={this.state.currentAbv} 
            size={5} 
            min={0.1}
            max={99.9}
            step={0.5}
            name="maxPerWeekInput"
            onChange={e => this._handleChangeAbv(e.target.value)}
          ></input>
        <div className="add-drink-button">
          <button className={this._isOverSessionMax() ? "btn btn-danger" : "btn"} onClick={this._addDrink.bind(this)}>Add</button>
        </div>
      </div>
      <div className="drinks">
        <div><strong>Last Drink</strong></div>
        <div className="active-session-field-value">{this.props.lastDrink 
          ? <LastDrinkDisplay deleteDrink={this.props.deleteLastDrink} drink={this.props.lastDrink}></LastDrinkDisplay>
          : <span>--</span>}
        </div>
        <div><strong>Next Drink</strong></div>
        <div className="active-session-field-value">{this.props.nextDrinkTime 
          ? <TimeDisplay datetime={this.props.nextDrinkTime}></TimeDisplay>
          : <span>--</span>}
        </div>
      </div>
      <div className="stats">
        <div><strong>Session Total</strong></div>
        <div className={this._isOverSessionMax() ? "active-session-field-value active-session-warning" : "active-session-field-value"} title={this._isOverSessionMax() ? "Warning: Over maximum drinks per session.": ""}>
          <NumberDisplay number={this.props.sessionTotal} decimalPlaces={1}></NumberDisplay>
          {this._isOverSessionMax()
          ? <span className="active-session-warning-icon"><strong>!</strong></span> 
          : null}
        </div>
        <div><strong>Session Remaining</strong></div>
        <div className={this._isOverSessionMax() ? "active-session-field-value active-session-warning" : "active-session-field-value"}><NumberDisplay number={this.props.sessionRemaining} decimalPlaces={1}></NumberDisplay></div>
        <div><strong>Rolling Hourly Rate</strong></div>
        <div className={this._isOverRate() ? "active-session-field-value active-session-warning" : "active-session-field-value"}><NumberDisplay number={this.props.hourlyRate} decimalPlaces={1}></NumberDisplay></div>
        <div><strong>Rolling Weekly Total</strong></div>
        <div className={this._isOverWeeklyMax() ? "active-session-field-value active-session-warning" : "active-session-field-value"}><NumberDisplay number={this.props.rollingWeeklyTotal} decimalPlaces={1}></NumberDisplay></div>
        <div><strong>Rolling Weekly Remaining</strong></div>
        <div className={this._isOverWeeklyMax() ? "active-session-field-value active-session-warning" : "active-session-field-value"}><NumberDisplay number={this.props.rollingWeeklyRemaining} decimalPlaces={1}></NumberDisplay></div>
        <div className="active-session-buttons">
          <button className="btn" onClick={this.props.finishSession}>Finish Session</button>
          <button className="btn btn-danger" onClick={this._cancelSession.bind(this)}>Cancel Session</button>
        </div>
      </div>
    </div>
  }
}
