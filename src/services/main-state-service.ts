import { LocalStorageService } from "./local-storage-service";

export interface IMainStateService {
    viewedHowToTab: boolean;
    acceptedDisclaimer: boolean;
}

const ViewedHowToTabStorageKey = 'ViewedHowToTab';
const AcceptedDisclaimerStorageKey = 'AcceptedDisclaimer';

export class MainStateService implements IMainStateService {
  private _localStorageService: LocalStorageService;

  public constructor(localStorageService: LocalStorageService) {
    this._localStorageService = localStorageService;
  }

  public get viewedHowToTab(): boolean {
    var result = this._localStorageService.getBoolean(ViewedHowToTabStorageKey);
    return result || false;
  }

  public set viewedHowToTab(value: boolean) {
    this._localStorageService.put(ViewedHowToTabStorageKey, value);
  }

  public get acceptedDisclaimer(): boolean {
    var result = this._localStorageService.getBoolean(AcceptedDisclaimerStorageKey);
    return result || false;
  }

  public set acceptedDisclaimer(value: boolean) {
    this._localStorageService.put(AcceptedDisclaimerStorageKey, value);
  }
}