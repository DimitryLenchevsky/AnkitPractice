public without sharing class ContactChangeEventTriggerHelper {
    public static void beforeInsert(List<ContactChangeEvent> contactChangeEventList) {
        List<Task> tasksToInsert = new List<Task>();
        for (ContactChangeEvent contactChangeEvent : contactChangeEventList) {
            if (String.isNotBlank(contactChangeEvent.Email)) {
                System.debug('Processing ContactChangeEvent with Email: ' + contactChangeEvent.Email);
                EventBus.ChangeEventHeader header = contactChangeEvent.ChangeEventHeader;

                if (header.changetype == 'CREATE') {
                    System.debug('ContactChangeEvent is a CREATE event.');
                    for (String changedField : header.changedFields) {
                        System.debug('Changed field: ' + changedField);
                        if (changedField == 'Email') {
                            tasksToInsert.add(createTask(
                                contactChangeEvent, 
                                'Contact Email Created', 
                                'The email for contact ' + contactChangeEvent.Id + ' has created with the Email: ' + contactChangeEvent.Email
                            ));

                        }
                    }
                } else if (header.changetype == 'UPDATE') {
                    System.debug('ContactChangeEvent is an UPDATE event.');
                    for (String changedField : header.changedFields) {
                        System.debug('Changed field: ' + changedField);
                        if (changedField == 'Email') {
                            tasksToInsert.add(createTask(
                                contactChangeEvent,
                                'Contact Email Changed',
                                'The email for contact ' + contactChangeEvent.Id + ' has changed to: ' + contactChangeEvent.Email
                            ));
                        }
                    }
                } else if (header.changetype == 'DELETE') {
                    System.debug('ContactChangeEvent is a DELETE event.');

                } else {
                    System.debug('ContactChangeEvent has an unrecognized change type: ' + header.changetype);
                }
            }
        }
        if (!tasksToInsert.isEmpty()) {
            insert tasksToInsert;
        }
    }
    // nice to have a separate method for creating tasks, makes the code cleaner and easier to maintain
    private static Task createTask(ContactChangeEvent contactChangeEvent, String subject, String description) {
        return new Task(
            Subject = subject,
            Description = description,
            WhatId = contactChangeEvent.Id,
            Status = 'Not Started',
            Priority = 'Normal'
        );
    }
}
