# labellab_mobile

A new Flutter project.

## Getting Started

This project is a starting point for a Flutter application.

A few resources to get you started if this is your first Flutter project:

- [Lab: Write your first Flutter app](https://flutter.io/docs/get-started/codelab)
- [Cookbook: Useful Flutter samples](https://flutter.io/docs/cookbook)

For help getting started with Flutter, view our 
[online documentation](https://flutter.io/docs), which offers tutorials, 
samples, guidance on mobile development, and a full API reference.


# **Mobile App Guide**

![enter image description here](https://i.imgur.com/tKvv1Bh.png)

## How to setup the App

 1. Clone the repository.

`$ git clone https://github.com/scorelab/Labellab.git`

 2. Open the project in a terminal and change the directory to `labellab-server`
 ```
 $ cd LabelLab
 $ cd labellab-server
 $ npm install
 ```
 3. Then start the server by 
 
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

## How to use the app

 - After opening the app, you have to log in via Google or Github.
![enter image description here](https://i.imgur.com/EIoYgNV.png)
 - After that, you will be redirected to the Dashboard of the app.
 - from there, you are able to see all existing projects or you can create a new project
 - If you want to find a project, you can use the top search bar,
 
![enter image description here](https://i.imgur.com/HPIaxpO.png)

**How to start a new project**

 - You can start creating a new new project by clicking the `Start a new project` button after swiping the Dashboard to the left.

 - Then you have to enter a suitable name or the project and your project wiill be created ! You can also give a short description about the project also.
 
 - After setting up the project you can add the project members and their respective roles by adding their emails.
 
 **How to  add images**

 - You can add images by selecting Project Images or clicking an image.

 - Also you will be able to choose the images from your app too and submit the images on the app.

**Creating labels**

 - You can make multiple new labels by typing the name of the label.

 - You can also define the label type ( polygon , sphere , rectangle)
 - Then you can upload images and and add labels to them.

**If you want more information**

 - You can refer these videos
  

> [Youtube demo 1](https://www.youtube.com/watch?v=9UG7UEyQans)

> [Youtube demo 2](https://www.youtube.com/watch?v=mwFAYr6hE2E&t=69s)

