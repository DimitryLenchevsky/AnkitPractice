public class AccountWithOppController {
    
    @AuraEnabled(cacheable=true)
    public static List<OutPutWrapper> getAccounts() {

        List<OutPutWrapper> outputWrpList = new List<OutPutWrapper>();
        for (Account acc : [SELECT Id, Name, Type, BillingCountry, (SELECT Id FROM Opportunities) FROM Account WHERE OwnerId = :UserInfo.getUserId()]) {
            OutPutWrapper outPutWrp = new OutPutWrapper();
            outPutWrp.accountId = acc.Id;
            outPutWrp.accountName = acc.Name;
            outPutWrp.type = acc.Type;
            outPutWrp.country = acc.BillingCountry;
            outPutWrp.numberOfOpp = acc.Opportunities.size();
            outPutWrp.nameUrl = '/' + acc.Id;
            outputWrpList.add(outPutWrp);
        }

        return outputWrpList;
    }

    public class OutPutWrapper {

        @AuraEnabled
        public String nameUrl;

        @AuraEnabled
        public String type;

        @AuraEnabled
        public String country;

        @AuraEnabled
        public Integer numberOfOpp;

        @AuraEnabled
        public String accountId;

        @AuraEnabled
        public String accountName;
    }
}