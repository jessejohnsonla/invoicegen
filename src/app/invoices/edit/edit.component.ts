import { Invoice } from './../invoices.model';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef, Attribute, OnDestroy } from '@angular/core';
import {deserialize, serialize, IGenericObject} from 'json-typescript-mapper';
import { FormGroup, FormControl } from '@angular/forms';
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
  invoice:Invoice;
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

    //var invoice = deserialize(Invoice, $json);
    // this.invoice = new Invoice();
    // this.invoice.BillToName = 'bill-to-name';
    // $json = serialize(this.invoice);

    var sub:Subscription = this.editinvoiceform.valueChanges
        .subscribe(status => {
          this.isdirty = this.editinvoiceform.dirty;
          this.setSaveDisableStatus(this.savebutton.nativeElement);
        });
    this.subscriptions.push(sub);
  }

  onToggleAddressClick(){
      this.toggle = this.toggle == 'show' ? 'hide' : 'show';
      this.addressDisplay = this.addressDisplay == 'none' ? 'inline' : 'none';
  }

  onSaveClick(elementRef)
  {
    var sub:Subscription;
    if(this.mode === 'Edit') {
      sub = this.invoicesservice.updateInvoice(this.invoice).subscribe(invoice => {
        this.isdirty = false;
      });
    }
    else {
      sub = this.invoicesservice.createInvoice(this.invoice).subscribe(invoice => {
        if(invoice.success)
          this.isdirty = false;
          else{
            alert(invoice.errormsg + '!!!');
          }
      });
    }
    this.subscriptions.push(sub);
    this.setSaveDisableStatus(elementRef.srcElement);
  }

  setSaveDisableStatus(elref){
    if(this.isdirty) {
      elref.className = elref.className.replace('btn-default','btn-primary');
      return 'enabled';
    }
    elref.className = elref.className.replace('btn-primary','btn-default');
    return 'enabled';
  }    
}
