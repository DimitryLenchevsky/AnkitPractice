import { LightningElement, wire, api } from 'lwc';
import { subscribe, unsubscribe, onError, setDebugFlag, isEmpEnabled } from "lightning/empApi";
import getNewCases from '@salesforce/apex/RealTimeCaseController.getNewCases';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from "lightning/platformShowToastEvent";

const COLUMNS = [
    { label: 'CaseNumber', fieldName: 'CaseNumber', type: 'text' },
    { label: 'Priority', fieldName: 'Priority', type: 'text' },
    { label: 'Status', fieldName: 'Status', type: 'text' },
    { label: 'Type', fieldName: 'Type', type: 'text' },
];

export default class RealTimeCase extends LightningElement {

    channelName = "/event/Case_Created_PE__e";

    @api recordLimit = 20;
    wiredCasesResult;
    cases = [];
    error;
    columns = COLUMNS;
    subscription = {};

    // Initializes the component
    connectedCallback() {
        // Register error listener
        this.registerErrorListener();
        this.handleSubscribe();
    }

    disconnectedCallback() {
        this.handleUnsubscribe();
    }

    registerErrorListener() {
        // Invoke onError empApi method
        onError((error) => {
        // Error contains the server-side error
        });
    }

    handleSubscribe() {
        // Callback invoked whenever a new event message is received
        const messageCallback = (response) => {
        console.log("New message received: ", JSON.stringify(response));
        // Response contains the payload of the new message received
        this.handlePlatformEvent(response);
        };

        // Invoke subscribe method of empApi. Pass reference to messageCallback
        subscribe(this.channelName, -1, messageCallback).then((response) => {
        // Response contains the subscription information on subscribe call
        console.log("Subscription request sent to: ", JSON.stringify(response.channel));
        this.subscription = response;
        }).catch(error => {
            console.error('Error while subscribing to platform event: ', JSON.stringify(error));
        });
    }

    handleUnsubscribe() {
        // Invoke unsubscribe method of empApi
        unsubscribe(this.subscription, (response) => {
        console.log("unsubscribe() response: ", JSON.stringify(response));
        // Response is true for successful unsubscribe
        });
    }

    async handlePlatformEvent(response) {
        const payload = JSON.stringify(response);
        console.log("payload!!! ", payload);
        const eventData = response?.data.payload;
        if (eventData) {
            const caseId = eventData?.Case_Id__c;
            console.log('caseId: ', caseId);
            if (caseId) {
                await refreshApex(this.wiredCasesResult);
                this.showNotification();
            }
        }
    }

    @wire(getNewCases, {recordLimit: '$recordLimit'})
    getCases(result) {
        this.wiredCasesResult = result;
        const { data, error } = result;
        if (data) {
            this.cases = data;
        } else if (error) {
            this.error = error;
            console.error('Error occured fetching the data: ', error);
        }
    }

    showNotification() {
    const evt = new ShowToastEvent({
      title: 'Success',
      message: 'new case is created',
      variant: 'success',
    });
    this.dispatchEvent(evt);
  }
}