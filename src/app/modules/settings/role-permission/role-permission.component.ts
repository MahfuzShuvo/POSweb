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
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HeaderService } from 'src/app/common/service/header.service';
import { RoleService } from 'src/app/services/role.service';
import { RolePermissionMappingService } from 'src/app/services/rolePermissionMapping.service';

@Component({
	selector: 'app-role-permission',
	templateUrl: './role-permission.component.html',
	styleUrls: ['./role-permission.component.css']
})
export class RolePermissionComponent implements OnInit {

	private destroy: Subject<void> = new Subject<void>();
	@ViewChild('roleFormModal', { read: TemplateRef }) roleFormModal: TemplateRef<any>;
	@ViewChild('permissionFormModal', { read: TemplateRef }) permissionFormModal: TemplateRef<any>;
	lstRole: Role[] = [];
	lstPermission: Permission[] = [];
	lstRolePermissionMapping: RolePermissionMapping[] = [];
	objRole: Role = new Role();
	objPermission: Permission = new Permission();
	modalRef?: BsModalRef

	constructor(
		private headerService: HeaderService,
		private roleService: RoleService,
		private permissionService: PermissionService,
		private rolePermissionMappingService: RolePermissionMappingService,
		private messageHelper: MessageHelper,
		private modalService: BsModalService,
		public dateService: DataService
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
					this.lstPermission = JSON.parse(JSON.stringify(response.ResponseObj))
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

	openRoleModal() {
		this.modalRef = this.modalService.show(this.roleFormModal);
	}

	openPermissionModal() {
		this.modalRef = this.modalService.show(this.permissionFormModal);
	}

	closeModal() {
		this.objRole = new Role();
		this.objPermission = new Permission();
		this.modalRef?.hide();
	}

	saveRole() {
		this.dateService.isFormSubmitting.next(true);
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
		this.dateService.isFormSubmitting.next(true);
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

	ngOnDestroy(): void {
		this.destroy.next();
		this.destroy.unsubscribe();
	}
}
