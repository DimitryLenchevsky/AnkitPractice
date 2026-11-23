import { LightningElement, wire } from 'lwc';
import getAccounts from '@salesforce/apex/AccountDetailsController.getAccounts';
import { publish, MessageContext } from "lightning/messageService";
import accountDetails from "@salesforce/messageChannel/accountDetails__c";

const COLUMNS = [
    { label: 'Account Name', fieldName: 'nameUrl', type: 'url', typeAttributes: {
        label: { fieldName: 'accountName' },
        target: '_blank',
        } 
    },
    { label: 'Type', fieldName: 'accountType', type: 'text' },
    { label: 'Country', fieldName: 'accountBillingCountry', type: 'text' },
    { label: 'Total Opportunities', fieldName: 'numberOfOpportunities', type: 'number', sortable:true },
];

export default class DisplayAccountWithOpp extends LightningElement {
    columns = COLUMNS;

    @wire(getAccounts)
    accounts;

    @wire(MessageContext)
    messageContext;

    handleRowSelection(event) {
        const selectedRows = event.detail.selectedRows;
        const selectedAccountId = selectedRows[0].accountId;

        const payload = { recordId: selectedAccountId };
        publish(this.messageContext, accountDetails, payload);
    }
}