# LabelLab

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![License](https://img.shields.io/badge/API-16%2B-green.svg)](https://android-arsenal.com/api?level=16)

LabelLab is an image analyzing and classification platform. It allows users to upload batches of images and classify them with labels. It also has the features to run classifications against a trained model. LabelLab also has a user project management component as well as an image analyzing component.

#### Apache 2.0 Licence

See the [LICENSE](https://github.com/scorelab/LabelLab/blob/master/LICENSE) file for details.

#### Deployment

Host your own Labellab server for **FREE** with One-Click Deploy

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

## User Guide

#### How to Setup

Clone the repository.

`git clone https://github.com/scorelab/Labellab.git`

#### Set up React server

Run `npm install` in `labellab-client` folder.

```
 cd labellab-client/
 npm install
```

#### Set up MongoDB backend

Run `npm install` in `labellab-server` folder.

```
 cd labellab-server/
 npm install
```

#### How to Use

First you need to create a `.env` file in both `labellab-server` folder and `labellab-client` folder following the template provided in the file `.env.example` which is present in both the folders.<br/> <br/>

For client-side `.env` file:

```
REACT_APP_HOST=localhost
REACT_APP_SERVER_ENVIRONMENT=dev
REACT_APP_SERVER_PORT=4000
```

For server-side `.env` file:

```
HOST=localhost
PORT=4000
```

`JWT_SECRET` can be any word your choice.

To create a free MongoDB Atlas cloud database, follow the guide at [https://docs.atlas.mongodb.com/getting-started/](https://docs.atlas.mongodb.com/getting-started/). After setting up, find the conection string to your database. It should look like this:

```
{{DB_HOST}}://{{DB_USERNAME}}:{{DB_PASSWORD}}@{{DB_CLUSTER}}/{{DB_NAME}}
```

You should fill in these values in their relevent fields in the `.env` file.

> **NOTE**: Your IP address may change if you've been disconnected from the internet and reconnected. If that happens, it means that your internet connection doesn't have a static IP. You may no longer be able to access the database if you've whitelisted only your previous IP address. You can allow access from any IP address from the Atlas control panel to overcome this issue.

Both the front-end and the back-end can be run from the `labellab-server` folder using the terminal:

1. To run both the client and server with a single command, run the following:  
   `$ npm run dev`

2. To run the server separately:  
   `$ npm run server`

> The server can also be run using `$ npm start`

3. To run the client separately:  
   `$ npm run client`

> **NOTE**: Before starting the server create a file named `.env` same as `.env.example` and add your **OAUTH** and **DATABASE** credentials in the file.

Visit [localhost:3000](http://localhost:3000) to browse.

> **NOTE**: This version only supports Google Chrome and Mozilla Firefox browsers. Make sure to instal the extension [Redux Dev Tools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd) if you're using Google Chrome.

#### How to Use (Mobile)

Run the Node server in the `labellab-server` directory (if not already done):

`npm start`

In a new terminal navigate to `labellab_mobile` directory.

Configure the `lib/config.dart` using the format provided in `lib/config_example.dart`.
<br><br>
The application needs `google-services.json` file issued from Firebase to operate Google Sign in option. To obtain this file,

1. Sign in to https://console.firebase.google.com/.
2. Click **Add Project** and necessary information about the project.
3. Agree to the terms and click **Create Project**.
4. After creating the project, click **Add Firebase to your android app**.
5. Go to project location and open `android/app/src/main/AndroidManifest.xml`. Copy the package name(**org.scorelab.labellab_mobile**) and paste in the package name field
6. Get the **SHA1 fingerprint** by following the instructions ( https://developers.google.com/android/guides/client-auth ) and paste it in the SHA1 fingerprint field.
7. Click next and download the `google-services.json`.
8. Paste the file in location `android/app/` folder.

Build the Flutter application,

`flutter build apk`

> **NOTE**: Use 'ios' instead of 'apk' to build for iOS.

or run the Flutter application.

`flutter run`

> **NOTE**: A device with USB debugging enabled or virtual device is required.
<br/>

## For setting up the Flask backend
### Technologies required

-   **[Python3](https://www.python.org/downloads/)** - Make sure you have a python3 environment setup.
-   **[Virtualenv](https://virtualenv.pypa.io/en/stable/)** - Make sure you install your packages locally in a virtual env and after adding a packing make sure to use 
```bash
pip freeze>requirements.txt
```
-   **[MySQL](https://www.mysql.com/)** - Preferrably MySQL-5.7 database is used. 
-   **[SQLAlchemy](https://www.sqlalchemy.org)** - An SQL ORM
<br/>

1. Make a database in your MYSQL 
   ```bash
   CREATE {DATABASE | SCHEMA} [IF NOT EXISTS] labellab
   ```
2. Create a virtual env in that folder using 
   ```bash
   pip install virtualenv or sudo -H pip install virtualenv
   virtualenv -p python3 venv
   ```
3. Change directory to the folder.

    ```bash
    cd venv/
    source bin/activate for MacOs or linux
    .\Source\activate.bat for Windows
    ```
4. Change the directory back to the parent directory and <br/> 
   add the credentials to your database in the `.env` file.
5. Install all the dependencies using
   ```bash
   pip install -r requirements.txt
   ```
6. Upgrade your database using the migrations file
   ```bash 
   flask db upgrade
   ```
7. Run `flask run` in order to start the server.

>**Note**: It is preferred to undo the migrations before pulling the latest changes, if the latest changes have any changes in the migrations <br/>
or has a new migrations file and in order to create a new migartions file the command `flask db migrate` can be used.

>**Note**: If faced by a directory missing issue do ensure that you have the labellab-flask directory in your `PYTHONPATH` environment variable.

>**Note**: For documentation on the Labeller Go to:**[Labeller Documentation](https://github.com/scorelab/LabelLab/blob/master/LABELLER.md)**