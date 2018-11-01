import { Invoice, InvoiceItem } from './../invoices.model';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef, Attribute, OnDestroy } from '@angular/core';
import {deserialize, serialize, IGenericObject} from 'json-typescript-mapper';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { InvoicesService } from '../invoices.service';
import * as myutils from 'src/assets/myutils';


@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.css']
})
export class EditItemComponent implements OnInit, OnDestroy {

  id:number;
  mode:string = 'Create';
  toggle:string = 'show';
  addressDisplay:string = 'none';
  isdirty:boolean = false;
  invoiceitem:InvoiceItem = new InvoiceItem();
  @ViewChild('editinvoiceitemform') editinvoiceform;
  @ViewChild('savebutton') savebutton : ElementRef;
  subscriptions: Subscription[] = [];

  constructor(private route: ActivatedRoute,
              private invoicesservice: InvoicesService) { 
  }

  ngOnDestroy(): void {
    for(let subscription of this.subscriptions){
      subscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.invoiceitem.InvoiceID = this.id;
    var sub = this.route.params.subscribe((params) => { this.id = params['id']});
    this.subscriptions.push(sub);

    sub = this.editinvoiceform.valueChanges
        .subscribe(status => {
          this.isdirty = this.editinvoiceform.dirty;
          myutils.setSaveDisableStatus(this.savebutton.nativeElement, this.isdirty);
        });
    this.subscriptions.push(sub);
  }


  onSaveClick(elementRef)
  {
    var sub:Subscription;
      var result2 = this.invoicesservice.createInvoiceItem(this.invoiceitem);
      if(!result2)
      {
        console.log('invoice-item not created:');
        return;
      }
      sub = result2.subscribe(item => {
        this.isdirty = false;
        this.invoiceitem = item;
      });
      this.subscriptions.push(sub);
    }
 

}
