public without sharing class CaseTriggerHelper {

    public static void beforeInsert(List<Case> newCases) {
        Set<String> caseEmails = new Set<String>();
        for (Case caseRec : newCases) {
            if (String.isNotBlank(caseRec.SuppliedEmail)) {
                caseEmails.add(caseRec.SuppliedEmail.toLowerCase());
            }
        }

        Map<String, Id> emailToContactMap = new Map<String, Id>();
        for (Contact contact : [SELECT Id, Email FROM Contact WHERE Email IN :caseEmails]) {
            emailToContactMap.put(contact.Email.toLowerCase(), contact.Id);
        }

        for (Case caseRec : newCases) {
            if (String.isNotBlank(caseRec.SuppliedEmail)) {
                String emailLower = caseRec.SuppliedEmail.toLowerCase();
                if (emailToContactMap.containsKey(emailLower)) {
                    caseRec.ContactId = emailToContactMap.get(emailLower);
                }
            }
        }
    }
}