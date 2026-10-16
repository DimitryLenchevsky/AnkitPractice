public without sharing class AccountTriggerHandler {
    
    public static void afterUpdate(List<Account> newAccount, Map<Id, Account> oldAccountMap) {
        List<Contact> contactsToUpdate = new List<Contact>();
        Map<Id, String> changedAccountIdPhone = new Map<Id, String>();

        for (Account acc : newAccount) {
            if (acc.Phone != oldAccountMap.get(acc.Id).Phone) {
                changedAccountIdPhone.put(acc.Id, acc.Phone);
            }
        }

        if (changedAccountIdPhone.isEmpty()) {
            return;
        }

        for (Contact con : [SELECT Id, Phone, AccountId FROM Contact WHERE AccountId IN :changedAccountIdPhone.keySet()]) {
            String oldPhone = oldAccountMap.get(con.AccountId).Phone;
            if (String.isBlank(con.Phone) || con.Phone == oldPhone) {
                con.Phone = changedAccountIdPhone.get(con.AccountId);
                contactsToUpdate.add(con);
            }
        }

        if (!contactsToUpdate.isEmpty()) {
            update contactsToUpdate;
        }
    }
}