import { Injectable } from '@angular/core';
import {Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Country} from "../common/country";
import {map} from "rxjs/operators";
import {State} from "../common/state";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class Luv2ShopFormServiceService {

  private countriesUrl: string = environment.luv2shopApiUrl + '/countries';
  private statesUrl: string = environment.luv2shopApiUrl + '/states';

  constructor(private httpClient: HttpClient) { }

  getExpirationMonths(startMonth: number): Observable<number[]> {
    let result: number[] = [];

    for (let month=startMonth; month<=12; month++) {
      result.push(month);
    }

    return of(result);
  }

  getExpirationYears(): Observable<number[]> {
    let result: number[] = [];
    const startYear: number = new Date().getFullYear();

    for (let year=startYear; year<=startYear+12; year++) {
      result.push(year);
    }

    return of(result);
  }

  getCountries(): Observable<Country[]> {
    return this.httpClient.get<GetCountries>(this.countriesUrl).pipe(
      map(res => res._embedded.countries)
    );
  }

  getStates(countryCode: string): Observable<State[]> {
    const stateCodeUrl = `${this.statesUrl}/search/findByCountryCode?code=${countryCode}`;

    return this.httpClient.get<GetStates>(stateCodeUrl).pipe(
      map(res => res._embedded.states)
    );
  }
}

interface GetCountries {
  _embedded: {
    countries: Country[];
  }
}

interface GetStates {
  _embedded: {
    states: State[];
  }
}
