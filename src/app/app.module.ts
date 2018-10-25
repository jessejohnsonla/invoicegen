import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { EditInvoiceComponent } from './edit-invoice/edit-invoice.component';
import { InvoiceHistoryComponent } from './invoice-history/invoice-history.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AddEmailsComponent } from './invoice-history/add-emails/add-emails.component';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { ProcessComponent } from './process/process.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ErrorPageComponent } from './error-page/error-page.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

@NgModule({
  declarations: [
    AppComponent,
    EditInvoiceComponent,
    InvoiceHistoryComponent,
    AddEmailsComponent,
    ProcessComponent,
    ErrorPageComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule,
    PdfViewerModule,
    FormsModule,
    AngularFontAwesomeModule
  ],
  providers: [HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule { }
