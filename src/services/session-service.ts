import { ActiveSession } from "../model/active-session";
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
  date: string;
  targetHourlyRate: number;
}

export interface ISessionService {
  loadSession(): ActiveSession | null;
  saveSession(session: ActiveSession): void;
}

const ActiveSessionStorageKey = 'ActiveSession';

export class SessionService {
  private _localStorageService: LocalStorageService;

  public constructor(localStorageService: LocalStorageService) {
    this._localStorageService = localStorageService;
  }

  public loadSession(): ActiveSession | null {
    const savedModel = this._localStorageService.getObject<IActiveSessionSaveModel>(ActiveSessionStorageKey);
    if (!savedModel) {
      return null;
    }
    const activeSession = new ActiveSession(
      savedModel.sessionMax,
      savedModel.targetHourlyRate
    );
    activeSession.date = new Date(savedModel.date);
    savedModel.drinks.forEach(drink => activeSession.addDrink(new Drink(drink.volume, drink.volumeUnit, drink.abv, new Date(drink.time))));
    return activeSession;
  }

  public saveSession(session: ActiveSession): void {
    const drinks: IDrinkSaveModel[] = session.drinks.map(drink => ({
      volume: drink.volume,
      volumeUnit: drink.volumeUnit,
      abv: drink.abv,
      time: drink.time.toString()
    }));
    const saveModel: IActiveSessionSaveModel = {
      drinks,
      sessionMax: session.sessionMax,
      date: session.date.toString(),
      targetHourlyRate: session.targetHourlyRate
    };
    this._localStorageService.putObject<IActiveSessionSaveModel>(ActiveSessionStorageKey, saveModel);
  }

  public deleteSession(): void {
    this._localStorageService.remove(ActiveSessionStorageKey);
  }
}