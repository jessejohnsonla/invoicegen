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
    this.titlefragment = (this.id == 0) ? 'Add Item to' : 'Edit Item from';
    var subscription = this.route.params.subscribe(
      (params) => { 
        if(this.id==null)
          this.id = params['id']
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
      this.invoiceitem.InvoiceID = this.invoiceid;
    }

    subscription = this.edititemform.valueChanges
        .subscribe(changes => {
          this.isdirty = this.edititemform.dirty;
        });
    this.subscriptions.push(subscription);
    
  }


  onSaveClick(elementRef)
  {
    var subscription: Subscription;
      var result = this.id < 1 ? 
            this.invoicesservice.createInvoiceItem(this.invoiceitem)
            : this.invoicesservice.updateInvoiceItem(this.invoiceitem);
      subscription = result.subscribe(item => {
        //this.invoiceitem = item;
        if(this.invoiceitem.ID < 1)
          this.invoiceitem.ID = item.ID;
        this.isdirty = false;
      });
      this.subscriptions.push(subscription);
    }
 
}
