trigger CaseTrigger on Case (before insert) {
    if (Trigger.isBefore && Trigger.isInsert) {
        CaseTriggerHelper.beforeInsert(Trigger.new);
    }
}