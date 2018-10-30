import { Invoice } from './../invoices.model';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef, Attribute } from '@angular/core';
import {deserialize, serialize, IGenericObject} from 'json-typescript-mapper';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  id:number;
  mode:string = 'Create';
  toggle:string = 'show';
  addressDisplay:string = 'none';
  isdirty:boolean = false;
  invoice:Invoice;
  @ViewChild('editinvoiceform') editinvoiceform;
  @ViewChild('savebutton') savebutton : ElementRef;

  constructor(private route: ActivatedRoute) { 
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.route.params.subscribe((params) => { this.id = params['id']});
    
    if(this.id > 0) {
      this.mode = 'Edit';
    }
    var $json:IGenericObject = {"BillToName":"bill-to-name"};
    //var invoice = deserialize(Invoice, $json);
    this.invoice = new Invoice();
    this.invoice.BillToName = 'bill-to-name';
    $json = serialize(this.invoice);
      
    // this.editinvoiceform = new FormGroup({
    //   BillToName: new FormControl('')
    // });

    this.editinvoiceform.valueChanges
        .subscribe(status => {
          this.isdirty = true;
          this.setSaveDisableStatus(this.savebutton.nativeElement);
          console.log(status);
        });

  }

  onToggleAddressClick(){
      this.toggle = this.toggle == 'show' ? 'hide' : 'show';
      this.addressDisplay = this.addressDisplay == 'none' ? 'inline' : 'none';
  }

  onSaveClick(elementRef)
  {
    this.isdirty = false;
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
