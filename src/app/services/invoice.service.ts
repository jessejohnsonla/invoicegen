import { Data } from '@angular/router';
import { Injectable, OnInit } from '@angular/core';
import { InvoiceItem, Invoice } from '../models/invoice.model';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { encode } from 'punycode';
import {map, catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService implements OnInit {
  baseUrl:string = 'http://192.168.1.95/';

  getInvoice(invoiceid: number): Observable<Invoice> {
    return this.httpClient.get<Invoice>(this.baseUrl + 'invoice/' + invoiceid);
  }

  getInvoices(): Observable<Invoice[]> {
    return this.httpClient.get<Invoice[]>(this.baseUrl + 'invoice', {responseType:'json'});
    
  }
  
    getInvoiceItems(id: number): Observable<InvoiceItem[]> {
      return this.httpClient.get<InvoiceItem[]>(this.baseUrl + 'invoiceitems/' + id, {responseType:'json'});
    
    }

    handleProcessing(invoiceid: number, emails: string) : Observable<string> {
      var url = this.baseUrl + 'process/' + invoiceid;
      if(emails != null && emails.length > 0 && emails.indexOf('@')>=0)
        url += '/' + encode(emails);
      return this.httpClient.get<string>(url);
    }

  constructor(private httpClient: HttpClient) { }

  ngOnInit()
  {
    //this.invoices = this.getInvoices();
  }
}