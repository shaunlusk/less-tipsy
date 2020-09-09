import { LocalStorageService } from "./local-storage-service";
import { History } from "../model/history";
import { HistoricalSession } from "../model/historical-session";

interface IHistoricSessionSaveModel {
  unitsConsumed: number;
  sessionMax: number;
  weeklyMax: number;
  rollingWeekly: number;
  date: string;
}

interface IHistorySaveModel {
  historicSessions: IHistoricSessionSaveModel[];
}

const HistoryStorageKey = 'History';

export class HistoryService {
  private _localStorageService: LocalStorageService;
  private _sessionsToKeep: number;

  constructor(localStorageService: LocalStorageService, sessionsToKeep: number) {
    this._localStorageService = localStorageService;
    this._sessionsToKeep = sessionsToKeep;
  }

  public loadHistory(): History | null {
    const savedModel = this._localStorageService.getObject<IHistorySaveModel>(HistoryStorageKey);
    if (!savedModel) {
      return null;
    }
    const sessions = savedModel.historicSessions.map(session => 
      new HistoricalSession(
        session.unitsConsumed, 
        new Date(session.date),
        session.sessionMax,
        session.weeklyMax,
        session.rollingWeekly));
    const history =  new History(sessions);
    return history;
  }

  public set sessionsToKeep(value: number) {
    this._sessionsToKeep = value;
  }

  public get sessionsToKeep(): number {
    return this._sessionsToKeep;
  }

  public saveHistory(history: History): void {
    const start = history.sessions.length > this._sessionsToKeep 
      ? history.sessions.length - this._sessionsToKeep : 0;
    const sessions = history.sessions.slice(start, history.sessions.length);
    const saveModel: IHistorySaveModel = {
      historicSessions: sessions.map(session => ({
        unitsConsumed: session.unitsConsumed,
        sessionMax: session.sessionMax,
        weeklyMax: session.weeklyMax,
        rollingWeekly: session.rollingWeekly,
        date: session.date.toString()
      }))
    };
    this._localStorageService.putObject<IHistorySaveModel>(HistoryStorageKey, saveModel);
  }

  public deleteHistory(): void {
    this._localStorageService.remove(HistoryStorageKey);
  }
}
