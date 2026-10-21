public with sharing class ContactTriggerHelper {

    public static void afterInsertCount(List<Contact> newContactList) {

        List<Account> accountsToUpdate = new List<Account>();
        Set<Id> accountIds = new Set<Id>();

        for (Contact con : newContactList) {
            if (con.AccountId != null) {
                accountIds.add(con.AccountId);
            }
        }

        if (!accountIds.isEmpty()) {
            Map<Id, Account> accountMap = new Map<Id, Account>([SELECT Id, Child_Contacts_Amount__c, (SELECT Id FROM Contacts) FROM Account WHERE Id IN :accountIds]);
            for (Account acc : accountMap.values()) {
                acc.Child_Contacts_Amount__c = accountMap.get(acc.Id).Contacts.size();
                accountsToUpdate.add(acc);
            }
        }

        if (!accountsToUpdate.isEmpty()) {
            update accountsToUpdate;
        }
    }

    public static void afterUpdateCount(List<Contact> newContactList, Map<Id, Contact> oldContactMap) {
        List<Contact> contactList = new List<Contact>();
        for (Contact con : newContactList) {
            if (con.AccountId != oldContactMap.get(con.Id).AccountId) {
                contactList.add(con);
            }
        }
        if (!contactList.isEmpty()) {
            afterInsertCount(contactList);
        }
    }

    public static void afterDeleteCount(List<Contact> oldContactList) {
        afterInsertCount(oldContactList);
    }

    public static void afterUndeleteCount(List<Contact> newContactList) {
        afterInsertCount(newContactList);
    }
}