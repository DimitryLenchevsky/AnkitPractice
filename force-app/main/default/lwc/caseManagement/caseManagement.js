import { LightningElement, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import getOpenCases from '@salesforce/apex/CaseManagementController.getOpenCases';
import closeSelectedCases from '@salesforce/apex/CaseManagementController.closeSelectedCases'

const COLUMNS = [
    { label: 'CaseNumber', fieldName: 'CaseNumber', type: 'text' },
    { label: 'Subject', fieldName: 'Subject', type: 'text' },
    { label: 'AccountName', fieldName: 'AccountName', type: 'text' },
    { label: 'ContactName', fieldName: 'ContactName', type: 'text' },
    { label: 'Status', fieldName: 'Status', type: 'text' },
    { label: 'Priority', fieldName: 'Priority', type: 'text' },
    { label: 'CreatedDate', fieldName: 'CreatedDate', type: 'date' },
];

export default class CaseManagement extends LightningElement {

    wiredCasesResult;
    cases = [];
    selectedAccountId = null;
    error = null;
    columns = COLUMNS;
    selectedRows = [];
    titleText = "Success";
    messageText = "Selected Cases are closed";
    variant = "success";

    get isDataAvailable() {
        return this.cases && this.cases.length;
    }

    get disabledButton() {
        return this.selectedRows.length == 0;
    }

    get totalCasesCount() {
        return this.cases.length;
    }

    get totalCasesSelected() {
        return this.selectedRows.length;
    }

    @wire(getOpenCases, { accountId: "$selectedAccountId" })
    getWiredCases(result) {
        this.wiredCasesResult = result;
        console.log('RESULT: ', result);
        if (result.data) {
            this.cases = this.processCaseResult(result.data);
            console.log('CASES: ', this.cases);
            this.error = null;
        } else if (result.error) {
            this.error = result.error;
            this.cases = [];
            console.error(result.error);
        }
    }

    processCaseResult(caseData) {
        const processedResponse = caseData.map(caseRecord => ({
            ...caseRecord,
            AccountName: caseRecord.Account?.Name || 'N/A',
            ContactName: caseRecord.Contact?.Name || 'N/A',
        }));

        return processedResponse;
    }

    handleSearchAccount(event) {
        this.selectedAccountId = event.detail.recordId;
        this.selectedRows = [];
    }

    handleRowSelection(event) {
        this.selectedRows = event.detail.selectedRows;
    }

    async handleSelectedCases() {
        console.log('clicked');
        try {
            const caseIds = this.selectedRows.map(currentRow => currentRow.Id);
            console.log(caseIds);
            await closeSelectedCases({ caseIds: caseIds })
            this.selectedRows = [];
            this.showNotification();
            await refreshApex(this.wiredCasesResult);
        } catch (error) {
            console.error(error);
        }
    }

    showNotification() {
        const evt = new ShowToastEvent({
        title: this.titleText,
        message: this.messageText,
        variant: this.variant,
        });
        this.dispatchEvent(evt);
    }
}