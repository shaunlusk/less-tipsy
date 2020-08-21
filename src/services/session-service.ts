import { ActiveSession, IActiveSession } from "../model/active-session";
import { Drink } from "../model/drink";
import { LocalStorageService } from "./local-storage-service";
import { VolumeUnit } from "../model/unit";

interface IDrinkSaveModel {
  volume: number;
  volumeUnit: VolumeUnit;
  abv: number;
  time: string;
}

interface IActiveSessionSaveModel {
  drinks: IDrinkSaveModel[];
  sessionMax: number;
  weeklyMax: number;
  rollingWeeklyTotal: number;
  date: string;
  targetHourlyRate: number;
}

export interface ISessionService {
  loadSession(): IActiveSession | null;
  saveSession(session: IActiveSession): void;
}

export class SessionService {
  public readonly ActiveSessionStorageKey = 'ActiveSession';
  private _localStorageService: LocalStorageService;

  public constructor(localStorageService: LocalStorageService) {
    this._localStorageService = localStorageService;
  }

  public loadSession(): IActiveSession | null {
    const savedModel = this._localStorageService.getObject<IActiveSessionSaveModel>(this.ActiveSessionStorageKey);
    if (!savedModel) {
      return null;
    }
    const activeSession = new ActiveSession(
      savedModel.sessionMax,
      savedModel.weeklyMax,
      savedModel.rollingWeeklyTotal,
      savedModel.targetHourlyRate
    );
    activeSession.date = new Date(savedModel.date);
    savedModel.drinks.forEach(drink => activeSession.addDrink(new Drink(drink.volume, drink.volumeUnit, drink.abv, new Date(drink.time))));
    return activeSession;
  }

  public saveSession(session: IActiveSession): void {
    const drinks: IDrinkSaveModel[] = session.drinks.map(drink => ({
      volume: drink.volume,
      volumeUnit: drink.volumeUnit,
      abv: drink.abv,
      time: drink.time.toString()
    }));
    const saveModel: IActiveSessionSaveModel = {
      drinks,
      sessionMax: session.sessionMax,
      weeklyMax: session.weeklyMax,
      rollingWeeklyTotal: session.rollingWeeklyTotal,
      date: session.date.toString(),
      targetHourlyRate: session.targetHourlyRate
    };
    this._localStorageService.putObject<IActiveSessionSaveModel>(this.ActiveSessionStorageKey, saveModel);
  }
}