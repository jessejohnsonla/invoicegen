import { Observable } from 'rxjs/internal/Observable';
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
  _isnew:boolean = true;
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

  get isnew() : boolean {
    return this._isnew;
  }
  set isnew(isnew: boolean) {
    this._isnew = isnew;
  }

  ngOnDestroy(): void {
    for(let subscription of this.subscriptions){
      subscription.unsubscribe();
    }
    if(this.loadinvoicesubscription)
      this.loadinvoicesubscription.unsubscribe();
  }

  ngOnInit() {
    var idparam = this.route.snapshot.params['id'];
    if(idparam != null && idparam != '')
    {
      this.id = idparam;
    
      var subscription = this.route.params.subscribe(
        (params) => { 
          this.id = params['id'];
          if(this.id > 0) {
            this.mode = 'Edit';
            this.isnew = false;
            this.loadInvoice();
          }
          else{
            this.mode = 'Create';
            this.invoice = new Invoice();
            this.isnew = true;
          }
        }
      );
      this.subscriptions.push(subscription);  
    }
    else{
      if(this.id > 0) {
        this.mode = 'Edit';
        this.isnew = false;
        this.loadInvoice();
      }
      else{
        this.mode = 'Create';
        this.invoice = new Invoice();
        this.isnew = true;
      }
    }
      

    subscription = this.editinvoiceform.valueChanges
      .subscribe(status => {
        this.isdirty = this.editinvoiceform.dirty;
      });
      this.subscriptions.push(subscription);
    }

  loadinvoicesubscription: Subscription;
  loadInvoice() {
    this.loadinvoicesubscription = this.invoicesservice.getInvoice(this.id).subscribe( invoice => {
      this.invoice = invoice;
      this.id = invoice.ID;
    });
    this.subscriptions.push(this.loadinvoicesubscription);
  }

  onToggleAddressClick(){
      this.toggle = this.toggle == 'show' ? 'hide' : 'show';
      this.addressDisplay = this.addressDisplay == 'none' ? 'inline' : 'none';
  }

  onNewItemClick() {
    const initialState = {
      invoiceid: this.invoice.ID  
    };
    this.modalRef = this.modalService.show(InvoiceItemsComponent, {initialState});
    this.modalRef.content.closeBtnName = 'Close';
  }

  saveinvoicesubscription: Subscription;
  onSaveClick(elementRef)
  {
    if(this.invoice.ID > 0) {
      var result = this.invoicesservice.updateInvoice(this.invoice);
      this.saveinvoicesubscription = result.subscribe(invoice => {
        if(!invoice)
          alert('save was not successful');
        else {
          this.isdirty = false;
          this.isnew = false;
          this.reinit(this.invoice.ID)
        }
      });
      this.subscriptions.push(this.saveinvoicesubscription);
    }
    else {
      var cresult = this.invoicesservice.createInvoice(this.invoice);
      this.saveinvoicesubscription = cresult.subscribe(invoice => {
        if(invoice == null)
          alert('create was not successful');
        else {
          this.invoice = invoice;
          this.id = invoice.ID;
          this.isdirty = false;
          this.isnew = false;
          this.reinit(this.id);

          if(this.invoice.ID > 0) {
            this.mode = 'Edit';
            this.isnew = false;
          }
          else{
            this.mode = 'Create';
            this.isnew = true;
          }
        }
      });
      this.subscriptions.push(this.saveinvoicesubscription);
    }
  }
  reinit(id:number): any {
    this.ngOnDestroy();
    this.editinvoiceform.reset();

    this.isdirty = false;
    this._isnew = true;

    this.ngOnInit();
  }

  onSelectChange($event){
    this.invoice.Terms = $event.target.value;
  }
}
