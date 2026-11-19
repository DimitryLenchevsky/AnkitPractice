import { LightningElement, wire } from 'lwc';
import getAccounts from '@salesforce/apex/AccountWithOppController.getAccounts'

export default class AccountWithOpps extends LightningElement {

    @wire(getAccounts)
    getAccRecords({ error, data }) {
        if (data) {
            console.log('Data returned: ', JSON.stringify(data));
        } else if (error) {
            console.error('Error occured while fetching the accounts with opportunities: ', error);
        }
    }
}