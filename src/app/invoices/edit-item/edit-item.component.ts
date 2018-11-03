import { InvoiceItem } from './../invoices.model';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { InvoicesService } from '../invoices.service';
import { Title }     from '@angular/platform-browser';
import { BsModalRef } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.css']
})
export class EditItemComponent implements OnInit, OnDestroy {

  id:number;
  isdirty:boolean = false;
  invoiceitem:InvoiceItem = new InvoiceItem();
  @ViewChild('edititemform') edititemform;
  @ViewChild('savebutton') savebutton : ElementRef;
  subscriptions: Subscription[] = [];
  titlefragment: string = '';

  constructor(private route: ActivatedRoute,
              private invoicesservice: InvoicesService,
              private titleService: Title
              ) { 
                this.titleService.setTitle('edit item')
  }

  ngOnDestroy(): void {
    for(let subscription of this.subscriptions){
      subscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.titlefragment = (this.id > 0) ? 'Add Item to' : 'Edit Item from';
    this.invoiceitem.InvoiceID = this.id;
    var subscription = this.route.params.subscribe((params) => { this.id = params['id']});
    this.subscriptions.push(subscription);
    
    subscription = this.edititemform.valueChanges
        .subscribe(changes => {
          this.isdirty = this.edititemform.dirty;
        });
    this.subscriptions.push(subscription);
  }


  onSaveClick(elementRef)
  {
    var subscription: Subscription;
      var result = this.invoicesservice.createInvoiceItem(this.invoiceitem);
      subscription = result.subscribe(item => {
        //this.invoiceitem = item;
        this.isdirty = false;
      });
      this.subscriptions.push(subscription);
    }
 
}
