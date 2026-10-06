import { LightningElement, wire } from 'lwc';
import getTopAccountWithOpp from '@salesforce/apex/TopAccountsController.getTopAccountWithOpp';

export default class TopAccountsController extends LightningElement {
    accounts = [];
    opportunities = [];
    error;
    selectedAccount = {};
    selectedAccountName = '';

    accColumns = [
        { label: 'Account Name', fieldName: 'name', type: 'text' },
        { label: 'Industry', fieldName: 'industry', type: 'text' },
        { label: 'Phone', fieldName: 'phone', type: 'phone' },
        { label: 'Annual Revenue', fieldName: 'annualRevenue', type: 'text' },
    ];

    oppColumns = [
        { label: 'Name', fieldName: 'name', type: 'text' },
        { label: 'Amount', fieldName: 'amount', type: 'text' },
        { label: 'Industry', fieldName: 'industry', type: 'text' },
        { label: 'StageName', fieldName: 'stageName', type: 'text' },
    ];

    @wire(getTopAccountWithOpp)
    wiredAccounts({ data, error }) {
        if (data) {
            this.accounts = data.map(currentItem => {
                return {
                    id: currentItem.Id,
                    name: currentItem.Name,
                    industry: currentItem.Industry || '',
                    phone: currentItem.Phone || '',
                    annualRevenue: currentItem.AnnualRevenue || '',
                    opportunities: currentItem.Opportunities || [],
                }
            });
            this.error = null;
        } else if (error) {
            this.accounts = null;
            this.error = error.body.message;
            console.error(this.error);
        }
    }

    handleRowSelection(event) {
        this.opportunities = [];
        const selectedRows = event.detail.selectedRows;
        const row = selectedRows[0];
        this.selectedAccount = row;
        this.selectedAccountName = row.name;
        const opportunities = row.opportunities || [];
        this.opportunities = opportunities.map(currentItem => {
            return {
                name: currentItem.Name,
                industry: currentItem.Industry || '',
                stageName: currentItem.StageName || '',
                amount: currentItem.Amount || '',
            }
        });
    }

    get hasOpportunities() {
        return this.opportunities.length > 0;
    }
}