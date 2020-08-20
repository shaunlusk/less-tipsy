import { ActiveSession, IActiveSession } from "../model/active-session";
import { Drink } from "../model/drink";
import { LocalStorageService } from "./local-storage-service";

interface IActiveSessionSaveModel {
  drinks: Drink[];
  sessionMax: number;
  weeklyMax: number;
  rollingWeeklyTotal: number;
  date: Date;
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
    activeSession.date = savedModel.date;
    savedModel.drinks.forEach(drink => activeSession.addDrink(drink));
    return activeSession;
  }

  public saveSession(session: IActiveSession): void {
    const saveModel: IActiveSessionSaveModel = {
      drinks: session.drinks,
      sessionMax: session.sessionMax,
      weeklyMax: session.weeklyMax,
      rollingWeeklyTotal: session.rollingWeeklyTotal,
      date: session.date,
      targetHourlyRate: session.targetHourlyRate
    };
    this._localStorageService.putObject<IActiveSessionSaveModel>(this.ActiveSessionStorageKey, saveModel);
  }
}