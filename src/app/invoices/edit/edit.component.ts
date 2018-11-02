import { Invoice } from './../invoices.model';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import {IGenericObject} from 'json-typescript-mapper';
import { Subscription } from 'rxjs';
import { InvoicesService } from '../invoices.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy {

  id:number;
  mode:string = 'Create';
  toggle:string = 'show';
  addressDisplay:string = 'none';
  isdirty:boolean = false;
  invoice:Invoice = new Invoice();
  @ViewChild('editinvoiceform') editinvoiceform;
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
    var sub = this.route.params.subscribe((params) => { this.id = params['id']});
    this.subscriptions.push(sub);

    if(this.id > 0) {
      this.mode = 'Edit';
    }
    var $json:IGenericObject = {"BillToName":"bill-to-name"};
    
    this.invoicesservice.getInvoice(this.id).subscribe( invoice => {
      this.invoice = invoice;
    })

    sub = this.editinvoiceform.valueChanges
        .subscribe(status => {
          this.isdirty = this.editinvoiceform.dirty;
        });
    this.subscriptions.push(sub);
  }

  onToggleAddressClick(){
      this.toggle = this.toggle == 'show' ? 'hide' : 'show';
      this.addressDisplay = this.addressDisplay == 'none' ? 'inline' : 'none';
  }

  onSaveClick(elementRef)
  {
    var subscription:Subscription;
    var result:any;
    if(this.mode === 'Edit') {
      result = this.invoicesservice.updateInvoice(this.invoice);
      if(!result)
      {
        console.log('not updated:');
        return;
      }
      subscription = result.subscribe(invoice => {
        this.isdirty = false;
      });
      this.subscriptions.push(subscription);
    }
    else {
      result = this.invoicesservice.createInvoice(this.invoice);
      if(!result)
      {
        console.log('not created:');
        return;
      }
      subscription = result.subscribe(invoice => {
        this.isdirty = false;
        this.invoice = invoice;
      });
      this.subscriptions.push(subscription);
    }
  }

  onSelectChange($event){
    this.invoice.Terms = $event.target.value;
  }
}
