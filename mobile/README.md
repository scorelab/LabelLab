# LabelLab - Mobile

Machine learning supported web-base image labelling tool for researcher. 

## Getting Started

LabelLab allows objects in images to be labeled using a web based machine learning model.

## Prototype

This is a prototype for LabelLab project. Currenty, this prototype allows an 
image to be uploaded to the backend and receive the size of the image as mock result
to simulate the actual classification model.

Project contains a [mobile](https://github.com/UdeshUK/LabelLab/tree/master/mobile) app which is implemented using Flutter 
framework. And a [backend](https://github.com/UdeshUK/LabelLab/tree/master/backend) implemented with Node.js.

## How To Setup

+ Clone the repository
+ Build and run mobile app
  1. Navigate to mobile 
      ```
      cd _repository_/mobile
      ```
  2. Build flutter application
      ```bash
      flutter build apk
      # or ios instead of apk to build for iOS
      ```
  3. or run the flutter application
      ```
      flutter run
      # A device with USB debugging enabled or virtual device is required
      ```

For more information about Flutter read the [online documentation](https://flutter.io/docs).