import { LightningElement, wire } from 'lwc';
import ACCOUNT_NAME from "@salesforce/schema/Account.Name";
import ACCOUNT_TYPE from "@salesforce/schema/Account.Type";
import ACCOUNT_BILLING_ADDRESS from "@salesforce/schema/Account.BillingAddress";
import {
  subscribe,
  unsubscribe,
  APPLICATION_SCOPE,
  MessageContext,
} from "lightning/messageService";
import accountDetails from "@salesforce/messageChannel/accountDetails__c";

export default class SubscribeAccountDetails extends LightningElement {
    subscription = null;
    recordId = '';
    fields = [ACCOUNT_NAME, ACCOUNT_TYPE, ACCOUNT_BILLING_ADDRESS];

    @wire(MessageContext)
    messageContext;

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                accountDetails,
                (message) => this.handleMessage(message),
                { scope: APPLICATION_SCOPE },
            );
        }
    }

    handleMessage(message) {
    this.recordId = message.recordId;
  }

  disconnectedCallback() {
    this.unsubscribeToMessageChannel();
  }

  unsubscribeToMessageChannel() {
    unsubscribe(this.subscription);
    this.subscription = null;
  }
}