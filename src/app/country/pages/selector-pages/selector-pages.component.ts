import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { Region, SmallCountry } from '../../interfaces/country.interfaces';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-pages',
  templateUrl: './selector-pages.component.html',
  styles: [
  ]
})
export class SelectorPagesComponent implements OnInit {


  public countriesByregion: SmallCountry[] = [];
  public borders: SmallCountry[] = [];


  public myForm: FormGroup = this.fb.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    border: ['', Validators.required],

  })

  constructor(
    private fb: FormBuilder,
    private countriesService: CountriesService
  ) { }


  ngOnInit(): void {
    this.onRegionChanges();
    this.onCountryChanges();
  }


  get regions(): Region[] {
    return this.countriesService.regions;
  }


  onRegionChanges(): void {
    this.myForm.get('region')?.valueChanges
      .pipe(
        tap(() => this.myForm.get('country')!.setValue('')),
        tap(() => this.borders = []),
        switchMap(
          region => this.countriesService.getCountriesByRegion(region)
        ),
      )
      .subscribe(countries => {
        this.countriesByregion = countries;
      })
  }


  onCountryChanges(): void {
    this.myForm.get('country')!.valueChanges
      .pipe(
        tap(() => this.myForm.get('border')!.setValue('')),
        filter((value: string) => value.length > 0),
        switchMap(
          alphacode => this.countriesService.getCountryByAlphaCode(alphacode)
        ),
        switchMap(
          country => this.countriesService.getCountryBordersByCode(country.borders)
        )
      )
      .subscribe(countries => {
        this.borders = countries;
      })
  }






}
