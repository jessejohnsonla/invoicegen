import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Invoice } from './../invoices.model';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import {IGenericObject} from 'json-typescript-mapper';
import { Subscription } from 'rxjs';
import { InvoicesService } from '../invoices.service';
import { Title }     from '@angular/platform-browser';
import { EditItemComponent } from '../edit-item/edit-item.component';
import { InvoiceItemsComponent } from '../items/items.component';

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
  modalRef: BsModalRef;

  constructor(private route: ActivatedRoute,
              private invoicesservice: InvoicesService,
              private titleService: Title,
              public bsModalRef: BsModalRef,
              private modalService: BsModalService) { 
                this.titleService.setTitle('edit invoice')
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

    var subscription = this.route.params.subscribe(
      (params) => { 
        if(this.id==null)
          this.id = params['id']
      }
    );
    this.subscriptions.push(subscription);  
      
    if(this.id > 0) {
      this.mode = 'Edit';
      subscription = this.invoicesservice.getInvoice(this.id).subscribe( invoice => {
        this.invoice = invoice;
      })
      this.subscriptions.push(subscription);
    }
    

    subscription = this.editinvoiceform.valueChanges
        .subscribe(status => {
          this.isdirty = this.editinvoiceform.dirty;
        });
    this.subscriptions.push(subscription);
  }

  onToggleAddressClick(){
      this.toggle = this.toggle == 'show' ? 'hide' : 'show';
      this.addressDisplay = this.addressDisplay == 'none' ? 'inline' : 'none';
  }

  onNewItemClick() {
    const initialState = {
      invoiceid: this.id    
    };
    this.modalRef = this.modalService.show(InvoiceItemsComponent, {initialState});
    this.modalRef.content.closeBtnName = 'Close';
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
