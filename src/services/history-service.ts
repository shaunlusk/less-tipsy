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

  constructor(localStorageService: LocalStorageService) {
    this._localStorageService = localStorageService;
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

  public saveHistory(history: History): void {
    const saveModel: IHistorySaveModel = {
      historicSessions: history.sessions.map(session => ({
        unitsConsumed: session.unitsConsumed,
        sessionMax: session.sessionMax,
        weeklyMax: session.sessionMax,
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
