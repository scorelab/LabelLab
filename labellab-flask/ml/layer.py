import tensorflow as tf

def get_setting(settings, setting_name):
    for setting in settings:
        if setting["name"] == setting_name:
            return setting["value"]

class FlattenLayer:
    def get_layer(self):
        return tf.keras.layers.Flatten()

class GlobalAveragePooling2DLayer:
    def get_layer(self):
        return tf.keras.layers.GlobalAveragePooling2D()

class DenseLayer:
    def __init__(self, settings):
        self.settings = settings

    def get_layer(self):
        return tf.keras.layers.Dense(int(get_setting(self.settings, "Units")))

class DropoutLayer:
    def __init__(self, settings):
        self.settings = settings

    def get_layer(self):
        return tf.keras.layers.Dropout(float(get_setting(self.settings, "Rate")))

class ActivationLayer:
    def __init__(self, settings):
        self.settings = settings

    def get_layer(self):
        return tf.keras.layers.Activation(get_setting(self.settings, "Activation"))

class Conv2DLayer:
    def __init__(self, settings, input_shape=None):
        self.settings = settings
        self.input_shape = input_shape

    def get_layer(self):
        filters = int(get_setting(self.settings, "Filters"))
        kernel_size = (int(get_setting(self.settings, "Kernel Size")), int(get_setting(self.settings, "Kernel Size")))
        x_strides = int(get_setting(self.settings, "X Strides"))
        y_strides = int(get_setting(self.settings, "Y Strides"))
        if self.input_shape is not None:
            return tf.keras.layers.Conv2D(filters=filters,
                                    kernel_size=kernel_size, 
                                    strides=(x_strides, y_strides),
                                    input_shape=self.input_shape)
        else:
            return tf.keras.layers.Conv2D(filters=filters,
                                    kernel_size=kernel_size, 
                                    strides=(x_strides, y_strides))

class MaxPool2DLayer:
    def __init__(self, settings):
        self.settings = settings

    def get_layer(self):
        pool_size_x = int(get_setting(self.settings, "Pool Size Y"))
        pool_size_y = int(get_setting(self.settings, "Pool Size X"))
        return tf.keras.layers.MaxPool2D(pool_size=(pool_size_x, pool_size_y))
