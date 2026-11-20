import { LightningElement, wire } from 'lwc';
import { NavigationMixin } from "lightning/navigation";
import { encodeDefaultFieldValues } from "lightning/pageReferenceUtils";
import getAccounts from '@salesforce/apex/AccountWithOppController.getAccounts';

const ACCOUNT_COLUMNS = [
    { label: 'Account Name', fieldName: 'nameUrl', type: 'url', typeAttributes: {
        label: { fieldName: 'accountName' },
        target: '_blank',
        } 
    },
    { label: 'Type', fieldName: 'type', type: 'text' },
    { label: 'Country', fieldName: 'country', type: 'text' },
    { label: 'Number of Opportunities', fieldName: 'numberOfOpp', type: 'number' },
    {
        type: 'button',
        typeAttributes: {
            label: 'Create Contact',
            name: 'createContact',
            variant: 'brand',
            iconPossiotion: 'right',
        }
    }
];

export default class AccountWithOpps extends NavigationMixin(LightningElement) {
    accountColumns = ACCOUNT_COLUMNS;

    @wire(getAccounts)
    accounts;

    get isRecordsAvailable() {
        return this.accounts.data ? true : false;
    }

    handleRowAction(event) {
        const action = event.detail.action;
        const row = event.detail.row;
        if (action.name === 'createContact') {
            this.createContact(row.accountId);
        }

    }

    createContact(accountId) {
        const defaultValues = encodeDefaultFieldValues({
            AccountId : accountId
        });

        this[NavigationMixin.Navigate]({
        type: "standard__objectPage",
        attributes: {
            objectApiName: "Contact",
            actionName: "new",
        },
        state: {
            defaultFieldValues: defaultValues,
        },
        });
    }
}