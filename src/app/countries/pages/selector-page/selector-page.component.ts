import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { Region, SmallCountry } from '../../interfaces/country.interfaces';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  public countriesByRegion: SmallCountry[] = [];
  public borders: SmallCountry[] = [];

  public myForm: FormGroup = this.fb.group({
    region:  ['', Validators.required ],
    country: ['', Validators.required ],
    border: ['', Validators.required ],
  })

  constructor(
    private fb: FormBuilder, // importarlo de @angular/forms
    private countriesService: CountriesService,
  ) {}

  ngOnInit(): void {
    this.onRegionChanged();
    this.onCountryChange();
  }

  get regions(): Region[] {  // arreglo con todas las regiones que quiero mostrar
    return this.countriesService.regions;
  }

  onRegionChanged(): void {
    this.myForm.get('region')!.valueChanges
      .pipe(
        tap ( () => this.myForm.get('country')!.setValue('') ), /* propiedad de rxjs para que en el buscador NO devuelva un string vacìo, si no que
        regrese al valor predeterminado, que es "Seleccione un paìs" */
        tap( () => this.borders = [] ),
        switchMap( (region) => this.countriesService.getCountriesByRegion(region) ),
      )
      .subscribe( countries => {
        this.countriesByRegion = countries;
      });
  }

  /** propiedad utilizada para ver las fronteras del país seleccionado */
  onCountryChange(): void {
    this.myForm.get('country')!.valueChanges
      .pipe(
        tap ( () => this.myForm.get('border')!.setValue('') ),
        filter ( (value: string) => value.length > 0 ),
        switchMap( (alphaCode) => this.countriesService.getCountryByAlphaCode(alphaCode) ),
        switchMap( (country) => this.countriesService.getCountryBordersByCode( country.borders ) ),
      )
      .subscribe( countries => {
        this.borders = countries;
      });
  }

}
