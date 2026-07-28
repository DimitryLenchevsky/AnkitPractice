public with sharing class CaseDashboardController {

    @AuraEnabled(cacheable=true)
    public static List<Case> getCases(){
        try {
            Set<Id> subordinateIds = new Set<Id>();
            User userRec = [SELECT Id, ManagerId FROM User WHERE Id = :UserInfo.getUserId() LIMIT 1];

            for (User subordinate : [SELECT Id FROM User WHERE ManagerId = :userRec.ManagerId]) {
                subordinateIds.add(subordinate.Id);
            }

            List<Case> cases = [
                SELECT
                    Id, 
                    CaseNumber, 
                    Subject,
                    Status, 
                    Priority, 
                    OwnerId, 
                    Owner.Name
                FROM Case
                WHERE OwnerId IN :subordinateIds
                LIMIT 200
            ];

            return cases;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}