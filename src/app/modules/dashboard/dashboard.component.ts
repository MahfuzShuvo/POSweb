import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ResponseStatus } from 'src/app/common/enums/appEnums';
import { MessageHelper } from 'src/app/common/helper/messageHelper';
import { HeaderService } from 'src/app/common/service/header.service';
import { ResponseMessage } from 'src/app/models/DTO/responseMessage';
import { VMDashboardInitialData } from 'src/app/models/VM/vmDashboardInitialData';
import { DashboardService } from 'src/app/services/dashboard.service';
import { Chart, ChartOptions, ChartType } from 'chart.js/auto';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

	private destroy: Subject<void> = new Subject<void>();
	lstDashboardInitialData: VMDashboardInitialData[] = [];
	objCurrentMonthDashboardData: VMDashboardInitialData = new VMDashboardInitialData();
	public chart: Chart;


	constructor(
		private headerService: HeaderService,
		private activatedRoute: ActivatedRoute,
		private dashboardService: DashboardService,
		private messageHelper: MessageHelper
	) {
		const headerTitle = this.activatedRoute.parent?.snapshot.url[0].path;
		Promise.resolve().then(() => this.headerService.setTitle(headerTitle!.toString()));
	}

	ngOnInit() {
		this.getDashboardInitialData();

	}

	getDashboardInitialData() {
		this.dashboardService.getDashboardInitialData()
			.pipe(takeUntil(this.destroy))
			.subscribe((response: ResponseMessage) => {
				if (response.ResponseCode == ResponseStatus.success) {
					this.lstDashboardInitialData = response.ResponseObj;
					if (this.lstDashboardInitialData.length > 0) {
						var currentMonth = new Date().getMonth() + 1;
						console.log(...this.lstDashboardInitialData.map(x => x.MonthName).join(','));
						this.createChart();
						this.objCurrentMonthDashboardData = JSON.parse(JSON.stringify(this.lstDashboardInitialData.filter(x => x.MonthID == currentMonth)[0]));
					}
				} else {
					this.messageHelper.showMessage(response.ResponseCode, response.Message);
				}
			})
	}

	createChart() {
		this.chart = new Chart('canvas', {
			type: 'bar',
			data: {
				labels: [...this.lstDashboardInitialData.map(x => x.MonthName)],
				datasets: [
					{
						label: 'Sales',
						data: [...this.lstDashboardInitialData.map(x => x.TotalSales)],
						backgroundColor: '#39C5F8',
						borderColor: '#39C5F8',
						borderWidth: 1,
					},
					{
						label: 'Purchase',
						data: [...this.lstDashboardInitialData.map(x => x.TotalPurchases)],
						backgroundColor: '#011f44',
						borderColor: '#011f44',
						borderWidth: 1,
					},
				],
			}
		});
	}

	ngOnDestroy(): void {
		this.destroy.next();
		this.destroy.unsubscribe();
	}
}
