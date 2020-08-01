import pandas as pd
import numpy as np
import tensorflow as tf
import json
import os
import zipfile
from tensorflow.keras.preprocessing.image import ImageDataGenerator, load_img, img_to_array 

from ml.layer import FlattenLayer, DenseLayer, DropoutLayer, GlobalAveragePooling2DLayer, ActivationLayer, Conv2DLayer, MaxPool2DLayer, get_setting
from ml.preprocessing import get_preprocessing_steps
from ml.trainingplot import TrainingPlot

TARGET_SIZE = (256, 256)
INPUT_SIZE = (256, 256, 3)

def save_uploaded_model(model_file, directory, model_id):
    # Create directory
    tf.io.gfile.mkdir(directory)
    tf.io.gfile.mkdir(directory + f"/{model_id}")
    tf.io.gfile.mkdir(directory + f"/{model_id}" + "/savedmodel")

    # Save the zip file
    model_file.save(directory + f"/{model_id}/savedmodel.zip")

    # Unzip and save
    with zipfile.ZipFile(directory + f"/{model_id}/savedmodel.zip", 'r') as zip_ref:
        zip_ref.extractall(directory + f"/{model_id}/")

class Classifier:
    #Constructor
    def __init__(self, type="custom"):
        self.model = tf.keras.models.Sequential()
        self.type = type

    # Load model from a given directory
    def load_model(self, directory):
        self.model = tf.keras.models.load_model(directory)

    # Create data generators using a pandas dataframe
    def load_data(self, data, directory, test_split):
        """
        imagename | label
        """
        images = data.head(int(len(data)*(1-test_split))) # Remove test images

        self.train_generator = self.datagen.flow_from_dataframe(dataframe=images,
                                                            directory=directory,
                                                            x_col="imagename",
                                                            y_col="label",
                                                            subset="training",
                                                            batch_size=self.batch_size,
                                                            seed=42,
                                                            shuffle=True,
                                                            class_mode="categorical",
                                                            target_size=TARGET_SIZE)

        self.valid_generator = self.datagen.flow_from_dataframe(dataframe=images,
                                                            directory=directory,
                                                            x_col="imagename",
                                                            y_col="label",
                                                            subset="validation",
                                                            batch_size=self.batch_size,
                                                            seed=42,
                                                            shuffle=True,
                                                            class_mode="categorical",
                                                            target_size=TARGET_SIZE)

    # If transfer learning, set the correct Keras Application source
    def set_transfer_source(self, source):
        self.type = "transfer"
        if "ml_files" in source:
            self.base_model = tf.keras.models.load_model(source)
            for layer in self.base_model.layers:
                layer.trainable = False
                layer._name = f'{layer.name}_base'
        else:
            input = tf.keras.layers.Input(shape=INPUT_SIZE)
            if source == "DenseNet121":
                self.base_model = tf.keras.applications.DenseNet121(include_top=False, input_tensor=input)
            elif source == "DenseNet169":
                self.base_model = tf.keras.applications.DenseNet169(include_top=False, input_tensor=input)
            elif source == "DenseNet201":
                self.base_model = tf.keras.applications.DenseNet201(include_top=False, input_tensor=input)
            elif source == "InceptionResNetV2":
                self.base_model = tf.keras.applications.InceptionResNetV2(include_top=False, input_tensor=input)
            elif source == "InceptionV3":
                self.base_model = tf.keras.applications.InceptionV3(include_top=False, input_tensor=input)
            elif source == "MobileNet":
                self.base_model = tf.keras.applications.MobileNet(include_top=False, input_tensor=input)
            elif source == "MobileNetV2":
                self.base_model = tf.keras.applications.MobileNetV2(include_top=False, input_tensor=input)
            elif source == "NASNetLarge":
                self.base_model = tf.keras.applications.NASNetLarge(include_top=False, input_tensor=input)
            elif source == "NASNetMobile":
                self.base_model = tf.keras.applications.NASNetMobile(include_top=False, input_tensor=input)
            elif source == "ResNet50":
                self.base_model = tf.keras.applications.ResNet50(include_top=False, input_tensor=input)
            elif source == "ResNet50V2":
                self.base_model = tf.keras.applications.ResNet50V2(include_top=False, input_tensor=input)
            elif source == "ResNet101":
                self.base_model = tf.keras.applications.ResNet101(include_top=False, input_tensor=input)
            elif source == "ResNet101V2":
                self.base_model = tf.keras.applications.ResNet101V2(include_top=False, input_tensor=input)
            elif source == "ResNet152":
                self.base_model = tf.keras.applications.ResNet152(include_top=False, input_tensor=input)
            elif source == "ResNet152V2":
                self.base_model = tf.keras.applications.ResNet152V2(include_top=False, input_tensor=input)
            elif source == "VGG16":
                self.base_model = tf.keras.applications.VGG16(include_top=False, input_tensor=input)
            elif source == "VGG19":
                self.base_model = tf.keras.applications.VGG19(include_top=False, input_tensor=input)
            elif source == "Xception":
                self.base_model = tf.keras.applications.Xception(include_top=False, input_tensor=input)
        
    def set_learning_rate(self, learning_rate):
        self.learning_rate = float(learning_rate)

    def set_optimizer(self, optimizer):
        if optimizer == "Adadelta":
            self.optimizer = tf.keras.optimizers.Adadelta(learning_rate=self.learning_rate)
        if optimizer == "Adagrad":
            self.optimizer = tf.keras.optimizers.Adagrad(learning_rate=self.learning_rate)
        if optimizer == "Adam":
            self.optimizer = tf.keras.optimizers.Adam(learning_rate=self.learning_rate)
        if optimizer == "Adamax":
            self.optimizer = tf.keras.optimizers.Adamax(learning_rate=self.learning_rate)
        if optimizer == "Ftrl":
            self.optimizer = tf.keras.optimizers.Ftrl(learning_rate=self.learning_rate)
        if optimizer == "Nadam":
            self.optimizer = tf.keras.optimizers.Nadam(learning_rate=self.learning_rate)
        if optimizer == "RMSProp":
            self.optimizer = tf.keras.optimizers.RMSProp(learning_rate=self.learning_rate)
        if optimizer == "SGD":
            self.optimizer = tf.keras.optimizers.SGD(learning_rate=self.learning_rate)

    def set_loss(self, loss):
        if loss == "Categorical Cross Entropy":
            self.loss = "categorical_crossentropy"
        elif loss == "Binary Cross Entropy":
            self.loss = "binary_crossentropy"
        
    def set_metrics(self, metric):
        self.metrics = []
        if metric == "Accuracy":
            self.metrics.append("accuracy")

    def set_batch_size(self, batch_size):
        self.batch_size = int(batch_size)

    def set_epochs(self, epochs):
        self.epochs = int(epochs)

    # Create image data generator and add augmentation steps
    def add_preprocessing_steps(self, steps, validation_split):
        augmentation = get_preprocessing_steps(steps)
        
        self.datagen = ImageDataGenerator(
        featurewise_center=augmentation["featurewise_center"], 
        samplewise_center=augmentation["samplewise_center"],
        featurewise_std_normalization=augmentation["featurewise_std_normalization"], 
        samplewise_std_normalization=augmentation["samplewise_std_normalization"],
        rotation_range=augmentation["rotation_range"], 
        width_shift_range=augmentation["width_shift_range"],
        height_shift_range=augmentation["height_shift_range"],
        shear_range=augmentation["shear_range"], 
        zoom_range=augmentation["zoom_range"],
        channel_shift_range=augmentation["channel_shift_range"],
        horizontal_flip=augmentation["horizontal_flip"],
        vertical_flip=augmentation["vertical_flip"], 
        rescale=augmentation["rescale"], 
        validation_split=validation_split
        )

    # Parse layers dictionary to add layers to model
    def add_layers(self, layers):
        if self.type is "custom":
            for i in range(len(layers)):
                layer = layers[i]
                if i is 0:
                    self.model.add(self.get_layer_object(layer, INPUT_SIZE))
                else:
                    self.model.add(self.get_layer_object(layer))
        elif self.type is "transfer":
            x = self.base_model.output
            for i in range(len(layers)):
                layer = layers[i]
                if i is 0:
                    x = self.get_layer_object(layer, INPUT_SIZE)(x)
                else:
                    x = self.get_layer_object(layer)(x)
            self.model = tf.keras.models.Model(inputs=self.base_model.input, outputs=x)

    # Get initialized layer object based on settings
    def get_layer_object(self, layer, input_shape=None):
        layer_name = layer["name"]
        if layer_name == "GlobalAveragePooling2D":
            return GlobalAveragePooling2DLayer().get_layer()
        elif layer_name == "Flatten":
            return FlattenLayer().get_layer()
        elif layer_name == "Dense":
            return DenseLayer(layer["settings"]).get_layer()
        elif layer_name == "Dropout":
            return DropoutLayer(layer["settings"]).get_layer()
        elif layer_name == "Activation":
            return ActivationLayer(layer["settings"]).get_layer()
        elif layer_name == "Conv2D":
            return Conv2DLayer(layer["settings"], input_shape).get_layer()
        elif layer_name == "MaxPool2D":
            return MaxPool2DLayer(layer["settings"]).get_layer()

    # Compile the model
    def compile(self):
        self.model.compile(loss=self.loss, optimizer=self.optimizer, metrics=self.metrics)

    # Set callback to save model URL
    def set_graph_directory(self, plot_directory):
        tf.io.gfile.mkdir(plot_directory)
        self.plot_losses = TrainingPlot(plot_directory)

    # Fit the model and validate
    def fit(self):
        STEP_SIZE_TRAIN = self.train_generator.n//self.train_generator.batch_size
        STEP_SIZE_VALID = self.valid_generator.n//self.valid_generator.batch_size
        self.model.fit(x=self.train_generator,
                        steps_per_epoch=STEP_SIZE_TRAIN,
                        validation_data=self.valid_generator,
                        validation_steps=STEP_SIZE_VALID,
                        epochs=self.epochs,
                        callbacks=[self.plot_losses])

    # Save the model in given format
    def save(self, directory, model_id, type="savedmodel"):
        # Create directory for savinf model files
        tf.io.gfile.mkdir(directory)
        tf.io.gfile.mkdir(directory + f"/{model_id}")

        # Save the class indices for use during prediction
        if hasattr(self, "train_generator"):
            model_classes = json.dumps(self.train_generator.class_indices)
            model_classes = json.loads(model_classes)
            model_classes_url = directory + f"/{model_id}/model_classes.json"
            with open(model_classes_url, "w") as f:
                json.dump(model_classes, f)

        if type == "savedmodel":
            tf.io.gfile.mkdir(directory + f"/{model_id}" + "/savedmodel")
            self.model.save(directory + f"/{model_id}/savedmodel")
        elif type == "h5":
            tf.io.gfile.mkdir(directory + f"/{model_id}" + "/h5")
            self.model.save(directory + f"/{model_id}/h5/saved_model.h5")
        else:
            tf.io.gfile.mkdir(directory + f"/{model_id}" + "/onnx")
            os.popen(f"python -m tf2onnx.convert --saved-model {directory}/{model_id}/savedmodel --output {directory}/{model_id}/onnx/saved_model.onnx").read()

    # Test the model on an image
    def evaluate(self, directory, classes_directory, model_id, file):
        tf.io.gfile.mkdir(directory)
        tf.io.gfile.mkdir(directory + f"/{model_id}")
        file.save(directory + f"/{model_id}/testfile.PNG")

        img_path = directory + f"/{model_id}/testfile.PNG"
        img = load_img(img_path, target_size=TARGET_SIZE)
        x = img_to_array(img)
        x = np.expand_dims(x, axis=0)

        preds = self.model.predict(x)
        preds = preds[0].tolist()

        with open(classes_directory + f"/{model_id}/model_classes.json") as f:
            model_classes = json.load(f)

        result = {}

        for key, value in model_classes.items():
            if preds[value] >= 0:
                result[key] = preds[value]

        return result
        