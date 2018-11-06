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
  id: number;
  invoiceid: number;
  invoice: Invoice;
  invoiceitems: InvoiceItem[];
  navigationSubscription;
  subscriptions: Subscription[] = [];
  modalRef: BsModalRef;
  modalsubscription: Subscription;

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
      id: id,
      invoiceid: this.invoiceid    
    };
    this.modalRef = this.modalService.show(EditItemComponent, {initialState});
    this.modalRef.content.closeBtnName = 'Close';
  }

  ngOnInit() {
    //this.invoiceid = this.route.snapshot.params['invoiceid'];


    var idparam = this.route.snapshot.params['invoiceid'];
    if(idparam != null && idparam != '')
      this.invoiceid = idparam;
    var subscription = this.route.params.subscribe(
      (params) => { 
        if(this.invoiceid==null)
          this.invoiceid = params['invoiceid']
      }
    );
    this.subscriptions.push(subscription);

    this.loadInvoice()
    this.loadInvoiceItems();

    this.modalsubscription = this.modalService.onHidden.subscribe(
      (reason: string) => {
        this.loadInvoice()
        this.loadInvoiceItems();
    })
    this.subscriptions.push(this.modalsubscription);
  }

  ngOnDestroy(): void {
    for(let subscription of this.subscriptions){
      subscription.unsubscribe();
    }
    if(this.loadinvoicesubscription)
      this.loadinvoicesubscription.unsubscribe();
    if(this.loadinvoiceitemsubscription)
      this.loadinvoiceitemsubscription.unsubscribe();  
    if(this.deleteinvoiceitemsubscription)
      this.deleteinvoiceitemsubscription.unsubscribe();    
  }

  loadinvoicesubscription: Subscription;
  loadInvoice(){
    if(this.loadinvoicesubscription)
      this.loadinvoicesubscription.unsubscribe();

    this.loadinvoicesubscription = this.invoiceService.getInvoice(this.invoiceid).subscribe(
      data => { this.invoice = data; }   
    );   
  }

  loadinvoiceitemsubscription: Subscription;
  loadInvoiceItems(){
    if(this.loadinvoiceitemsubscription)
      this.loadinvoiceitemsubscription.unsubscribe();

    this.loadinvoiceitemsubscription = this.invoiceService.getInvoiceItems(this.invoiceid ).subscribe(
      data => { this.invoiceitems = data; }   
    );   
  }

  deleteinvoiceitemsubscription: Subscription;
  deleteClick(id:number) {
    if(!confirm('Delete this line item?'))
      return;
      
    if(this.deleteinvoiceitemsubscription)
      this.deleteinvoiceitemsubscription.unsubscribe();

    this.deleteinvoiceitemsubscription = this.invoiceService.deleteInvoiceItem(id).subscribe(
     result => {
        switch(result)
        {
          case "0":
            alert('Delete was not successful.');
            break;
          case "1":
            this.loadInvoiceItems();
          break;
          default:
            alert('Too many deleted: ' + result);
            this.loadInvoiceItems();
          break;
        }
     } 
    );
  }


  onNewItemClick() {
    const initialState = {
      invoiceid: this.invoiceid    
    };
    this.modalRef = this.modalService.show(EditItemComponent, {initialState});
    this.modalRef.content.closeBtnName = 'Close';
  }
}
