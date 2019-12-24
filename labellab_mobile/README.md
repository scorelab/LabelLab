label lab
what is label lab?
Label lab is an image labeling tool designed for researchers. It is an open-source project, so basically using Machine learning it helps in labeling the real-world objects.

User Guide

How to Setup
Clone the repository.
git clone https://github.com/scorelab/Labellab.git

Set up react server
Run npm install in labellab-client folder.
 cd labellab-client/
 npm install

How to Use
Use two terminals, one for labellab-server and the other for labellab-client.
Run the Node server in the labellab-server folder:
$ npm start
Run the Nodemon server in the labellab-server folder:
$ npm run dev
NOTE: Before starting the server create a file named .env same as .env.example and add your OAUTH and DATABASE credentials in the file.
start the npm server in labellab-client directory.
npm start
And use localhost:3000 to browse.
NOTE: This version is only supporting for Chrome and Firefox browser. And make sure to instal the extension -> Redux Dev Tools in chrome extension library.

How to Use (Mobile)
Run the Node server in the labellab-server directory (if not already done):
npm start
In a new terminal navigate to labellab_mobile directory.
Configure the lib/config.dart using the format provided in lib/config_example.dart.  Application needs google-services.json issue from firebase to run google sign in option.To obtain the file,
1. Sign in to https://console.firebase.google.com/.
2. Click Add Project and necessary information about the project.
3. Agree to the terms and click Create Project.
4. After creating the project, click Add Firebase to your android app.
5. Go to project location and open android/app/src/main/AndroidManifest.xml.Copy the package name(org.scorelab.labellab_mobile) and paste in the package name field
6. Get the SHA1 fingerprint by following the instruction and paste it in the SHA1 fingerprint field.
7. click next and download the google-services.json.
8. paste the file in location android/app/ folder.
Build flutter the application
flutter build apk
NOTE: Use 'ios' instead of 'apk' to build for iOS
or run the flutter application
flutter run
NOTE: A device with USB debugging enabled or virtual device is required

[  HOW TO CREATE A NEW PROJECT ]

* UPON SIGN IN U WILL BE GUIDED TO A PAGE WHERE THERE WILL BE A  OPTION TO CLICK PHOTO OR UPLOAD THROUGH GALLERY .
* ON SWIPING FROM LEFT TO RIGHT YOU CAN SEE HISTORY/ YOUR PAST CLASSIFICATION. 
* ON SWIPING FROM RIGHT TO LEFT YOU CAN SEE  YOUR PROJECTS 
* TO CREATE A PROJECT  TAP ON THE ADD PROJECT ICON  ON RIGHT BOTTOM 
* ADD PROJECT SCREEN WILL APPEAR ASKING CREDENTIALS i.e PROJECT NAME & DESCRIPTION
* UPON FILLING THE CREDENTIALS CLICK “CREATE “ BUTTON
* PROJECTED WILL BE CREATED AND YOU WILL BE DIRECTED TO “ PROJECTS “ MENU.

[ HOW TO ADD IMAGES TO PROJECT ]

* OPEN YOUR PROJECT FROM PROJECT MENU SCREEN.
* YOU WILL BE SHOWN DETAILS ABOUT YOUR PROJECT.
* CLICK ON IMAGES 
* YOU WILL ASKED TO UPLOAD IMAGE VIA CAMERA OR GALLERY . CHOOSE YOUR PREFERRED OPTION.
* IMAGE WILL BE UPLOADED

[  HOW TO LABEL IMAGES ]

* OPEN YOUR PROJECT FROM PROJECT MENU SCREEN
* YOU WILL BE SHOWN DETAILS ABOUT YOUR PROJECT
* CLICK ON “ +ADD” BUTTON ON THE RIGHT SIDE OF THE LABELS 
* ADD LABEL NAME  THEN SELECT “CREATE” 
* THEN FROM IMAGES SELECT OR UPLOAD AN IMAGE 
* THEN OPEN THE IMAGE AND SELECT  “+” THEN SELECT THE DESIRED LABEL .


[ HOW TO ORGANISE LABEL ]

* ALWAYS TRY TO LABEL ( RECTANGLE) LABEL FOR BIGGER CATEGORY   i.e animals , books , furniture etc.
* LABEL ( POLYGON) LABELS FOR SMALLER CATEGORY  i.e elephant , R.D SHARMA MATHEMATICS , chair etc .
