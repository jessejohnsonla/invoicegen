import { InvoicesService } from '../invoices.service';
import { Invoice } from '../invoices.model';
import { OnInit, Component, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';


@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {
  id:number;
  invoice:Invoice;
  result:string;
  pdfSrc:string;
  emails:string;
  navigationSubscription;
  zoom: number = 1.0;
  zoom_max: number = 2.0;
  zoom_min: number = 1.0;
  zoom_dir: number = 1; // 1 || -1
  zoom_step: number = 0.2;

  page: number = 1;
  totalPages: number;
  isLoaded: boolean = false;
  pdfviewerDisplay: string  = 'none';
  loadingDisplay: string  = 'table';
  sendDisplay: string  = 'none';

  toggleLoading(loading:boolean) {
    this.loadingDisplay = loading ? 'table' : 'none';
    this.sendDisplay = loading ? 'none' : 'table';
    this.pdfviewerDisplay = loading ? 'none' : 'block';
  }

  afterLoadComplete(pdfData: any) {
    this.totalPages = pdfData.numPages;
    this.isLoaded = true;
    this.toggleLoading(false);
  }

  nextPage() {
    this.page++;
  }

  prevPage() {
    this.page--;
  }

  constructor(private invoiceService: InvoicesService,
              private route: ActivatedRoute,
              private router: Router) { 
                this.navigationSubscription = this.router.events.subscribe((e:any) => {
                  if(e instanceof NavigationEnd) {
                    this.init();
                  }
                })}
  

  previewPdf(invoiceid: number)
  {
    this.toggleLoading(true);
    var inv = this.invoiceService.handleProcessing(invoiceid);
    inv.subscribe(pdfurl => {
      this.pdfSrc = null;
      this.pdfSrc = pdfurl;    
      console.log(pdfurl);  
    });
  }

  init(){
    this.toggleLoading(true);

    this.id = this.route.snapshot.params['id'];
    this.route.params.subscribe((params) => { this.id = params['id']});
      
    this.invoiceService.getInvoice(this.id).subscribe(data => this.invoice = data);
    this.emails = "3106213801@mms.att.net";
    this.previewPdf(this.id);
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
  onSendClick()
  {
    this.toggleLoading(true);
    var pdfsrc = this.pdfSrc.replace('http://localhost/', '');
    this.sendPDF(pdfsrc, this.emails);
  }
  sendPDF(pdfSrc: string, emails: string) {
    var result = this.invoiceService.sendPDF(pdfSrc, emails);
    result.subscribe( msg => {
        this.toggleLoading(false);
        alert(msg);
    });
  }

  pdfClick()
  {
    this.zoom += (this.zoom_dir * this.zoom_step);
    if(this.zoom >= this.zoom_max
        || this.zoom <= this.zoom_min)
      this.zoom_dir *= -1;
  }
}
