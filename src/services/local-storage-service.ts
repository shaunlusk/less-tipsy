import LZString from 'lz-string';

export interface ILocalStorageService {
  put(key: string, value: number | string | boolean): void;
  getString(key: string): string | null;
  getNumber(key: string): number | null;
  getBoolean(key: string): boolean | null;
  getObject<T>(key: string): T | null;
  putObject<T>(key: string, value: T): void;
  remove(key: string): void;
}

export class LocalStorageService implements ILocalStorageService {
  private _namespace: string;

  public constructor(namespace: string) {
    this._namespace = namespace;
  }

  private _key(key: string): string {
    return `${this._namespace}.${key}`;
  }

  private _zip(val: string): string {
    return LZString.compressToUTF16(val);
  }

  private _unzip(val: string | null): string | null {
    return val !== null ? LZString.decompressFromUTF16(val) : null;
  }

  public getString(key: string): string | null {
    return this._unzip( localStorage.getItem(this._key(key)) );
  }

  public getNumber(key: string): number | null {
    const value = this._unzip( localStorage.getItem(this._key(key)) );
    return value ? parseFloat(value) : null;
  }

  public getBoolean(key: string): boolean | null {
    const value = this._unzip( localStorage.getItem(this._key(key)) );
    if (!value) return null;
    return value.toLocaleLowerCase() === "true" ? true : false;
  }

  public put(key: string, value: string | number | boolean): void {
    localStorage.setItem(this._key(key), this._zip( value.toString() ));
  }

  public getObject<T>(key: string): T | null {
    const valueString = this._unzip( localStorage.getItem(this._key(key)) );
    let value: T | null = null;
    if (valueString) {
      value = JSON.parse(valueString);
    }
    return value;
  }

  public putObject<T>(key: string, value: T): void {
    localStorage.setItem(this._key(key), this._zip( JSON.stringify(value) ));
  }

  public remove(key: string): void {
    localStorage.removeItem(this._key(key));
  }
}
