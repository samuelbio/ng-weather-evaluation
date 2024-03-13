import {Injectable, signal, WritableSignal} from '@angular/core';
import {WeatherService} from "./weather.service";

export const LOCATIONS : string = "locations";

@Injectable()
export class LocationService {

  private readonly locationsList: WritableSignal<string[]> = signal<string[]>([]);
  get locations() {
    return this.locationsList.asReadonly();
  }

  constructor() {
    let locString = localStorage.getItem(LOCATIONS);
    if (locString)
    this.locationsList.set(JSON.parse(locString))
  }

  addLocation(zipcode : string): void {
    this.locationsList.update((locations) => [...locations, zipcode]);
    localStorage.setItem(LOCATIONS, JSON.stringify(this.locationsList()));
  }

  removeLocation(zipcode : string): void {
    this.locationsList.update(
        (zipcodeList) => zipcodeList.filter((item) => item !== zipcode)
    )
    localStorage.setItem(LOCATIONS, JSON.stringify(this.locations()));
  }
}
