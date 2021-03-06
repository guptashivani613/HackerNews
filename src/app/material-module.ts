import {NgModule} from '@angular/core';
import {A11yModule} from '@angular/cdk/a11y';
import {MatIconModule} from '@angular/material/icon';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTooltipModule} from '@angular/material/tooltip';


@NgModule({
  exports: [
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatFormFieldModule,
    A11yModule,
    MatTooltipModule
  ]
})
export class DemoMaterialModule {}