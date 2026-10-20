public without sharing class OpportunityTriggerHelper {
    
    public static void afterInsert(List<Opportunity> newOpportunities) {
        Set<Id> accountIds = new Set<Id>();

        for (Opportunity opp : newOpportunities) {
            if (!String.isBlank(opp.AccountId)) {
                accountIds.add(opp.AccountId);
            }
        }

        updateAccountWithOpportunityName(accountIds);
    }

    public static void afterDelete(List<Opportunity> newOpportunities) {
        afterInsert(newOpportunities);
    }

    public static void afterUndelete(List<Opportunity> oldOpportunities) {
        afterInsert(oldOpportunities);
    }

    public static void afterUpdate(List<Opportunity> newOpportunities, Map<Id, Opportunity> oldOpportunitiesMap) {
        Set<Id> accountIds = new Set<Id>();
        for (Opportunity opp : newOpportunities) {
            String newAccountId = opp.AccountId;
            String oldAccountId = oldOpportunitiesMap.get(opp.Id).AccountId;
            if (newAccountId != oldAccountId) {
                accountIds.add(opp.AccountId);
            }
        }

        updateAccountWithOpportunityName(accountIds);
    }

    public static void updateAccountWithOpportunityName(Set<Id> accountIds) {
        if (!accountIds.isEmpty()) {
            List<Account> accList = [SELECT Id, Name, Maximum_Amount_Opportunity__c,
                (SELECT Id, AccountId, Amount, Name FROM Opportunities ORDER BY Amount NULLS LAST LIMIT 1)
            FROM Account WHERE Id IN :accountIds];

            for (Account acc : accList) {
                List<Opportunity> accOppList = acc.Opportunities;
                if (!accOppList.isEmpty()) {
                    acc.Maximum_Amount_Opportunity__c = accOppList[0].Name;
                } else {
                    acc.Maximum_Amount_Opportunity__c = null;
                }
            }

            update accList;
        }
    }

    public static void beforeInsert(List<Opportunity> opportulityList) {
        Set<Id> accountIds = new Set<Id>();

        for (Opportunity opp : opportulityList) {
            if (opp.AccountId != null) {
                accountIds.add(opp.AccountId);
            }
        }

        Map<Id, Account> accountMap = new Map<Id, Account>([SELECT Id, BillingStreet, BillingCity, BillingState, BillingCountry
        FROM Account WHERE Id IN :accountIds]);

        for (Opportunity opp : opportulityList) {
            if (opp.AccountId != null && accountMap.containsKey(opp.AccountId)) {
                Account acc = accountMap.get(opp.AccountId);
                if (String.isBlank(acc.BillingStreet) && String.isBlank(acc.BillingCity) &&
                 String.isBlank(acc.BillingState) && String.isBlank(acc.BillingCountry)) {
                    opp.addError('The associated Account must have a Billing address populated befre creating an Opportunity.');
                }
            }
        }
    }
}