public without sharing class CaseDatatableController {
    @AuraEnabled(cacheable=true)
    public static List<Case> getCases(String caseStatus, String sortBy, String sortDirection) {
        String query = 'SELECT Id, CaseNumber, Status, Priority FROM Case';

        if (String.isNotBlank(caseStatus) && caseStatus != 'All') {
            query += ' WHERE Status =: caseStatus';
        }

        if (String.isNotBlank(sortBy) && String.isNotBlank(sortDirection)) {
            query += ' ORDER BY '+String.escapeSingleQuotes(sortBy)+' '+String.escapeSingleQuotes(sortDirection);
        }

        return Database.query(query);
    }
}