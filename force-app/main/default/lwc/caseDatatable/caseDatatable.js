import { LightningElement, wire } from 'lwc';
import getCases from '@salesforce/apex/CaseDatatableController.getCases';
import { getObjectInfo, getPicklistValues } from "lightning/uiObjectInfoApi";
import CASE_OBJECT from '@salesforce/schema/Case';
import STATUS_FIELD from '@salesforce/schema/Case.Status';

const COLUMNS = [
    { label: 'Id', fieldName: 'Id', type: 'text' },
    { label: 'Case Number', fieldName: 'CaseNumber', type: 'text', sortable: true },
    { label: 'Status', fieldName: 'Status', type: 'text', sortable: true, sortDirection: 'desc' },
    { label: 'Priority', fieldName: 'Priority', type: 'text', sortable: true },
];

export default class CaseDatatable extends LightningElement {
    caseStatusValues = [];
    selectedCaseStatus = 'All';
    sortBy = 'Status';
    sortDirection = 'desc';
    showPriorityField = false;
    columns = COLUMNS.slice(0,3);

    @wire(getObjectInfo, { objectApiName: CASE_OBJECT })
    caseObjectinfo;

    @wire(getPicklistValues, { recordTypeId: "$caseObjectinfo.data.defaultRecordTypeId", fieldApiName: STATUS_FIELD })
    getStatusPickListValues({ data, error }) {
        if (data) {
            let items = data.values.map(currentItem => ({
                label: currentItem.label, value: currentItem.value,
            }));
            this.caseStatusValues = [
                { label: 'All Statuses', value: 'All', },
                ...items
            ];
        } else if (error) {
            console.error(error);
        }
    }

    @wire(getCases, {
        caseStatus: '$selectedCaseStatus',
        sortBy: '$sortBy',
        sortDirection: '$sortDirection',
    })
    cases;

    handleCaseStatusChange(event) {
        this.selectedCaseStatus = event.detail.value;
    }

    handlePriorityFieldChange(event) {
        this.showPriorityField = event.detail.checked;
        this.showPriorityField ? this.columns = COLUMNS : this.columns = COLUMNS.slice(0,3);
    }

    handleSort(event) {
        this.sortBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
    }
}