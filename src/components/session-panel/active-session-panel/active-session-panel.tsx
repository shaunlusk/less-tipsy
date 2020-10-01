import * as React from 'react';
import { VolumeUnit } from '../../../model/unit';
import { Drink } from '../../../model/drink';
import { NumberDisplay } from '../../number-display/number-display';
import { TimeDisplay } from '../../time-display/time-display';
import { LastDrinkDisplay } from '../../last-drink-display/last-drink-display';

export interface IActiveSessionPanelProps {
  addDrink(drink: Drink): void;
  finishSession(): void;
  cancelSession(): void;
  deleteLastDrink(): void;
  updateLastAbv(abv: string): void;
  updateLastVolume(volume: string): void;
  updateLastVolumeUnit(volumeUnit: string): void;
  saveLastDrinkChanges(): void;
  cancelLastDrinkChanges(): void;
  lastDrink: Drink | null;
  nextDrinkTime: Date | null;
  sessionTotal: number;
  sessionRemaining: number;
  hourlyRate: number;
  rollingWeeklyTotal: number;
  rollingWeeklyRemaining: number;
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

  public render() {
    return <div>
      <div>Add Drink</div>
      <div>
        Volume
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
      <div>ABV</div>
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
      <div>
        <button onClick={this._addDrink.bind(this)}>Add</button>
      </div>
      <div>Last Drink</div>
      <div>{this.props.lastDrink 
        ? <LastDrinkDisplay 
            deleteDrink={this.props.deleteLastDrink} 
            drink={this.props.lastDrink}
            abv={this.props.}
            volume={this.state.currentVolume}
            volumeUnit={this.state.currentVolumeUnit}
            editting={true}
            onChangeAbv={this.props.updateLastAbv}
            onChangeVolume={this.props.updateLastAbv}
            onChangeUnit={this.props.updateLastAbv}
            onSaveChanges={this.props.saveLastDrinkChanges}
            onCancelChanges={this.props.saveLastDrinkChanges}
            ></LastDrinkDisplay>
        : <span>--</span>}
      </div>
      <div>Next Drink</div>
      <div>{this.props.nextDrinkTime 
        ? <TimeDisplay datetime={this.props.nextDrinkTime}></TimeDisplay>
        : <span>--</span>}
      </div>
      <div>Session Total</div>
      <div><NumberDisplay number={this.props.sessionTotal} decimalPlaces={1}></NumberDisplay></div>
      <div>Session Remaining</div>
      <div><NumberDisplay number={this.props.sessionRemaining} decimalPlaces={1}></NumberDisplay></div>
      <div>Rolling Hourly Rate</div>
      <div><NumberDisplay number={this.props.hourlyRate} decimalPlaces={1}></NumberDisplay></div>
      <div>Rolling Weekly Total</div>
      <div><NumberDisplay number={this.props.rollingWeeklyTotal} decimalPlaces={1}></NumberDisplay></div>
      <div>Rolling Weekly Remaining</div>
      <div><NumberDisplay number={this.props.rollingWeeklyRemaining} decimalPlaces={1}></NumberDisplay></div>
      <div>
        <button onClick={this.props.finishSession}>Finish Session</button>
        <button onClick={this._cancelSession.bind(this)}>Cancel Session</button>
      </div>
    </div>
  }
}
