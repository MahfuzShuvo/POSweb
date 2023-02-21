import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'src/app/common/service/header.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {

  constructor(
    private headerService: HeaderService
  ) { }

  ngOnInit() {
    Promise.resolve().then(() => this.headerService.setSubTitle('Accounts'));
  }

}
