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
    
#### How to Use


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

#### How to Setup (Mobile)
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

#### How to Use (Mobile)
##### Initial Setup
1. Authenticate using GitHub, Google, or JWT (email).
2. You should now be on a screen with a camera icon shown below:
![image](https://user-images.githubusercontent.com/29003194/72686444-f19ebd00-3ac2-11ea-9f0a-0bd831bee68e.png)

##### Creating a New Project
1. Navigate to the project screen by pressing "Projects":
![image](https://user-images.githubusercontent.com/29003194/72686466-201c9800-3ac3-11ea-9e81-0e5bb318cedb.png)
2. Press the + floating action button:
![image](https://user-images.githubusercontent.com/29003194/72686479-44787480-3ac3-11ea-98cc-4d5a7dab34db.png)
3. Fill out the required form based on the labels of each input element including Project Name and Project Description:
![image](https://user-images.githubusercontent.com/29003194/72686552-0596ee80-3ac4-11ea-9b84-a54a2cf5d38e.png)
4. Press "Create" to finish creating the project.

##### Adding Members
1. View a project
2. Press the triple dot menu icon in the top right corner:
![image](https://user-images.githubusercontent.com/29003194/72686572-3b3bd780-3ac4-11ea-954d-1c955737b6e4.png)
3. Press "Add Member"
4. Type in the member's email
5. Press "Search"
6. Select a search result:
![image](https://user-images.githubusercontent.com/29003194/72686591-5eff1d80-3ac4-11ea-8951-fb4e00bf2b16.png)
7. The member will now be added.
##### Adding Project Images
1. Upon entering the project from the "Projects" screen, you can simply add images by pressing the upload icon in the bottom right:
![image](https://user-images.githubusercontent.com/29003194/72686629-b7ceb600-3ac4-11ea-928a-09f93eed7954.png)
2. A native diologue will then pop up where you can select local images or use the camera. Select an option.
3. Press "Add Image" to add the image.

##### Creating a Label
1. On the project screen, press "Add" next to the "Label" section:
![image](https://user-images.githubusercontent.com/29003194/72686615-8655ea80-3ac4-11ea-9485-77ecaf747a06.png)
2. Through the options, add a label by providing the displayed information including name and label type:
![image](https://user-images.githubusercontent.com/29003194/72686621-953c9d00-3ac4-11ea-9df6-6fb8fd671696.png)
3. Press "Add Label" to finish.

##### Applying a Label
1. Open an image that you have uploaded
2. Press "Add" on the image screen:
![image](https://user-images.githubusercontent.com/29003194/72686643-e77dbe00-3ac4-11ea-9f92-0f5a5aeb7931.png)
3. Select the appropriate label
4. Define the bounds of your label and press done:
![image](https://user-images.githubusercontent.com/29003194/72686654-05e3b980-3ac5-11ea-92ac-dec8d4427ff0.png)


