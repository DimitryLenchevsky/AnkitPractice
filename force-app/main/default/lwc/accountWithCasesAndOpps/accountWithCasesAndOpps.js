import { LightningElement, wire} from 'lwc';
import getAccounts from '@salesforce/apex/AccountWithCasesAndOppsController.getAccounts';
import getRelatedRecords from '@salesforce/apex/AccountWithCasesAndOppsController.getRelatedRecords';

const ACCOUNT_COLUMNS = [
    { label: 'Name', fieldName: 'name', type: 'url',
        typeAttributes: {
            label: {
                fieldName: 'name'
            },
            target: '_blank'
        }
     },
    { label: 'Industry', fieldName: 'industry', type: 'text' },
];

const RELATED_CASES_COLUMNS = [
    { label: 'Name', fieldName: 'name', type: 'url',
        typeAttributes: {
            label: {
                fieldName: 'name'
            },
            target: '_blank'
        }
     },
    { label: 'Industry', fieldName: 'industry', type: 'text' },
];

const RELATED_OPPORTUNITIES_COLUMNS = [
    { label: 'Name', fieldName: 'name', type: 'url',
        typeAttributes: {
            label: {
                fieldName: 'name'
            },
            target: '_blank'
        }
     },
    { label: 'Industry', fieldName: 'industry', type: 'text' },
];

export default class AccountWithCasesAndOpps extends LightningElement {

    accountColumns = ACCOUNT_COLUMNS;
    relatedCasesColumns = RELATED_CASES_COLUMNS;
    relatedOpportunitiesColumns = RELATED_OPPORTUNITIES_COLUMNS;
    cases = [];
    opportunities = [];

    @wire(getAccounts)
    getAccountsResult;


    handleRowSelection(event) {
        const selectedRows = event.detail.selectedRows;
        let selectedAccountIds = selectedRows.map(row => row.accountId);
        console.log('selectedAccountIds:', JSON.stringify(selectedAccountIds));
        this.getCasesAndOpportunities(selectedAccountIds);
    }

    async getCasesAndOpportunities(selectedAccountIds) {
        const relatedData = await getRelatedRecords({accountIds: selectedAccountIds});
        console.log("JSON STRINGIFY data", JSON.stringify(relatedData));
    }

}