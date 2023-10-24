# Selectores

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Armado del proyecto:

## Estructura de directorios:

se esta tratando de trabajar basado en features, como modulos de autenticacion, y con su componente independiente.

## Carpeta country

En esta se almacenará todo lo relacionado a los países, crear dos folders, "interfaces" y "pages" (componentes a pantalla completa), donde esta última está conectada con el Router de Angular, y una más llamada "services".

las tres carpetas que se crearon, van a estar separadas por un modulo que permite su exportacion  y utilizacion en otra dependencia, para esto utilizaremos `click derecho en la carpeta "countries"` + `Angular: generate another schematic` + `nombrar "countries"` (el modulo debe tener el mismo nombre del directorio).

El modulo 'countries.module.ts' no está importado en ningún lugar.

Con respecto a la primer página del directorio "pages", crearemos una nueva llamada 'selector-page'. Para entrar a la pantalla de selector con Lazy Load, hay que crear los paths y loadChildren.

## Selector page works!

Para poder ver el selector page con Lazyload:

1. primero, crear un modulo extra dentro de la carpeta "pages" llamado 'countries-routing.module.ts', dentro de este modulo:
  const routes: Routes = [    // importar Routes de @angular/router
    {
      path: '',
      children: [
        { path: 'selector', component: SelectorPageComponent // importado de la carpeta 'pages' },
        { path: '**', redirectTo: 'selector' },
      ]
    }
  ];

  el objeto 'routes' debe ser colocado en algun lado, para eso utilizaremos el @NgModule (importándolo de angular/core):

  @NgModule({
    imports: [ RouterModule.forChild(routes) ] // importar RouterModule de @angular/router,
    exports: [ RouterModule ],
  })
  export class CountriesRoutingModule {}

Hasta este momento esta creada la clase, pero no esta conectada con el countries.module.ts.

2. Para conectarla, navegue hacia 'countries.module.ts' y colóquela en las importaciones de @NgModule como:

imports: [
  CountriesRoutingModule,
]

3. En el sistema de rutas principal [ app-routing.module.ts ], es necesario mandar a llamar el loadChildren:

  import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
    path: 'selector',
    loadChildren: () => import('./countries/countries.module').then( m => m.CountriesModule ),
  },
  {
    path:'**',
    redirectTo: 'selector',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

## Creación de formulario reactivo:

1. Dentro de selector-page.component.html: revise `selector-page.component.html`

Dentro de selector-page.component.ts: 
  Se utilizarán varias cosas, por ejemplo, el diseño del formulario, o si se trabaja con formularios reactivos, hay que importar este modulo en el `countries.module.ts`.

Al importarlo, ya tendremos los formularios reactivos a lo largo de toda la aplicación.

2. Inyección del FormBuilder dentro de `class SelectorPageComponent`:

  constructor(
    private fb: FormBuilder // importarlo de @angular/forms
  ) {}

3. Creación del formulario de manera pública:

  public myForm: FormGroup = this.fb.group({
    region:  ['', Validators.required ],
    country: ['', Validators.required ],
    borders: ['', Validators.required ],
  })

Conectar el `myForm` con el archivo .html:

línea 5:     <form [formGroup]="myForm">

4. Para asociar un fragmento del formulario con el selector del .html:

línea 9:     <select `formControlName="region"` class="form-control">

## Servicio e interfaces

1. abrir Postman.

2. abrir el link del API de la clase ( en este caso corresponde a restcountries.com )

3. buscar "region", copiar el link y pegarlo en postman.

4. click en "SEND".

5. copiar toda la respuesta emitida por postman.

6. abrir quicktype.io > open quicktype > pegar toda la informacion de postman del lado izquierdo y renombrar, en este caso, por Country

7. del lado derecho, verificar que esté activada la opción de "interfaces only" y "verify json.parse results at runtime".

8. copiar el código y regresar a VS.

9. Crear un nuevo archivo en la carpeta `interfaces` llamado [country.interfaces.ts], copiar todo el código copiado de quicktype.
  Hay que cerciorarse de que se nombre y se utilice adecuadamente lo necesario en la interfaz, en este caso, hay que especificar que se requiere la informacion de los 5 continentes.

10. Creación de servicio, ese servicio dentro de la carpeta "services" se va a llamar `countries` y se creará con angular schematics.

## Selector de regiones

1. Crear dentro del servicio la clase del CountriesService:

  export class CountriesService {

    private _regions: Region[] = [ Region.Africa, Region.Americas, Region.Asia, Region.Europe, Region.Oceania ];

    constructor() { }

    get regions(): Region[] {
      return [ ...this._regions ];
    }

  }

2. inyectar el servicio en el `selector-page.component.ts`

  constructor(
    private fb: FormBuilder, // importarlo de @angular/forms
    private countriesService: CountriesService,
  ) {}

inclusión de un getter para mostrar el arreglo de las regiones que quiero mostrar

  get regions(): Region[] {
    return this.countriesService.regions;
  }

3. aplicacion en el archivo .html

Una vez creado el servicio, la inyeccion en el .html se hace de la siguiente forma:

  < option *ngFor="let region of regions" [value]="region" > {{ region }} < /option >

# Segundo selector anidado "Countries"

1. Preparación del espacio para countries.

2. copiado del segmento .html:

  < div class="row mb-3">
    < label class="form-label">País::</>
    < select formControlName="country" class="form-control">
      < option value="">-- Seleccione un país --</>
      < option *ngFor="let region of regions" [value]="region" >{{ region }}</>
    </>
  </>

3. Detección del cambio del selector, el selector anidado se disparará cuando el valor del primer selector cambie, es decir, cuando tenga un valor.

4. Ir a selector-page.component.ts, y establecer un `listener` que me diga cuando la region cambia y pueda disparar la region seleccionada para traer la informacion deseada del backend.

  para realizarlo, hay que hacer uso del NgOnInit:
    * colocar implements OnInit e importarlo de @angular/core.
    * ngOnInit(): void {

        this.myForm.get('region')!.valueChanges
         .subscribe( region => {
           console.log({ region })
          });
      }

    * en los servicios necesitamos llamar a todos los paises que esten por esa region. Crearemos una nueva propiedad:

      getCountriesByRegion( region: Region ): SmallCountry[] {


        return [];
      }

    La interfase "SmallCountry" viene de la interfaz hecha previamente en country.interface.ts, donde para no utilizar toda la informacion que respecta a "country", realizamos una interfaz pequeña y nueva que se puede exportar llamada "SmallCountry".

## Obtencion de paises por region.

  * 
