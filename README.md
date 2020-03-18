# cse135-hw5
Queen Tran
A15729093

Github: https://github.com/queentran/cse135-hw5
Firecloud: https://cse135hw5-7d7b0.firebaseapp.com/
https://cse135hw5-7d7b0.web.app/

Firebase Firestore: https://console.firebase.google.com/u/0/project/cse135hw5-7d7b0/overview

In this homework, I have two types of users:
- Anonymous user: any user can access and see the normal pages of the site.
- Owner: logged-in user to access the normal pages of the site, content of Dashboard, Performance Info, Browser Info.

There are two owners of the site:
- trucquynh@gmail.com
- cse135grader@gmail.com

In the Dashboard, I implement the Friendly Chat which allows users to send messages/images to each others.
User can see the previous sent messages/images but they can't send message/image if they don't login.
User is authenticated with Google Sign-In.
Once the message/image is submitted, it is stored in Firestore database.
All the messages/images stored in Firestore database are loaded and displayed on the Dashboard screen.
Once user logged-in, the pages of Performance Info and Browser Info are visible for them to visit.

The reference source for Dashboard: https://codelabs.developers.google.com/codelabs/firebase-web/


