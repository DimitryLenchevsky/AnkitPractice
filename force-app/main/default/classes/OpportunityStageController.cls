public without sharing class OpportunityStageController {
    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOpportunities(String stageName, String sortBy, String sortDirection) {

        String query = 'SELECT Id, Name, StageName, Amount, CloseDate FROM Opportunity';

        if (String.isNotBlank(stageName) && stageName != 'All') {
            query += ' WHERE StageName =: stageName';
        }
        if (String.isBlank(sortBy)) {
            query += ' ORDER BY Amount DESC';
        } else {
            query += ' ORDER BY '+String.escapeSingleQuotes(sortBy)+' '+String.escapeSingleQuotes(sortDirection);
        }

        return Database.query(query);
    }
}