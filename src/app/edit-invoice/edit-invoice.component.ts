import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-invoice',
  templateUrl: './edit-invoice.component.html',
  styleUrls: ['./edit-invoice.component.css']
})
export class EditInvoiceComponent implements OnInit {

  billtoname: string;

  constructor() { }

  ngOnInit() {
    this.billtoname = "Avenue Night Club";
  }

}
