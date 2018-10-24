import { InvoiceService } from './../../services/invoice.service';
import { Invoice } from './../../models/invoice.model';
import { OnInit, Component } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';


@Component({
  selector: 'app-add-emails',
  templateUrl: './add-emails.component.html',
  styleUrls: ['./add-emails.component.css']
})
export class AddEmailsComponent implements OnInit {
  id:number;
  invoice:Invoice;
  result:string;
  pdfSrc:string;
  navigationSubscription;

  page: number = 1;
  totalPages: number;
  isLoaded: boolean = false;

  afterLoadComplete(pdfData: any) {
    this.totalPages = pdfData.numPages;
    this.isLoaded = true;
  }

  nextPage() {
    this.page++;
  }

  prevPage() {
    this.page--;
  }

  constructor(private invoiceService: InvoiceService,
              private route: ActivatedRoute,
              private router: Router) { 
                this.navigationSubscription = this.router.events.subscribe((e:any) => {
                  if(e instanceof NavigationEnd) {
                    this.init();
                  }
                })}
  

  handlePdf(invoiceid: number, emails: string)
  {
    var inv = this.invoiceService.handleProcessing(invoiceid, emails);
    inv.subscribe(pdfurl => {
      this.pdfSrc = null;
      this.pdfSrc = pdfurl;    
      console.log(pdfurl);  
    });
  }

  init(){
    this.id = this.route.snapshot.params['id'];
    this.route.params.subscribe((params) => { this.id = params['id']});
      
    this.invoiceService.getInvoice(this.id).subscribe(data => this.invoice = data);

    this.handlePdf(this.id, "");
  }
  ngOnInit() {
  }
  ngOnDestroy() {
    // avoid memory leaks here by cleaning up after ourselves. If we  
    // don't then we will continue to run our initialiseInvites()   
    // method on every navigationEnd event.
    if (this.navigationSubscription) {  
       this.navigationSubscription.unsubscribe();
    }
  }
  onGoClick(invoiceid:number, emails:string)
  {
    this.handlePdf(invoiceid, emails);
  }

}
