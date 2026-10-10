import { LightningElement, wire } from 'lwc';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';
import getOpportunities from '@salesforce/apex/OpportunityStageController.getOpportunities';
import STAGE_NAME from '@salesforce/schema/Opportunity.StageName';
import OPPORTUNITY_OBJECT from '@salesforce/schema/Opportunity';

const COLUMNS = [
    { label: 'Name', fieldName: 'Name', type: 'text', sortable: true },
    { label: 'Amount', fieldName: 'Amount', type: 'currency', sortable: true, sortDirection: 'desc' },
    { label: 'Stage Name', fieldName: 'StageName', type: 'text', sortable: true },
    {
        label: 'Close Date', fieldName: 'CloseDate', type: 'date', sortable: true, typeAttributes: {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
        }
    },
];

export default class OpportunityStage extends LightningElement {

    stageOptions = [];
    selectedStage = '';
    showCloseDate = false;
    sordBy = 'Amount';
    sortDirection = 'DESC';
    columns = COLUMNS.slice(0, 3);



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
        this.selectedStage = event.detail.value;
    }

    handleCloseDateChange(event) {
        this.showCloseDate = event.detail.checked;
        this.showCloseDate ? this.columns = COLUMNS : this.columns = COLUMNS.slice(0, 3);
    }

    handleSort(event) {
        this.sortBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
    }
}