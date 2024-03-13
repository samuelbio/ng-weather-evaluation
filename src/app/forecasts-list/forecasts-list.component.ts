import {Component, inject} from '@angular/core';
import {WeatherService} from '../weather.service';
import {ActivatedRoute, Params} from '@angular/router';
import {Forecast} from './forecast.type';
import {Observable, of} from 'rxjs';
import {filter, switchMap, tap} from 'rxjs/operators';
import {WeatherCachingService} from '../weather-caching.service';

@Component({
  selector: 'app-forecasts-list',
  templateUrl: './forecasts-list.component.html',
  styleUrls: ['./forecasts-list.component.css']
})
export class ForecastsListComponent {

  private readonly route: ActivatedRoute = inject(ActivatedRoute)
  private readonly weatherService: WeatherService = inject(WeatherService)
  private readonly weatherCachingService: WeatherCachingService<Forecast> = inject(WeatherCachingService)
  forecast$: Observable<Forecast>;


  ngOnInit() {
    this.forecast$ = this.route.params.pipe(
        filter((params: Params) => !!params),
        switchMap((params: Params): Observable<Forecast> => {
            const zipcode: string = params['zipcode']
            const forecastCacheKey: string = this.weatherService.getForecastCacheKey(zipcode)
            const forecastCached: Forecast = this.weatherCachingService.getData(forecastCacheKey)
            if (forecastCached) {
                return of(forecastCached)
            }
            return this.weatherService.getForecast(zipcode).pipe(
                tap((forecast: Forecast) => {this.weatherCachingService.cacheData(forecastCacheKey, forecast)})
            )
        })
    )
  }
}
