## Setting up the project

After cloning the directory and changing the directory to the project in terminal, run:

1. `cd labellab-server`

After running `npm install` 

2. Run the Node server in the labellab-server folder:
    
`$ npm start`

> **NOTE**: Before starting the server create a file named `.env` same as `.env.example` and add your **OAUTH** and **DATABASE** credentials in the file.

In a new terminal navigate to `labellab_mobile` directory.

Configure the `lib/config.dart` using the format provided in `lib/config_example.dart`.
<br><br>
Application needs `google-services.json` issue from firebase to run google sign in option.To obtain the file,

1. Sign in to https://console.firebase.google.com/.
2. Click **Add Project** and necessary information about the project.
3. Agree to the terms and click **Create Project**.
4. After creating the project, click **Add Firebase to your android app**.
5. Go to project location and open `android/app/src/main/AndroidManifest.xml`.Copy the package name(**org.scorelab.labellab_mobile**) and paste in the package name field
6. Get the **SHA1 fingerprint** by following the instruction and paste it in the SHA1 fingerprint field.
7. click next and download the `google-services.json`.
8. paste the file in location `android/app/` folder.
For building the application run:

`flutter build apk`

> **NOTE**: Use 'ios' instead of 'apk' to build for iOS

or run the flutter application

`flutter run`

> **NOTE**: A device with USB debugging enabled or virtual device is required

## Using LabelLab app - 

Step 1: Login via google/GitHub or via filling out the information

Step 2:  You will be on the dashboard and will be able to view all of your old projects or even build a new one.

You can even search for the projects in the upper search bar

## Starting a New Project-

1. You can create a new project by clicking start a new project button in the dashboard where you will have to fill out the name of the project and then the app will prepare some files making the project for you.

2. After setting up the project you can add the project members and their respective roles by adding their emails.

## Adding Images

1. By selecting Project Images in the left bar you will be able to add images. 

2. You will be able to choose the images from your system and submit the images on the app.

## Creating a New Label

You can make multiple new labels by typing the name of the label. Furthermore, selecting the label type for eg a polygon sphere, etc.

### If you want to look at an old project

After clicking at a certain project. You will be able to look at the members of that and the role of the member. You can choose among Members/Images/Analytics/Labels in the left bar. 

## Demo Video

Here is a Demo Video of our finalised mobile app to see how to use it
https://www.youtube.com/watch?v=9UG7UEyQans






