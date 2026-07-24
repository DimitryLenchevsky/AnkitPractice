@RestResource(urlMapping='/mcp/createCase')
global without sharing class McpCreateCase {

    global class ResponseWrapper {
        public String recordNumber;
        public String message;

        public ResponseWrapper(String recordNumber, String message) {
            this.recordNumber = recordNumber;
            this.message = message;
        }
    }

    @HttpPost
    global static ResponseWrapper createCase(String subject, String description, String priority) {
        Case caseRec = new Case(
            Subject = subject,
            Description = description,
            Priority = priority,
            Origin = 'Web'
        );

        insert caseRec;

        Case newCase = [SELECT CaseNumber FROM Case WHERE Id = :caseRec.Id LIMIT 1];

        return new ResponseWrapper(
            newCase.CaseNumber,
            'Case created successfully.'
        );
    }
}