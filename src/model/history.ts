import { HistoricalSession } from "./historical-session";

export class History {
  private _sessions: HistoricalSession[];

  public constructor(sessions?: HistoricalSession[]) {
    this._sessions = sessions || [];
  }

  public addSession(session: HistoricalSession): void {
    this._sessions.push(session);
  }

  public get sessions(): HistoricalSession[] {
    return this._sessions;
  }

}
