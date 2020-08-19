import * as React from 'react';
import { VolumeUnit } from '../../model/unit';
import { Drink } from '../../model/drink';

export interface ISessionTabProps {
  addDrink(drink: Drink): void;
  lastDrink: Date | null;
  nextDrink: Date | null;
  sessionTotal: number;
  sessionRemaining: number;
  hourlyRate: number;
  rollingWeeklyTotal: number;
  rollingWeeklyRemaining: number;
  lastVolume: number;
  lastAbv: number;
  lastVolumeUnit: VolumeUnit;
}

interface ISessionTabState {
  currentVolume: string;
  currentVolumeUnit: VolumeUnit;
  currentAbv: string;
}

export class SessionTab extends React.Component<ISessionTabProps, ISessionTabState> {
  constructor(props: ISessionTabProps) {
    super(props);

    this.state = {
      currentVolume: props.lastVolume.toString(),
      currentAbv: props.lastAbv.toString(),
      currentVolumeUnit: props.lastVolumeUnit
    };
  }

  public handleChangeVolume(value: string): void {
    this.setState({currentVolume: value});
  }
  
  public handleChangeUnit(value: string): void {
    const unit = value as keyof typeof VolumeUnit;
    this.setState({currentVolumeUnit: VolumeUnit[unit]});
  }

  public handleChangeAbv(value: string): void {
    this.setState({currentAbv: value});
  }

  public addDrink() {
    if (!this.formIsValid()) return;
    const volume = parseFloat(this.state.currentVolume);
    const abv = parseFloat(this.state.currentAbv);
    const drink = new Drink(volume, this.state.currentVolumeUnit, abv);
    this.props.addDrink(drink);
  }

  public formIsValid() {
    return this.isvolumeValid() && this.isAbvValid();
  }

  public isvolumeValid(): boolean {
    return this.state.currentVolume !== null && this.state.currentVolume.trim().length > 0;
  }

  public isAbvValid(): boolean {
    return this.state.currentAbv !== null && this.state.currentAbv.trim().length > 0;
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
        onChange={e => this.handleChangeVolume(e.target.value)}
      ></input>
        <select value={this.state.currentVolumeUnit} onChange={e => this.handleChangeUnit(e.target.value)}>
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
          name="maxPerWeekInput"
          onChange={e => this.handleChangeAbv(e.target.value)}
        ></input>
      <div>
        <button onClick={() => this.addDrink()}>Add</button>
      </div>
      <div>Last Drink</div>
      <div>Last Drink Placeholder</div>
      <div>Next Drink</div>
      <div>Next Drink Placeholder</div>
      <div>Session Total</div>
      <div>{this.props.sessionTotal}</div>
      <div>Session Remaining</div>
      <div>{this.props.sessionRemaining}</div>
      <div>Rolling Hourly Rate</div>
      <div>{this.props.hourlyRate}</div>
      <div>Rolling Weekly Total</div>
      <div>{this.props.rollingWeeklyTotal}</div>
      <div>Rolling Weekly Remaining</div>
      <div>{this.props.rollingWeeklyRemaining}</div>
    </div>
  }
}
