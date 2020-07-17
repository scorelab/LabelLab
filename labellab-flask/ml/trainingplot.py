import matplotlib
matplotlib.use('agg')
import matplotlib.pyplot as plt
import tensorflow as tf
import numpy as np

class TrainingPlot(tf.keras.callbacks.Callback):

    def __init__(self, directory):
        self.directory = directory

    # Called when the training begins
    def on_train_begin(self, logs={}):
        self.losses = []
        self.acc = []
        self.val_losses = []
        self.val_acc = []
        self.logs = []

    # Called at the end of each epoch
    def on_epoch_end(self, epoch, logs={}):

        self.logs.append(logs)
        self.losses.append(logs.get('loss'))
        self.acc.append(logs.get('acc'))
        self.val_losses.append(logs.get('val_loss'))
        self.val_acc.append(logs.get('val_acc'))

        if len(self.losses) > 1:

            N = np.arange(0, len(self.losses))

            plt.style.use("seaborn")

            plt.figure()
            plt.plot(N, self.losses, label = "train_loss")
            plt.plot(N, self.val_losses, label = "val_loss")
            plt.title("Model Loss")
            plt.xlabel("Epoch")
            plt.ylabel("Loss")
            plt.legend()

            plt.savefig(f"{self.directory}/loss.jpg")

            plt.clf()

            plt.figure()
            plt.plot(N, self.acc, label = "train_acc")
            plt.plot(N, self.val_acc, label = "val_acc")
            plt.title("Model Accuracy")
            plt.xlabel("Epoch")
            plt.ylabel("Accuracy")
            plt.legend()

            plt.savefig(f"{self.directory}/accuracy.jpg")
            plt.close()