import pandas as pd
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator

from utils.layer import FlattenLayer, DenseLayer, DropoutLayer, GlobalAveragePooling2DLayer, ActivationLayer, Conv2DLayer, MaxPool2DLayer, get_setting
from utils.preprocessing import get_preprocessing_steps

TARGET_SIZE = (256, 256)
INPUT_SIZE = (256, 256, 3)

class Classifier:
    #Constructor
    def __init__(self, type="custom"):
        self.model = tf.keras.models.Sequential()
        self.type = type

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
        input = tf.keras.layers.Input(shape=INPUT_SIZE)
        if source is "DenseNet121":
            self.base_model = tf.keras.applications.DenseNet121(include_top=False, input_tensor=input)
        elif source is "DenseNet169":
            self.base_model = tf.keras.applications.DenseNet169(include_top=False, input_tensor=input)
        elif source is "DenseNet201":
            self.base_model = tf.keras.applications.DenseNet201(include_top=False, input_tensor=input)
        elif source is "InceptionResNetV2":
            self.base_model = tf.keras.applications.InceptionResNetV2(include_top=False, input_tensor=input)
        elif source is "InceptionV3":
            self.base_model = tf.keras.applications.InceptionV3(include_top=False, input_tensor=input)
        elif source is "MobileNet":
            self.base_model = tf.keras.applications.MobileNet(include_top=False, input_tensor=input)
        elif source is "MobileNetV2":
            self.base_model = tf.keras.applications.MobileNetV2(include_top=False, input_tensor=input)
        elif source is "NASNetLarge":
            self.base_model = tf.keras.applications.NASNetLarge(include_top=False, input_tensor=input)
        elif source is "NASNetMobile":
            self.base_model = tf.keras.applications.NASNetMobile(include_top=False, input_tensor=input)
        elif source is "ResNet50":
            self.base_model = tf.keras.applications.ResNet50(include_top=False, input_tensor=input)
        elif source is "ResNet50V2":
            self.base_model = tf.keras.applications.ResNet50V2(include_top=False, input_tensor=input)
        elif source is "ResNet101":
            self.base_model = tf.keras.applications.ResNet101(include_top=False, input_tensor=input)
        elif source is "ResNet101V2":
            self.base_model = tf.keras.applications.ResNet101V2(include_top=False, input_tensor=input)
        elif source is "ResNet152":
            self.base_model = tf.keras.applications.ResNet152(include_top=False, input_tensor=input)
        elif source is "ResNet152V2":
            self.base_model = tf.keras.applications.ResNet152V2(include_top=False, input_tensor=input)
        elif source is "VGG16":
            self.base_model = tf.keras.applications.VGG16(include_top=False, input_tensor=input)
        elif source is "VGG19":
            self.base_model = tf.keras.applications.VGG19(include_top=False, input_tensor=input)
        elif source is "Xception":
            self.base_model = tf.keras.applications.Xception(include_top=False, input_tensor=input)
        
    def set_learning_rate(self, learning_rate):
        self.learning_rate = learning_rate

    def set_optimizer(self, optimizer):
        if optimizer is "Adadelta":
            self.optimizer = tf.keras.optimizers.Adadelta(learning_rate=self.learning_rate)
        if optimizer is "Adagrad":
            self.optimizer = tf.keras.optimizers.Adagrad(learning_rate=self.learning_rate)
        if optimizer is "Adam":
            self.optimizer = tf.keras.optimizers.Adam(learning_rate=self.learning_rate)
        if optimizer is "Adamax":
            self.optimizer = tf.keras.optimizers.Adamax(learning_rate=self.learning_rate)
        if optimizer is "Ftrl":
            self.optimizer = tf.keras.optimizers.Ftrl(learning_rate=self.learning_rate)
        if optimizer is "Nadam":
            self.optimizer = tf.keras.optimizers.Nadam(learning_rate=self.learning_rate)
        if optimizer is "RMSProp":
            self.optimizer = tf.keras.optimizers.RMSProp(learning_rate=self.learning_rate)
        if optimizer is "SGD":
            self.optimizer = tf.keras.optimizers.SGD(learning_rate=self.learning_rate)

    def set_loss(self, loss):
        if loss == "Categorical Cross Entropy":
            self.loss = "categorical_crossentropy"
        elif loss == "Binary Cross Entropy":
            self.loss = "binary_crossentropy"
        
    def set_metrics(self, metric):
        self.metrics = []
        if metric is "Accuracy":
            self.metrics.append("accuracy")

    def set_batch_size(self, batch_size):
        self.batch_size = batch_size

    def set_epochs(self, epochs):
        self.epochs = epochs

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
        if layer_name is "GlobalAveragePooling2D":
            return GlobalAveragePooling2DLayer().get_layer()
        elif layer_name is "Flatten":
            return FlattenLayer().get_layer()
        elif layer_name is "Dense":
            return DenseLayer(layer["settings"]).get_layer()
        elif layer_name is "Dropout":
            return DropoutLayer(layer["settings"]).get_layer()
        elif layer_name is "Activation":
            return ActivationLayer(layer["settings"]).get_layer()
        elif layer_name is "Conv2D":
            return Conv2DLayer(layer["settings"], input_shape).get_layer()
        elif layer_name is "MaxPool2D":
            return MaxPool2DLayer(layer["settings"]).get_layer()

    # Compile the model
    def compile(self):
        self.model.compile(loss=self.loss, optimizer=self.optimizer, metrics=self.metrics)

    # Fit the model and validate
    def fit(self):
        STEP_SIZE_TRAIN = self.train_generator.n//self.train_generator.batch_size
        STEP_SIZE_VALID = self.valid_generator.n//self.valid_generator.batch_size
        self.model.fit(x=self.train_generator,
                        steps_per_epoch=STEP_SIZE_TRAIN,
                        validation_data=self.valid_generator,
                        validation_steps=STEP_SIZE_VALID,
                        epochs=self.epochs)

    # Save the model in SavedModel format
    def save(self, directory):
        self.model.save(directory)