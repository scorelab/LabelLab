# LabelLab

## User Guide

#### How to Setup

Clone the repository.

`git clone https://github.com/scorelab/Labellab.git`

#### Set up react server

Run npm install in labellab-client folder.

```
 cd labellab-client/
 npm install
 ```
    
#### Setup Process


Use two terminals, one for labellab-server and the other for labellab-client.

Run the Node server in the labellab-server folder:
    
`$ npm start`

Run the Nodemon server in the labellab-server folder:

`$ npm run dev`

> **NOTE**: Before starting the server create a file named `.env` same as `.env.example` and add your **OAUTH** and **DATABASE** credentials in the file.

start the npm server in labellab-client directory.

`npm start`

And use [localhost:3000](https://) to browse.


> **NOTE**: This version is only supporting for Chrome and Firefox browser. And make sure to instal the extension -> Redux Dev Tools in chrome extension library.

#### How to Use (Mobile)
Run the Node server in the labellab-server directory (if not already done):

`npm start`

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

Build flutter the application

`flutter build apk`

> **NOTE**: Use 'ios' instead of 'apk' to build for iOS

or run the flutter application

`flutter run`

> **NOTE**: A device with USB debugging enabled or virtual device is required


# Using the Web App
After setting up the project using the above requisite steps, you can now start using the project.

### Initial Setup
Visit the address that has been provided to you after running `npm start` in the client directory.

### Creating a project
Sign up for an account and log in. Upon a successful login, you will be taken to a dashboard. In this dashboard, click "Create a New Project" to create a project.
![chrome_p17eb1aa5f](https://user-images.githubusercontent.com/29003194/72292484-79964a00-361f-11ea-81be-dc517e5bda04.png)
After clicking this button, you will be prompted to enter a project name:
![chrome_D5m1qmwmSC](https://user-images.githubusercontent.com/29003194/72292510-887cfc80-361f-11ea-86a6-28596a82a506.png)
Enter any name and press "Submit".
After doing this, you have successfully created a project and can now start working!

## Adding Images
Adding images is quite simple. After you have created a project, open the project and view the "Project Images" tab. Within this tab, you can click the "Add Image" button:
![chrome_VxpZND4O1D](https://user-images.githubusercontent.com/29003194/72292608-b82c0480-361f-11ea-9961-e4b4054c7986.png)
You will then be presented with your operating system's file browser to which you can select a file to be uploaded.
After this, you can give your file a name. When you are done, press the "Submit" button:
![chrome_nMHAQ7aHd9](https://user-images.githubusercontent.com/29003194/72292661-d560d300-361f-11ea-9d08-4616665bb8ec.png)
Your file should now appear in the table:
![chrome_eI2N0N7HTV](https://user-images.githubusercontent.com/29003194/72292706-ead5fd00-361f-11ea-9ef6-a9377fb5e737.png)

## Adding Labels
Adding labels can be done in the "Project Labels" tab. Upon visiting this tab, you can add a label by clicking "Create a new Label":
![chrome_8dwRubFir5](https://user-images.githubusercontent.com/29003194/72292785-1e188c00-3620-11ea-937c-df24b4b07db1.png)
You will then be prompted with a form allowing you to enter a label name and type. Click "Create" when you are done:
![chrome_aF6PwRYE1u](https://user-images.githubusercontent.com/29003194/72292856-41433b80-3620-11ea-90f2-77447b012bcb.png)
After this, you should see your label appear in the table:
![chrome_PcXmWOpows](https://user-images.githubusercontent.com/29003194/72292927-5e780a00-3620-11ea-8076-5d0301f802e3.png)



