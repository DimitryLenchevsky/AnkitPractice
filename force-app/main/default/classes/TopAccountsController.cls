public without sharing class TopAccountsController {
    
    @AuraEnabled(cacheable=true)
    public static List<Account> getTopAccountWithOpp() {
        List<Account> accList = [SELECT Id, Name, Industry, Phone, AnnualRevenue,
                                    (SELECT Id, Name, Amount, StageName 
                                    FROM Opportunities 
                                    WHERE IsClosed = false 
                                    ORDER BY Amount 
                                    DESC 
                                    LIMIT 5) 
                                 FROM Account 
                                 WHERE AnnualRevenue != null 
                                 ORDER BY AnnualRevenue 
                                 DESC 
                                 LIMIT 10];

        return accList;
    }
}