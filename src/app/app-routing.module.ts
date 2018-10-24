import { AppComponent } from './app.component';
import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
//import { ServerResolver } from './server-resolver.service';
import { InvoiceHistoryComponent } from './invoice-history/invoice-history.component';
import { EditInvoiceComponent } from './edit-invoice/edit-invoice.component';
import { AddEmailsComponent } from "./invoice-history/add-emails/add-emails.component";
import { ProcessComponent } from './process/process.component';
import { InvoiceViewComponent } from './invoice-view/invoice-view.component';
import { ErrorPageComponent } from './error-page/error-page.component';

const appRoutes:Routes = [
    { path: '', redirectTo: 'invoices', pathMatch: 'full',
    runGuardsAndResolvers: 'always' },
    { path: 'invoices', component: InvoiceHistoryComponent,
    runGuardsAndResolvers: 'always'},
    { path: 'invoice/emails/:id', component: AddEmailsComponent,
    runGuardsAndResolvers: 'always' },
    { path: 'invoice/process', component: ProcessComponent,
    runGuardsAndResolvers: 'always' },
    { path: 'invoice/edit/:id', component: EditInvoiceComponent,
    runGuardsAndResolvers: 'always'  },
    { path: 'invoice/view/:id', component: InvoiceViewComponent,
    runGuardsAndResolvers: 'always'  }
  ]
  
@NgModule({
    imports: [RouterModule.forRoot(appRoutes, 
        {onSameUrlNavigation: 'reload'})],
    exports: [RouterModule],
    })
export class AppRoutingModule {

}