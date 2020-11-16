export enum InstallResult {
    ACCEPTED,
    REJECTED
}

export enum DisplayMode {
    BROWSERTAB,
    STANDALONE,
    STANDALONEIOS
}

export class InstallService {
    private _deferredPrompt: any = null;
    private _installCallbacks: (() => void)[] = [];
    private _installAvailableCallbacks: (() => void)[] = [];
    private _displayModeCallbacks: ((result: DisplayMode) => void)[] = [];
    private _installResult: InstallResult = InstallResult.REJECTED;
    private _isInstallable: boolean = false;
    private _displayMode = DisplayMode.BROWSERTAB;
    private _displayModeIsSet = false;

    public constructor() {
        window.addEventListener('beforeinstallprompt', (e: Event) => {
            this._isInstallable = true;
            e.preventDefault();
            this._deferredPrompt = e;
            this._onInstallAvailable();
        });
        
        window.addEventListener('DOMContentLoaded', () => {
            if (navigator.hasOwnProperty('standalone')) {
                this._displayMode = DisplayMode.STANDALONEIOS
            }
            if (window.matchMedia('(display-mode: standalone)').matches) {
                this._displayMode = DisplayMode.STANDALONE;
            }
            this._displayModeIsSet = true;
            this._onDisplayModeSet();
        });
    }

    public addDisplayModeSetListener(callback: (result: DisplayMode) => void): void {
        this._displayModeCallbacks.push(callback);
        if (this._displayModeIsSet) {
            callback(this._displayMode);
        } else {
            this._displayModeCallbacks.push(callback);
        }
    }

    private _onDisplayModeSet(): void {
        for (const callback of this._displayModeCallbacks) {
            callback(this._displayMode);
        }
    }

    public addInstallAvailableListener(callback: () => void): void {
        if (this._isInstallable) {
            callback();
        } else {
            this._installAvailableCallbacks.push(callback);
        }
    }

    private _onInstallAvailable(): void {
        for (const callback of this._installAvailableCallbacks) {
            callback();
        }
    }

    public promptToInstall(callback: () => void) {
        if (!this._isInstallable) {
            throw new Error("App is not currently installable.");
        }

        this._installCallbacks.push(callback);

        // Show the install prompt
        this._deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        this._deferredPrompt.userChoice.then((choiceResult: any) => {
            if (choiceResult.outcome === 'accepted') {
                this._installResult = InstallResult.ACCEPTED;
                this._onInstall();
            } else {
                this._installResult = InstallResult.REJECTED;
            }
        });
    }

    public addInstallListener(callback: () => void): void {
        if (this._installResult === InstallResult.ACCEPTED) {
            callback();
        } else {
            this._installCallbacks.push(callback);
        }
    }

    private _onInstall(): void {
        for (const callback of this._installCallbacks) {
            callback();
        }
    }
}