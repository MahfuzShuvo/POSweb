import { RolePermissionMapping } from './../../../models/rolePermissionMapping';
import { PermissionService } from './../../../services/permission.service';
import { Permission } from './../../../models/permission';
import { DataService } from './../../../common/service/data.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MessageHelper } from './../../../common/helper/messageHelper';
import { Role } from './../../../models/role';
import { ResponseStatus } from './../../../common/enums/appEnums';
import { ResponseMessage } from './../../../models/DTO/responseMessage';
import { takeUntil, Subject } from 'rxjs';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HeaderService } from 'src/app/common/service/header.service';
import { RoleService } from 'src/app/services/role.service';
import { RolePermissionMappingService } from 'src/app/services/rolePermissionMapping.service';
import { IconService } from 'src/app/services/icon.service';

@Component({
	selector: 'app-role-permission',
	templateUrl: './role-permission.component.html',
	styleUrls: ['./role-permission.component.css']
})
export class RolePermissionComponent implements OnInit {

	private destroy: Subject<void> = new Subject<void>();
	@ViewChild('roleFormModal', { read: TemplateRef }) roleFormModal: TemplateRef<any>;
	@ViewChild('permissionFormModal', { read: TemplateRef }) permissionFormModal: TemplateRef<any>;
	@ViewChild('searchIconText') searchIconText: ElementRef;
	lstRole: Role[] = [];
	lstPermission: Permission[] = [];
	lstTempPermission: Permission[] = [];
	lstRolePermissionMapping: RolePermissionMapping[] = [];
	objRole: Role = new Role();
	objPermission: Permission = new Permission();
	modalRef?: BsModalRef;
	lstIcon: string[] = [];
	lstAllIcon: string[] = [];
	isEnabledDragDrop: boolean = false;
	isSequencePermission: boolean = false;

	constructor(
		private headerService: HeaderService,
		private roleService: RoleService,
		private permissionService: PermissionService,
		private rolePermissionMappingService: RolePermissionMappingService,
		private messageHelper: MessageHelper,
		private modalService: BsModalService,
		private iconService: IconService,
		public dataService: DataService
	) { }

	ngOnInit() {
		Promise.resolve().then(() => this.headerService.setSubTitle('Role & Permission'));
		this.getAllRole();
		this.getAllPermission();
		this.getAllAccess();
	}

	getAllAccess() {
		this.rolePermissionMappingService.getAllRolePermissionMapping()
			.pipe(takeUntil(this.destroy))
			.subscribe((response: ResponseMessage) => {
				if (response.ResponseCode == ResponseStatus.success) {
					this.lstRolePermissionMapping = JSON.parse(JSON.stringify(response.ResponseObj))
				} else {
					this.messageHelper.showMessage(response.ResponseCode, response.Message);
				}
			})
	}

	haveAccess(permissionID: number, roleID: number) {
		if (roleID == 1) {
			return true;
		}
		return this.lstRolePermissionMapping?.find(x => x.PermissionID == permissionID && x.RoleID == roleID);
	}

	changeAccess(event: any, permissionID: number, roleID: number) {
		var objRolePermissionMapping = new RolePermissionMapping();
		objRolePermissionMapping.PermissionID = permissionID;
		objRolePermissionMapping.RoleID = roleID;
		objRolePermissionMapping.isChecked = event.target.checked;

		this.rolePermissionMappingService.saveRolePermissionMapping(objRolePermissionMapping)
			.pipe(takeUntil(this.destroy))
			.subscribe((response: ResponseMessage) => {
				if (response.ResponseCode == ResponseStatus.success) {
					var index = this.lstRolePermissionMapping?.findIndex(x => x.RolePermissionMappingID == response.ResponseObj.RolePermissionMappingID);
					if (index > -1) {
						this.lstRolePermissionMapping?.splice(index, 1, response.ResponseObj);
					} else {
						this.lstRolePermissionMapping?.push(response.ResponseObj);
					}
				}
				this.messageHelper.showMessage(response.ResponseCode, response.Message);
			})
	}

	getAllPermission() {
		this.permissionService.getAllPermission()
			.pipe(takeUntil(this.destroy))
			.subscribe((response: ResponseMessage) => {
				if (response.ResponseCode == ResponseStatus.success) {
					this.lstPermission = JSON.parse(JSON.stringify(response.ResponseObj));
					this.lstTempPermission = JSON.parse(JSON.stringify(response.ResponseObj));
				} else {
					this.messageHelper.showMessage(response.ResponseCode, response.Message);
				}
			})
	}

	getAllRole() {
		this.roleService.getAllRole()
			.pipe(takeUntil(this.destroy))
			.subscribe((response: ResponseMessage) => {
				if (response.ResponseCode == ResponseStatus.success) {
					this.lstRole = JSON.parse(JSON.stringify(response.ResponseObj))
				} else {
					this.messageHelper.showMessage(response.ResponseCode, response.Message);
				}
			})
	}

	editRole(role: Role) {
		this.objRole = JSON.parse(JSON.stringify(role));
		this.openRoleModal();
	}

	editPermission(permission: Permission) {
		this.objPermission = JSON.parse(JSON.stringify(permission));
		this.openPermissionModal();
	}

	openRoleModal() {
		this.modalRef = this.modalService.show(this.roleFormModal);
	}

