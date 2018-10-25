import { Component, OnInit, OnDestroy } from '@angular/core';
import { Invoice } from '../models/invoice.model';
import { InvoiceService } from '../services/invoice.service';
import { Observable } from 'rxjs/internal/Observable';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invoice-history',
  templateUrl: './invoice-history.component.html',
  styleUrls: ['./invoice-history.component.css']
})
export class InvoiceHistoryComponent implements OnInit {
  init(): any {
    //throw new Error("Method not implemented.");
  }

  invoices: Invoice[];
  navigationSubscription;

  constructor(private invoiceService: InvoiceService,
              private router: Router) { 
              }

  ngOnInit() {
    this.invoiceService.getInvoices().subscribe(data => this.invoices = data);
  }
  
  sendClick(id:number) {
    this.router.navigate(['invoice-history','add-emails', id],
    {skipLocationChange: true});
  }
  editClick(id:number) {
    this.router.navigate(['invoice','edit', id],
    {skipLocationChange: true});
  }
  deleteClick(id:number) {
    //handle delete via service
  }
}
