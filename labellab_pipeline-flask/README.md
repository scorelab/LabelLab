# Flask Backend and Pipleline

Backend for the Project Labellab needs to be shifted to flask and 
a pipeline needs to be created for fetching labels from the machine learning models 
which in turn are implemented in python using libraries like 
tensorflow, pytorch, scikit-learn, etc
---

- This folder contains the backend which has been (is being) shifted from NodeJS. 
- This also contains the pipeline for the backend services to interact with ML models


## Setup instruction
- There are two ways to setup. You can either use globally installed packages or create a virtual
environment(recomended) using venv and activate it. 
- Navigate to the folder labellab_pipeline-flask/ inside your terminal and execute the commands mentioned below.
```
pip install -r requirements.txt
python3 main.py
```
- Add a .env file in this folder. A sample env file has been provided under the name .env.example


## Project structure
```
.
├── app.py
├── controllers
│   ├── auth
│   │   ├── authController.py
│   └── classification
│       └── classificationController.py
├── main.py
├── README.md
├── requirements.txt
└── routers
    ├── auth
    │   └── routes.py
    └── classification
        └── routes.py
```
