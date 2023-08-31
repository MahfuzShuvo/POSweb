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
	chart: Chart;
	monthlySales: number = 0;
	monthlyPurchase: number = 0;
	monthlyRevenue: number = 0;
	monthlyExpense: number = 0;


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
						// console.log(...this.lstDashboardInitialData.map(x => x.MonthName).join(','));
						this.createChart();

						this.monthlySales = this.lstDashboardInitialData!.map(p => p.TotalSales).reduce((a, b) => a + b);
						this.monthlyPurchase = this.lstDashboardInitialData!.map(p => p.TotalPurchases).reduce((a, b) => a + b);
						this.monthlyExpense = this.lstDashboardInitialData!.map(p => p.TotalExpenses).reduce((a, b) => a + b);
					}
				} else {
					this.messageHelper.showMessage(response.ResponseCode, response.Message);
				}
			})
	}

	createChart() {
		this.chart = new Chart('canvas', {
			type: 'line',
			options: {
				responsive: true,
				plugins: {
					legend: {
						labels: {
							usePointStyle: true,
							padding: 30,
						},
					}
				}
			},
			data: {
				labels: [...this.lstDashboardInitialData.map(x => x.DayNumber)],
				datasets: [
					{
						label: 'Sales',
						data: [...this.lstDashboardInitialData.map(x => x.TotalSales)],
						backgroundColor: '#67be4e',
						borderColor: '#67be4e',
						borderWidth: 1,
					},
					{
						label: 'Purchase',
						data: [...this.lstDashboardInitialData.map(x => x.TotalPurchases)],
						backgroundColor: '#ffc825',
						borderColor: '#ffc825',
						borderWidth: 1,
					},
					{
						label: 'Expense',
						data: [...this.lstDashboardInitialData.map(x => x.TotalExpenses)],
						backgroundColor: '#fc2947',
						borderColor: '#fc2947',
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
