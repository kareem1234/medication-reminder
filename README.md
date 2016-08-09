Medication Reminder Sample App
==============================

This app reminds individuals or their caregivers of upcoming and missed medications.

The calendar control defaults to the current date. All medications for the selected day are displayed and ordered by time.

Beginning 5 minutes prior to medication time, a button will be enabled to mark the medication as completed.

At medication time there will be a chime sound and visual indication of which medication to take along with the dosage.

5 minutes after medication time there will be a louder, more annoying sound and the medication will be marked as missed.

All missed medications will be displayed in a separate area of the screen.

### Technology Stack
* MongodDB
* Node.js
* Mongoose
* Express
* AngularJS
* Bootstrap
* Moment.js

### Getting Started

1. Install NodeJS and NPM
2. Install MongoDB and start the process
3. Clone this repository
4. npm install
5. bower install
6. grunt serve
7. 

#### Implementation details
1. All medications from past dates that were not explicity marked as taken are put into missed medications list
2. Any medication that was missed recently will sound the alarm, i.e if application starts and a medication was missed 5 minutes ago
3. At medication time , the required medication is marked with a purple border
4. medications that are taken are never moved to the missed medications list, and are marked as taken
