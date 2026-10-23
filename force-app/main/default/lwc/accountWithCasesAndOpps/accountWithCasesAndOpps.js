import { LightningElement, wire} from 'lwc';
import getAccounts from '@salesforce/apex/AccountWithCasesAndOppsController.getAccounts';

const ACCOUNT_COLUMNS = [
    { label: 'Name', fieldName: 'name' },
    { label: 'Industry', fieldName: 'industry', type: 'text' },
];

const RELATED_RECORDS_COLUMNS = [
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
    relatedRecordsColumns = RELATED_RECORDS_COLUMNS;

    @wire(getAccounts)
    getAccountsResult;


    handleRowSelection(event) {
        const selectedRows = event.detail.selectedRows;
        let selectedAccountIds = selectedRows.map(row => row.accountId);
        console.log('selectedAccountIds:', JSON.stringify(selectedAccountIds));
    }

}