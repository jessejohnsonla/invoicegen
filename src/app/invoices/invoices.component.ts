import { Subscription } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Invoice } from './invoices.model';
import { InvoicesService } from './invoices.service';
import { Router } from '@angular/router';
import { Title }     from '@angular/platform-browser';
import { EditComponent } from './edit/edit.component';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css']
})
export class InvoicesComponent implements OnInit, OnDestroy {
  invoices: Invoice[];
  navigationSubscription: Subscription;
  modalRef: BsModalRef;
  modalsubscription: Subscription;
  subscriptions: Subscription[] = [];

  constructor(private invoiceService: InvoicesService,
              private router: Router,
              private titleService: Title,
              private modalService: BsModalService) { 
                this.titleService.setTitle('show invoices')
              }

  ngOnInit() {
    this.modalsubscription = this.modalService.onHidden.subscribe(
      (reason: string) => {
        // if(this.modalsubscription)
        //   this.modalsubscription.unsubscribe();
        this.loadInvoices();
    })
    this.subscriptions.push(this.modalsubscription);

    this.loadInvoices();
  }

  ngOnDestroy(): void {
    for(let subscription of this.subscriptions){
      subscription.unsubscribe();
    }
    if(this.loadinvoicessubscription)
      this.loadinvoicessubscription.unsubscribe();
  }

  loadinvoicessubscription: Subscription;
  loadInvoices(): any {
    if(this.loadinvoicessubscription)
      this.loadinvoicessubscription.unsubscribe();

    this.loadinvoicessubscription = this.invoiceService.getInvoices().subscribe(
      data => this.invoices = data
    );
  }
  
  sendClick(id:number) {
    this.router.navigate(['invoices','preview', id],
    {skipLocationChange: true});
  }
  editClick(id:number) {
    // this.router.navigate(['invoices','edit', id],
    // {skipLocationChange: true});

    const initialState = {
      id: id   
    };
    this.modalRef = this.modalService.show(EditComponent, {initialState});
    this.modalRef.content.closeBtnName = 'Close';
  }
  
  onNewItemClick() {
    const initialState = {
      //id: id   
    };
    this.modalRef = this.modalService.show(EditComponent, {initialState});
    this.modalRef.content.closeBtnName = 'Close';
  }

  deleteinvoicesubscription: Subscription;
  deleteClick(id:number) {
    if(!confirm('Delete this invoice?'))
      return;
      
    if(this.deleteinvoicesubscription)
      this.deleteinvoicesubscription.unsubscribe();

    this.deleteinvoicesubscription = this.invoiceService.deleteInvoice(id).subscribe(
     result => {
      switch(result)
      {
        case "0":
          alert('Delete was not successful.');
          break;
        case "1":
          this.loadInvoices();
        break;
        default:
          alert('Too many deleted: ' + result);
          this.loadInvoices();
        break;
      }
     } 
    );
  }
}
