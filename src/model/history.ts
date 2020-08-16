import { HistoricalSession } from "./historical-session";

export class History {
  private _sessions: HistoricalSession[];

  constructor(sessions: HistoricalSession[] | undefined) {
    this._sessions = sessions || [];
  }
}
