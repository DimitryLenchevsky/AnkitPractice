@isTest
public without sharing class CaseDatatableControllerTest {

    @TestSetup
    static void setup() {
        Case newCase = new Case();
        newCase.Status = 'New';
        newCase.Subject = 'Test';
        insert newCase;
    }

    @isTest
    static void testGetCases() {
        List<Case> cases = CaseDatatableController.getCases('New', 'Status', 'DESC');
        System.assertEquals(cases.size(), 1, 'Should be one case returned');
    }
}