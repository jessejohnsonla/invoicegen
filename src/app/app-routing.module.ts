import { AppComponent } from './app.component';
import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
//import { ServerResolver } from './server-resolver.service';
import { InvoiceHistoryComponent } from './invoice-history/invoice-history.component';
import { EditInvoiceComponent } from './edit-invoice/edit-invoice.component';
import { AddEmailsComponent } from "./invoice-history/add-emails/add-emails.component";
import { ProcessComponent } from './process/process.component';
import { ErrorPageComponent } from './error-page/error-page.component';

const appRoutes:Routes = [
    { path: '', redirectTo: 'invoice-history', pathMatch: 'full',
    runGuardsAndResolvers: 'always' },
    { path: 'invoice-history', component: InvoiceHistoryComponent,
    runGuardsAndResolvers: 'always',
    children: [
        { path: 'add-emails/:id', component: AddEmailsComponent,
        runGuardsAndResolvers: 'always' }
    ]},
    { path: 'invoice/process', component: ProcessComponent,
    runGuardsAndResolvers: 'always' },
    { path: 'invoice/edit/:id', component: EditInvoiceComponent,
    runGuardsAndResolvers: 'always'  },
  ]
  
@NgModule({
    imports: [RouterModule.forRoot(appRoutes, 
        {onSameUrlNavigation: 'reload'})],
    exports: [RouterModule],
    })
export class AppRoutingModule {

}