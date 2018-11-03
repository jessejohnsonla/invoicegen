import { AppComponent } from './app.component';
import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { InvoicesComponent } from './invoices/invoices.component';
import { EditComponent } from './invoices/edit/edit.component';
import { PreviewComponent } from "./invoices/preview/preview.component";
import { EditItemComponent } from './invoices/edit-item/edit-item.component';
import { InvoiceItemsComponent } from './invoices/items/items.component';

const appRoutes:Routes = [
    { path: '', redirectTo: 'invoices', pathMatch: 'full',
    runGuardsAndResolvers: 'always' },
    { path: 'invoices', component: InvoicesComponent,
    runGuardsAndResolvers: 'always',
    children: [
        { path: 'preview/:id', component: PreviewComponent,
        runGuardsAndResolvers: 'always' }
    ]},
    { path: 'invoices/edit/:id', component: EditComponent,
    runGuardsAndResolvers: 'always'  },
    { path: 'invoices/edit-item/:id', component: EditItemComponent,
    runGuardsAndResolvers: 'always'  },
    { path: 'invoices/items/:invoiceid', component: InvoiceItemsComponent,
    runGuardsAndResolvers: 'always'  },
  ]
  
@NgModule({
    imports: [RouterModule.forRoot(appRoutes, 
        {onSameUrlNavigation: 'reload'})],
    exports: [RouterModule],
    })
export class AppRoutingModule {

}