public with sharing class AccountWithCasesAndOppsController {
    
    @AuraEnabled(cacheable=true)
    public static List<AccountWrapper> getAccounts(String AccountName) {
        List<AccountWrapper> accountWrapperList = new List<AccountWrapper>();
        for (Account acc : [SELECT Id, Name, Industry FROM Account LIMIT 10]) {
            AccountWrapper accWrap = new AccountWrapper();
            accWrap.name = acc.Name;
            accWrap.industry = acc.Industry;
            accWrap.accountId = acc.Id;
            accWrap.nameUrl = '/'+acc.Id;

            accountWrapperList.add(accWrap);
        }

        return accountWrapperList;
    }

    @AuraEnabled(cacheable=true)
    public static List<RelatedWrapper> getRelatedRecords(List<String> accountIds) {
        List<RelatedWrapper> accountWraperList = new List<RelatedWrapper>();
        for (Account acc : [SELECT Id, 
                (SELECT Id, CaseNumber, Priority, Account.Name FROM Cases),
                (SELECT Id, Name, StageName FROM Opportunities) 
                FROM Account WHERE Id IN :accountIds]) {

            RelatedWrapper relatedWrap = new RelatedWrapper();
            relatedWrap.accountId = acc.Id;
            relatedWrap.caseList = acc.Cases;
            relatedWrap.opportunityList = acc.Opportunities;
            accountWraperList.add(relatedWrap);
        }

        return accountWraperList;
    }

    public class AccountWrapper {
        @AuraEnabled
        public String name;

        @AuraEnabled
        public String industry;

        @AuraEnabled
        public String accountId;

        @AuraEnabled
        public String nameUrl;
    }

    public class RelatedWrapper {
        @AuraEnabled
        public String accountId;

        @AuraEnabled
        public List<Case> caseList;

        @AuraEnabled
        public List<Opportunity> opportunityList;
    }
}