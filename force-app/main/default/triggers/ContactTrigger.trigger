trigger ContactTrigger on Contact (after insert, after update, after delete, after undelete) {

    if (Trigger.isAfter) {
        if (Trigger.isInsert) {
            ContactTriggerHelper.afterInsertCount(Trigger.new);
        } else if (Trigger.isUpdate) {
            ContactTriggerHelper.afterUpdateCount(Trigger.new, Trigger.oldMap);
        } else if (Trigger.isDelete) {
            ContactTriggerHelper.afterDeleteCount(Trigger.old);
        } else if (Trigger.isUndelete) {
            ContactTriggerHelper.afterUndeleteCount(Trigger.new);
        }
    }
}