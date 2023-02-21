import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeaderService } from 'src/app/common/service/header.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

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
