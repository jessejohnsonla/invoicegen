Function.prototype.bind = Function.prototype.bind || function (thisp) {
  var fn = this;
  return function () {
      return fn.apply(thisp, arguments);
  };
};

window.addEventListener('load', function() {
  window.status = 'readytoroll';
  //console.log(window.status);                  
});

import { Observable } from 'rxjs/internal/Observable';
import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../services/invoice.service';
import { ActivatedRoute } from '@angular/router';
import { Invoice, InvoiceItem } from '../models/invoice.model';


@Component({
  selector: 'app-invoice-view',
  templateUrl: './invoice-view.component.html',
  styleUrls: ['./invoice-view.component.css']
})
export class InvoiceViewComponent implements OnInit {
  id:number;
  invoice: Invoice;
  invoiceItems:InvoiceItem[];

  constructor(private invoiceService:InvoiceService,
              private route: ActivatedRoute) { 
              }

  ngOnInit() {
    this.performInit();

  }

  performInit(){
    this.id = this.route.snapshot.params['id'];
    
    this.invoiceService.getInvoice(this.id).subscribe(
      data => {
        this.invoice = data;
        //console.log(data);
      }
    );
    this.invoiceService.getInvoiceItems(this.id).subscribe(
      data => {
        this.invoiceItems = data;
        //console.log(data);
      }
    );
    
  }
}
