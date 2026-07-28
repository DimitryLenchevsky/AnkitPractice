import { LightningElement, wire } from 'lwc';
import getCases from '@salesforce/apex/CaseDashboardController.getCases';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import CASE_OBJECT from '@salesforce/schema/Case';
import STATUS_FIELD from '@salesforce/schema/Case.Status';

export default class CaseDashboard extends LightningElement {
    statusOptions = [];
    ownerOptions = [];
    cases = [];
    casesToDisplay = [];
    columns = [
        { label: 'Case Number', fieldName: 'CaseNumber', type: 'text' },
        { label: 'Subject', fieldName: 'Subject', type: 'text' },
        { label: 'Priority', fieldName: 'Priority', type: 'text' },
        { label: 'Status', fieldName: 'Status', type: 'text' },
        { label: 'Owner', fieldName: 'OwnerName', type: 'text' }
    ];

    @wire(getObjectInfo, { objectApiName: CASE_OBJECT })
    objectInfo;

    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: STATUS_FIELD })
    getStatusPicklistValues({ data, error }) {
        if (data) {
            let OptionPicklist = data.values.map(currItem => ({
                label: currItem.label,
                value: currItem.value
            }));

            let allOptions = [{
                label: 'All',
                value: ''
            }];

            this.statusOptions = [...allOptions, ...OptionPicklist];
        } else if (error) {
            console.error('Error appeared on fetching Status Picklist Values: ', error.message);
        }
    }

    get isCases() {
        if (this.casesToDisplay.length) {
            return true;
        }
        return false;
    }

    connectedCallback() {
        this.fetchCases();
    }

    async fetchCases() {
        try {
            const data = await getCases();
            this.cases = data.map((caseRecord) => ({
                Id: caseRecord.CaseNumber,
                CaseNumber: caseRecord.CaseNumber,
                Subject: caseRecord.Subject,
                Status: caseRecord.Status,
                Priority: caseRecord.Priority,
                OwnerId: caseRecord.OwnerId,
                Owner: caseRecord.Owner.Name
            }));
            this.casesToDisplay = [...this.cases];
            this.setOwnerOptions();
        } catch (error) {
            console.error('Error appeared on fetching Cases: ', error.message)
        }
    }

    setOwnerOptions() {
        const owners = this.cases.map(currItem => currItem.OwnerId);
        const uniqueOwners = [...new Set(owners)];

        let ownerOptions = uniqueOwners.map(currItem => {
            let ownerWithCaseRecord = this.cases.find(caseRec => caseRec.OwnerId === currItem);
            let ownerName = ownerWithCaseRecord.Owner;
            return {
                label: ownerName,
                value: currItem
            }
        });
        let allOptions = [{
            label: 'All',
            value: ''
        }];

        this.ownerOptions = [...allOptions, ...ownerOptions];
    }

    handleStatusChange(event) {
        const selectedStatus = event.detail.value;
        this.casesToDisplay = this.cases.filter(caseRecord => selectedStatus === '' || caseRecord.Status === selectedStatus);
    }

    handleOwnerChange(event) {
        const selectedOwner = event.detail.value;
        this.casesToDisplay = this.cases.filter(caseRecord => selectedOwner === '' || caseRecord.OwnerId === selectedOwner);
    }
}