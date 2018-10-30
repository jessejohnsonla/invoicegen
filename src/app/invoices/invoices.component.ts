import { Component, OnInit, OnDestroy } from '@angular/core';
import { Invoice } from './invoices.model';
import { InvoicesService } from './invoices.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css']
})
export class InvoicesComponent implements OnInit {

  invoices: Invoice[];
  navigationSubscription;

  constructor(private invoiceService: InvoicesService,
              private router: Router) { 
              }

  ngOnInit() {
    this.invoiceService.getInvoices().subscribe(data => this.invoices = data);
  }
  
  sendClick(id:number) {
    this.router.navigate(['invoices','preview', id],
    {skipLocationChange: true});
  }
  editClick(id:number) {
    this.router.navigate(['invoices','edit', id],
    {skipLocationChange: true});
  }
  deleteClick(id:number) {
    //handle delete via service
  }
}
