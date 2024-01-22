import { Injectable } from '@angular/core';
import { Country, Region, SmallCountry } from '../interfaces/country.interfaces';
import { Observable, combineLatest, map, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })

export class CountriesService {

    private baseUrl: string = 'https://restcountries.com/v3.1'
    private _region: Region[] = [Region.Africa, Region.Americas, Region.Asia, Region.Europe, Region.Oceania]

    constructor(
        private http: HttpClient
    ) { }


    get regions(): Region[] {
        return [...this._region];
    }

    getCountriesByRegion(region: Region): Observable<SmallCountry[]> {
        if (!region) return of([]);
        const url: string = `${this.baseUrl}/region/${region}?fields=cca3,name,borders`;

        return this.http.get<Country[]>(url)
            .pipe(
                map(countries => countries.map(country => ({
                    name: country.name.common,
                    cca3: country.cca3,
                    borders: country.borders ?? []
                }))),
                tap(response => console.log({ response })),
            );
    }


    getCountryByAlphaCode(alphacode: string): Observable<SmallCountry> {
        const url = `${this.baseUrl}/alpha/${alphacode}?fields=cca3,name,borders`
        return this.http.get<Country>(url)
            .pipe(
                map(country => ({
                    name: country.name.common,
                    cca3: country.cca3,
                    borders: country.borders ?? []
                })))
    }

    getCountryBordersByCode(borders: string[]): Observable<SmallCountry[]> {
        if (!borders || borders.length === 0) return of([]);

        const countryRequests: Observable<SmallCountry>[] = [];

        borders.forEach(code => {
            const request = this.getCountryByAlphaCode(code);
            countryRequests.push(request);
        });

        return combineLatest(countryRequests)
    }

}