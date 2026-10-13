public without sharing class CaseManagementController {
    
    @AuraEnabled(cacheable=true)
    public static List<Case> getOpenCases(String accountId) {

        String query = 'SELECT Id, CaseNumber, AccountId, Account.Name, Subject, ContactId, ' +
        'Contact.Name, Status, Priority, IsClosed, CreatedDate FROM Case ' +
        'WHERE IsClosed = false';

        if (String.isNotEmpty(accountId)) {
            query += ' AND AccountId =: accountId ';
        }

        query += ' ORDER BY CreatedDate DESC LIMIT 50';

        return Database.query(query);
    }

    @AuraEnabled
    public static void closeSelectedCases(List<Id> caseIds) {
        try {
            List<Case> caseList = [SELECT Id, Status FROM Case WHERE Id IN : caseIds];

            for (Case caseRec : caseList) {
                caseRec.Status = 'Closed';
            }

            update caseList;
        } catch(Exception e) {
            throw new AuraHandledException('Something went wrong: ' + e.getMessage());
        }

    }
}