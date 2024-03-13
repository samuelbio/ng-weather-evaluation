import {Component, inject, Signal} from '@angular/core';
import {WeatherService} from "../weather.service";
import {LocationService} from "../location.service";
import {Router} from "@angular/router";
import {ConditionsAndZip} from '../conditions-and-zip.type';
import {toSignal} from '@angular/core/rxjs-interop';
import {WeatherCachingService} from '../weather-caching.service';

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css']
})
export class CurrentConditionsComponent {

  private router: Router = inject(Router);
  private weatherService: WeatherService = inject(WeatherService);
  private weatherCachingService: WeatherCachingService<ConditionsAndZip> = inject(WeatherCachingService);
  protected locationService: LocationService = inject(LocationService)
  protected currentConditionsByZip: Signal<ConditionsAndZip[]> = toSignal(this.weatherService.currentConditionsByZipCode$);

  showForecast(zipcode : string): void{
    this.router.navigate(['/forecast', zipcode])
  }

  removeLocation(index: number): void {
    const zipCode: string = this.currentConditionsByZip()[index].zip;
    this.locationService.removeLocation(zipCode)
    this.removeConditionZipCache(zipCode)
    this.removeForecastCache(zipCode)
  }

  removeForecastCache(zipcode: string): void {
    const key = this.weatherService.getForecastCacheKey(zipcode);
    this.weatherCachingService.deleteCache(key)
  }

  removeConditionZipCache(zipcode: string): void {
    const key = this.weatherService.getConditionsAndZipCacheKey(zipcode);
    this.weatherCachingService.deleteCache(key)
  }
}
