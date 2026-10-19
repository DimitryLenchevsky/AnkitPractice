public without sharing class RealTimeCaseController {

    @AuraEnabled(cacheable=true)
    public static List<Case> getNewCases(Integer recordLimit) {

        if (recordLimit == null || recordLimit == 0) {
            recordLimit = 20;
        }

        return [SELECT Id, CaseNumber, Priority, Status, Type FROM Case WHERE IsClosed = false ORDER BY CreatedDate DESC LIMIT :recordLimit];
    }
}