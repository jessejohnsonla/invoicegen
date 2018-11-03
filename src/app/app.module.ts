import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { PreviewComponent } from './invoices/preview/preview.component';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { EditComponent } from './invoices/edit/edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EditItemComponent } from './invoices/edit-item/edit-item.component';
import { InvoiceItemsComponent } from './invoices/items/items.component';
import { AlertModule } from 'ngx-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [
    AppComponent,
    EditComponent,
    InvoicesComponent,
    PreviewComponent,
    EditComponent,
    EditItemComponent,
    InvoiceItemsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule,
    PdfViewerModule,
    FormsModule,
    AngularFontAwesomeModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    [AlertModule.forRoot()]
  ],
  providers: [HttpClient, Title],
  bootstrap: [AppComponent]
})
export class AppModule { }
