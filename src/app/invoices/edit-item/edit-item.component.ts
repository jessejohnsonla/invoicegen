import { InvoiceItem } from './../invoices.model';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { InvoicesService } from '../invoices.service';
import { Title }     from '@angular/platform-browser';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.css']
})
export class EditItemComponent implements OnInit, OnDestroy {
  id: number = 0;
  invoiceid: number = 0;
  isdirty: boolean = false;
  invoiceitem: InvoiceItem = new InvoiceItem();
  subscriptions: Subscription[] = [];
  titlefragment: string = '';

  @ViewChild('edititemform') edititemform;
  @ViewChild('savebutton') savebutton: ElementRef; 

  constructor(private route: ActivatedRoute,
              private invoicesservice: InvoicesService,
              private titleService: Title,
              public bsModalRef: BsModalRef) { 
                this.titleService.setTitle('edit item');
  }

  ngOnDestroy(): void {
    for(let subscription of this.subscriptions){
      subscription.unsubscribe();
    }
  }

  ngOnInit() {
    var idparam = this.route.snapshot.params['id'];
    if(idparam != null && idparam != '')
      this.id = idparam;
    this.titlefragment = (this.id < 1) ? 'Add Item to' : 'Edit Item from';
    var subscription = this.route.params.subscribe(
      (params) => { 
        if(this.invoiceitem.ID==null)
        this.invoiceitem.ID = params['id']
      }
    );
    this.subscriptions.push(subscription);
    
    if(this.id > 0)
    {
      subscription = this.invoicesservice.getInvoiceItem(this.invoiceid, this.id).subscribe(
        result => {
            this.invoiceitem = result;
        }
      )
      this.subscriptions.push(subscription);
    }
    else {
      this.invoiceitem = new InvoiceItem();
      this.invoiceitem.InvoiceID = this.invoiceid;
    }

    subscription = this.edititemform.valueChanges
        .subscribe(changes => {
          this.isdirty = this.edititemform.dirty;
        });
    this.subscriptions.push(subscription);
    
  }


  saveinvoiceitemsubscription: Subscription;
  onSaveClick(elementRef)
  {
    if(this.saveinvoiceitemsubscription)
      this.saveinvoiceitemsubscription.unsubscribe();

    this.invoiceitem.InvoiceID = this.invoiceid;
    if(this.invoiceitem.ID == null || this.invoiceitem.ID < 1)
    {
      var result = this.invoicesservice.createInvoiceItem(this.invoiceitem);
                this.saveinvoiceitemsubscription = result.subscribe(item => {
                  this.invoiceitem.ID = item.ID;
                  this.isdirty = false;
                  this.titlefragment = (item.ID == 0) ? 'Add Item to' : 'Edit Item from';
                });
    }
    else {
      var result2 = this.invoicesservice.updateInvoiceItem(this.invoiceitem);
      this.saveinvoiceitemsubscription = result2.subscribe(item => {
                  if(item){
                    this.isdirty = false;
                  }
                  else
                  {
                    alert('update did not succeed.');
                  }
                });
    }
      this.subscriptions.push(this.saveinvoiceitemsubscription);
    }
 
}
