public without sharing class AccountDetailsController {

    @AuraEnabled(cacheable=true)
    public static List<AccountWrapper> getAccounts() {
        List<AccountWrapper> accWrapper = new List<AccountWrapper>();
        for (Account acc : [SELECT Id, Name, Type, BillingCountry, (SELECT Id FROM Opportunities) FROM Account]) {
            AccountWrapper accWrp = new AccountWrapper();
            accWrp.nameUrl = acc.Name;
            accWrp.accountName = acc.Name;
            accWrp.accountId = acc.Id;
            accWrp.accountType = acc.Type;
            accWrp.accountBillingCountry = acc.BillingCountry;
            accWrp.numberOfOpportunities = acc.Opportunities.size();
            accWrapper.add(accWrp);
        }

        return accWrapper;
    }
    
    public class AccountWrapper {
        
        @AuraEnabled
        public String nameUrl;

        @AuraEnabled
        public String accountName;

        @AuraEnabled
        public String accountId;

        @AuraEnabled
        public String accountType;

        @AuraEnabled
        public String accountBillingCountry;

        @AuraEnabled
        public Integer numberOfOpportunities;
    }
}