	openPermissionModal() {
		this.iconService.getMaterialIcons().subscribe(response => {
			this.lstIcon = response.split('\n').map(line => line.split(' ')[0]);
			this.lstAllIcon = response.split('\n').map(line => line.split(' ')[0])
		});
		this.modalRef = this.modalService.show(this.permissionFormModal);
	}

	searchIcon(event: any) {
		var timer;
		clearTimeout(timer);
		timer = setTimeout(() => {
			var str = event.target.value;
			if (str != '') {
				this.lstIcon = this.lstAllIcon.filter(x => x.toLowerCase().includes(str.toLowerCase()));
			} else {
				this.lstIcon = JSON.parse(JSON.stringify(this.lstAllIcon));
			}

		}, 500);
	}

	closeModal() {
		this.objRole = new Role();
		this.objPermission = new Permission();
		this.searchIconText?.nativeElement?.value('');
		this.modalRef?.hide();
	}

	saveRole() {
		this.dataService.isFormSubmitting.next(true);
		this.roleService.saveRole(this.objRole)
			.pipe(takeUntil(this.destroy))
			.subscribe((response: ResponseMessage) => {
				if (response.ResponseCode == ResponseStatus.success) {
					var index = this.lstRole?.findIndex(x => x.RoleID == response.ResponseObj.RoleID);
					if (index > -1) {
						this.lstRole?.splice(index, 1, response.ResponseObj);
					} else {
						this.lstRole?.push(response.ResponseObj);
					}
					this.closeModal();
				}
				this.messageHelper.showMessage(response.ResponseCode, response.Message);
			})
	}

	toSlugify(DisplayName: string) {
		var value = '';
		value = DisplayName.toLowerCase();
		if (/\s/g.test(DisplayName)) {
			value = value.replace(/\s+/g, '-');
		}

		this.objPermission.PermissionName = value.toLowerCase();
	}

	savePermission() {
		this.dataService.isFormSubmitting.next(true);
		this.permissionService.savePermission(this.objPermission)
			.pipe(takeUntil(this.destroy))
			.subscribe((response: ResponseMessage) => {
				if (response.ResponseCode == ResponseStatus.success) {
					var index = this.lstPermission?.findIndex(x => x.PermissionID == response.ResponseObj.PermissionID);
					if (index > -1) {
						this.lstPermission?.splice(index, 1, response.ResponseObj);
					} else {
						this.lstPermission?.push(response.ResponseObj);
					}
					this.closeModal();
				}
				this.messageHelper.showMessage(response.ResponseCode, response.Message);
			})
	}

	enableDragDrop() {
		this.isEnabledDragDrop = !this.isEnabledDragDrop;
	}

	onItemDrop(event: any) {
		// var targetData = event.nativeEvent.target.textContent;
		var dragData = event.dragData;
		// var targetData = event.nativeEvent.currentTarget.textContent;
		// var targetData = event.nativeEvent.target.textContent;
		var targetData = event.nativeEvent.target.innerText;
		targetData = targetData?.split('\n')[1];

		if (targetData) {

			var targetPermission = this.lstPermission.filter(x => x.DisplayName === targetData)[0];
			var targetIndex = this.lstPermission.indexOf(targetPermission);
			// debugger
			var index = this.lstPermission.indexOf(dragData);
			if (index > -1) {
				this.lstPermission.splice(index, 1);
			}
			if (targetIndex != index) {
				this.isSequencePermission = true;
			} else {
				this.isSequencePermission = false;
				this.lstPermission = JSON.parse(JSON.stringify(this.lstTempPermission));
				return;
			}

			let bind = new Promise<void>((resolve, reject) => {

				this.lstPermission.forEach(x => {

					if ((x.Sequence > dragData.Sequence && x.Sequence <= targetPermission.Sequence) && targetIndex > index) {
						x.Sequence = x.Sequence - 1;
					}
					if ((x.Sequence <= dragData.Sequence && x.Sequence >= targetPermission.Sequence) && targetIndex < index) {
						x.Sequence = x.Sequence + 1;
					}
				});

				resolve();
			});

			bind.then(() => {
				if (targetIndex > index) {
					dragData.Sequence = targetPermission.Sequence + 1;
				}
				if (targetIndex < index) {
					dragData.Sequence = targetPermission.Sequence - 1;
				}
				this.lstPermission.push(dragData);

				this.lstPermission.sort((a, b) => a.Sequence - b.Sequence);
			});
		}

	}

	cancelSequence() {
		this.isSequencePermission = false;
		this.lstPermission = JSON.parse(JSON.stringify(this.lstTempPermission));

		// this.actionPermissionChecked()
	}

	saveSequence() {
		this.dataService.isFormSubmitting.next(true);
		this.permissionService.sequencePermissions(this.lstPermission)
			.pipe(takeUntil(this.destroy))
			.subscribe(response => {
				if (response.ResponseCode == ResponseStatus.success) {
					this.lstPermission = response.ResponseObj;
					// this.actionPermissionChecked();
					this.lstTempPermission = JSON.parse(JSON.stringify(this.lstPermission));
				}
				this.isSequencePermission = false;
				this.messageHelper.showMessage(response.ResponseCode, response.Message);
			})
	}

	ngOnDestroy(): void {
		this.destroy.next();
		this.destroy.unsubscribe();
	}
}
