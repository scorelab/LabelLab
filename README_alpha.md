
# LabelLab

## What is the aim of Lablellab?
  
  
_Label lab is an image labeling tool designed for researchers. It is an open-source project, so basically using Machine learning it helps in labeling the real-world objects._
## Technical Requirements

This appication is avialiable across all platforms.

## How to Setup

- Clone the repository.
`git clone https://github.com/scorelab/Labellab.git`
- Set up react server
Run npm install in labellab-client folder.
```
 cd labellab-client/
 npm install
 ```
 ## How to Use (website)

- Use two terminals, one for labellab-server and the other for labellab-client.
Run the Node server in the labellab-server folder: 
  `$ npm start`
- Run the Nodemon server in the labellab-server folder:
`$ npm run dev`
> **NOTE**: Before starting the server create a file named `.env` same as `.env.example` and add your **OAUTH** and **DATABASE** credentials in the file.
start the npm server in labellab-client directory.
`npm start`
And use [localhost:3000](https://) to browse.
This version is only supporting for Chrome and Firefox browser. And make sure to instal the extension -> Redux Dev Tools in chrome extension library.

## How to Use (Mobile)
- Run the Node server in the labellab-server directory (if not already done):
`npm start`
   1. In a new terminal navigate to `labellab_mobile` directory.
   2. Configure the `lib/config.dart` using the format provided in `lib/config_example.dart`.

 - **Application needs `google-services.json` issue from firebase to run google sign in option.To obtain the file:**
     1. Sign in to https://console.firebase.google.com/.
     2. Click **Add Project** and necessary information about the project.
     3. Agree to the terms and click **Create Project**.
     4. After creating the project, click **Add Firebase to your android app**.
     5. Go to project location and open `android/app/src/main/AndroidManifest.xml`.Copy the package              name(**org.scorelab.labellab_mobile**) and paste in the package name field
      6. Get the **SHA1 fingerprint** by following the instruction and paste it in the SHA1 fingerprint field.
      7. click next and download the `google-services.json`.
      8. paste the file in location `android/app/` folder.
- Build flutter the application`flutter build apk`
> **NOTE**: Use 'ios' instead of 'apk' to build for iOS or run the flutter application
`flutter run`A device with USB debugging enabled or virtual device is required
for iOS or run the flutter application flutter run . A device with USB debugging enabled or virtual device is required



## HOW TO CREATE A NEW PROJECT 

- Upon sign in u will be guided to a page where there will be a option to click photo or upload through gallery .
- On swiping from left to right you can see history OR  your past classification.
- On swiping from right to left you can see your projects
- To create a project tap on the add project icon on right bottom
  add project screen will appear asking credentials i.e project name & description
- Upon filling the credentials click “create “ button
- Project will be created and you will be directed to “ projects “ menu.

## HOW TO ADD IMAGES TO PROJECT 

- Open your project from project menu screen.
- You will be shown details about your project.
  click on images
- You will asked to upload image via camera or gallery . choose your preferred option.
- Image will be uploaded.

##  HOW TO LABEL IMAGES 

- Open your project from project menu screen.
- You will be shown details about your project
- Click on “ +add” button on the right side of the labels
- Add label name then select “create”
- Then from images select or upload an image
- Then open the image and select “+” then select the desired label .

##  HOW TO ORGANISE LABEL 

- Always try to label ( rectangle) label for bigger category i.e animals , books , furniture etc.
label ( polygon) labels for smaller category i.e elephant , r.d sharma mathematics , chair etc .
