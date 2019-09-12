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

#### How to Use (Mobile)
Run the Node server in the labellab-server directory (if not already done):

`npm start`

In a new terminal navigate to `labellab_mobile` directory.

Configure the `lib/config.dart` using the format provided in `lib/config_example.dart`.

Build flutter the application

`flutter build apk`

> **NOTE**: Use 'ios' instead of 'apk' to build for iOS

or run the flutter application

`flutter run`

> **NOTE**: A device with USB debugging enabled or virtual device is required