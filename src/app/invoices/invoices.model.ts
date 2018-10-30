import { Observable } from "rxjs/internal/Observable";

export class Invoice {
    public invoiceitems: InvoiceItem[];
    public ID: number;
                public BillToName: string;
                public BillToAddress: string;
                public BillToAddress2: string; 
                public BillToCity: string;
                public BillToState: string;
                public Terms: string;
                public DueDate: Date; 
                public TaxRate: number;
                public AmountPaid: number;
                public Subtotal: number;
                public Total: number;
                public Balance: number;

    constructor() {}
  }
  
  export class InvoiceItem {
    public ID: number;
    public Description: string;
    public Qty:number;
    public Rate:number;
    public Amount:number;

    constructor() {}
    
  }