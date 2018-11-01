import { Observable } from "rxjs/internal/Observable";

export class Invoice {
    public invoiceitems: InvoiceItem[];
    public ID: number;
                public BillToName: string;
                public BillToAddress: string;
                public BillToAddress2: string; 
                public BillToCity: string;
                public BillToState: string;
                public BillToZipcode:string;
                public ServiceDate: Date; 
                public Terms: string;
                public TaxRate: number;
                public AmountPaid: number;
                public DueDate: Date; 
                public Subtotal: number;
                public Total: number;
                public Balance: number;

    constructor() {}
  }
  
  export class InvoiceItem {
    public ID: number;
    public InvoiceID: number;
    public Description: string;
    public Qty:number;
    public Rate:number;
    public Amount:number;
    public Date:Date;


    constructor() {}
    
  }