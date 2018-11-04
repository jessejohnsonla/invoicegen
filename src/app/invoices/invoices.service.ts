import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { InvoiceItem, Invoice } from './invoices.model';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, of, Subscription } from 'rxjs';
import { serialize } from 'json-typescript-mapper';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'text/plain'
  })
};

@Injectable({
  providedIn: 'root'
})
export class InvoicesService implements OnDestroy {

  baseUrl:string = 'http://localhost/';
  putsubscription: Subscription;
  postsubscription: Subscription;

  constructor(private httpClient: HttpClient) { }
  
  ngOnDestroy(): void {
    if(!!this.putsubscription)
      this.putsubscription.unsubscribe();
      if(!!this.postsubscription)
        this.postsubscription.unsubscribe();
  }

  createInvoiceItem(item: InvoiceItem) {

    var post = this.httpClient.post<InvoiceItem>(this.baseUrl + 'invoiceitems/' + item.InvoiceID, item);
    return post;
  }

  updateInvoiceItem(item: InvoiceItem): any {
    var put = this.httpClient.put<InvoiceItem>(this.baseUrl + 'invoiceitems/' + item.InvoiceID, item);
    return put;
  }

  deleteInvoiceItem(itemid: number)
  {
    var del = this.httpClient.delete<string>(this.baseUrl + 'invoiceitems/' + itemid);
    return del;
  }

  createInvoice(invoice: Invoice) {

    var post = this.httpClient.post<Invoice>(this.baseUrl + 'invoice/', invoice);

    this.postsubscription = post.subscribe(result => {
      invoice = result;
    },
    error => { return null; });
    return invoice;
  }

  updateInvoice(invoice: Invoice)  {
    var put = this.httpClient.put<boolean>(this.baseUrl + 'invoice/', invoice, httpOptions);
    this.putsubscription = put.subscribe(result => {
      console.log(result + '$$');
      return new Observable<{success: true, errormsg: null}>();
    },
    error => { return new Observable<{success: false, errormsg:  null}>() });
    return put;
  }

  getInvoice(invoiceid: number): Observable<Invoice> {
    return this.httpClient.get<Invoice>(this.baseUrl + 'invoice/' + invoiceid);
  }
  getInvoiceItem(invoiceid:number, invoiceitemid: number): Observable<InvoiceItem> {
    return this.httpClient.get<InvoiceItem>(this.baseUrl + 'invoiceitems/' + invoiceid + '/' + invoiceitemid);
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