trigger OpportunityTrigger on Opportunity (after insert, after update, after delete, after undelete) {

    if (Trigger.isAfter) {
        if (Trigger.isInsert) {
            OpportunityTriggerHelper.afterInsert(Trigger.new);
        }
        if (Trigger.isDelete) {
            OpportunityTriggerHelper.afterDelete(Trigger.old);
        }
        if (Trigger.isUndelete) {
            OpportunityTriggerHelper.afterUndelete(Trigger.new);
        }
        if (Trigger.isUpdate) {
            OpportunityTriggerHelper.afterUpdate(Trigger.new, Trigger.oldMap);
        }
    } else if (Trigger.isAfter) {
        if (Trigger.isInsert) {
            OpportunityTriggerHelper.beforeInsert(Trigger.new);
        }
    }

}