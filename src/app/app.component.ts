import { Component } from '@angular/core';
import { Title }     from '@angular/platform-browser';
import { setTheme } from 'ngx-bootstrap/utils'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'invoicegen';

  public constructor(private titleService: Title)
  {
    setTheme('bs3'); 
    this.titleService.setTitle('invoicegen')
  }
}
