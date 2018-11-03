import { Component, OnInit, OnDestroy, ViewContainerRef } from '@angular/core';
import { Invoice, InvoiceItem } from '../invoices.model';
import { InvoicesService } from '../invoices.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Title }     from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { EditItemComponent } from '../edit-item/edit-item.component';
 
@Component({
  selector: 'app-invoice-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class InvoiceItemsComponent implements OnInit, OnDestroy {
  invoiceid: number;
  invoice: Invoice;
  invoiceitems: InvoiceItem[];
  navigationSubscription;
  subscriptions: Subscription[] = [];
  modalRef: BsModalRef;

  constructor(private route: ActivatedRoute,
              private invoiceService: InvoicesService,
              private router: Router,
              private titleService: Title,
              private viewRef: ViewContainerRef,
              private modalService: BsModalService) { 
                this.titleService.setTitle('show items')
              }

  editClick(id:number) {
    const initialState = {
      list: [
        '...'
      ],
      title: '',
      itemid: id
    };
    this.modalRef = this.modalService.show(EditItemComponent, {initialState});
    this.modalRef.content.closeBtnName = 'Close';
  }

  ngOnInit() {
    this.invoiceid = this.route.snapshot.params['invoiceid'];

    var subscription = this.invoiceService.getInvoice(this.invoiceid ).subscribe(
      data => { this.invoice = data }
    );
    this.subscriptions.push(subscription);
    
    var subscription = this.invoiceService.getInvoiceItems(this.invoiceid ).subscribe(
      data => { this.invoiceitems = data }
    );
    this.subscriptions.push(subscription);
  }

  ngOnDestroy(): void {
    for(let subscription of this.subscriptions){
      subscription.unsubscribe();
    }
  }


  sendClick(id:number) {
    // this.router.navigate(['invoices','preview', id],
    // {skipLocationChange: true});
  }

  deleteClick(id:number) {
    //handle delete via service
  }
}
