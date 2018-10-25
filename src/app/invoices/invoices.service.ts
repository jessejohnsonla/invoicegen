import { Injectable, OnInit } from '@angular/core';
import { InvoiceItem, Invoice } from './invoices.model';
import {HttpClient} from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoicesService {

  baseUrl:string = 'http://localhost/';

  constructor(private httpClient: HttpClient) { }

  getInvoice(invoiceid: number): Observable<Invoice> {
    return this.httpClient.get<Invoice>(this.baseUrl + 'invoice/' + invoiceid);
  }

  getInvoices(): Observable<Invoice[]> {
    return this.httpClient.get<Invoice[]>(this.baseUrl + 'invoice', {responseType:'json'});
    
  }
  
    getInvoiceItems(id: number): Observable<InvoiceItem[]> {
      return this.httpClient.get<InvoiceItem[]>(this.baseUrl + 'invoiceitems/' + id, {responseType:'json'});
    
    }

    handleProcessing(invoiceid: number) : Observable<string> {
      var url = this.baseUrl + 'process/' + invoiceid;
      return this.httpClient.get<string>(url);
    }

    sendPDF(pdfSrc: string, emails: string): Observable<string> {     
      var url = this.baseUrl + 'sendpdf?';
      if(pdfSrc != null && pdfSrc.length > 0 && pdfSrc.indexOf('.pdf')>=0)
      {
        url += 'p=' + encodeURIComponent(pdfSrc) + '&';
        if(emails != null && emails.length > 0 && emails.indexOf('@')>=0)
        {
          url += 'e=' + encodeURIComponent(emails);
          return this.httpClient.get<string>(url);
        }
        return of('no email(s) provided!');
      }
      return of('no pdfSrc provided!');
    }
}