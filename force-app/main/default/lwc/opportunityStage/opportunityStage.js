import { LightningElement, wire } from 'lwc';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';
import getOpportunities from '@salesforce/apex/OpportunityStageController.getOpportunities';
import STAGE_NAME from '@salesforce/schema/Opportunity.StageName';
import OPPORTUNITY_OBJECT from '@salesforce/schema/Opportunity';

export default class OpportunityStage extends LightningElement {

    stageOptions = [];
    selectedStage = '';
    showCloseDate = false;
    sordBy = 'Amount';
    sortDirection = 'DESC';

    columns = [
        { label: 'Name', fieldName: 'Name', type: 'text' },
        { label: 'Amount', fieldName: 'Amount', type: 'currency' },
        { label: 'Stage Name', fieldName: 'StageName', type: 'text' },
        { label: 'Close Date', fieldName: 'CloseDate', type: 'date', typeAttributes: {
            year: 'numeric',
            month: 'short',
        } },
    ];


    @wire(getObjectInfo, {
        objectApiName: OPPORTUNITY_OBJECT
    })
    opportunityObject;

    @wire(getPicklistValues, {
        recordTypeId: '$opportunityObject.data.defaultRecordTypeId',
        fieldApiName: STAGE_NAME,
    })
    stagePicklistValues({ data, error }) {
        if (data) {

            let stageValues = data.values.map(currentItem => ({
                label: currentItem.label, value: currentItem.value
            }));
            this.stageOptions = [
                { label: "All Stages", value: "All" }, 
                ...stageValues
            ];

        } else if (error) {
            console.error('Error while fetching picklist: ', error);
        }
    }

    @wire(getOpportunities, {
        stageName: '$selectedStage',
        sortBy: '$sordBy',
        sortDirection: '$sortDirection',
    })
    opportunities;

    handleStageChange(event) {
        console.log(event.detail.value);
        this.selectedStage = event.detail.value;
    }

    handleCloseDateChange(event) {
        console.log(event.detail.checked);
        this.showCloseDate = event.detail.checked;
    }
}