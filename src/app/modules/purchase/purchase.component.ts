import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeaderService } from 'src/app/common/service/header.service';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent implements OnInit {

  constructor(
    private headerService: HeaderService,
    private activatedRoute: ActivatedRoute
  ) {
    const headerTitle = this.activatedRoute.parent?.snapshot.url[0].path;
    Promise.resolve().then(() => this.headerService.setTitle(headerTitle!.toString()));
  }

  ngOnInit() {
  }

}
