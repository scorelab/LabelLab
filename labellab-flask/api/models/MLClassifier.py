import json
import shutil
from os import path, mkdir

from api.extensions import db
from api.helpers.label import find_by_id as find_label
from api.models.Label import Label


optional_params = ["id", "name", "type", "source", "preprocessingSteps", "layers", "train", "test", "validation", "epochs",
                   "batch_size", "learning_rate", "loss", "optimizer", "metric", "loss_graph_url", "accuracy_graph_url", "saved_model_url", "transfer_source", "labels"]

basedir = path.abspath(path.curdir)

def set_layers(model_data):
    layers = {"layers": model_data["layers"]}
    layers = json.dumps(layers)
    layers = json.loads(layers)

    model_id = model_data["id"]
    layers_dir = path.join(basedir,'ml_files', "layers", str(model_id))
    layers_url = f"./ml_files/layers/{model_id}/layers.json"

    if not path.isdir(layers_dir):
        mkdir(layers_dir)
    with open(layers_url, "w") as f:
        json.dump(layers, f)
    return layers_url

def set_preprocessing_steps(model_data):
    preprocessing_steps = {"steps": model_data["preprocessingSteps"]}
    preprocessing_steps = json.dumps(preprocessing_steps)
    preprocessing_steps = json.loads(preprocessing_steps)

    model_id = model_data["id"]
    steps_dir = path.join(basedir,'ml_files', "steps", str(model_id))
    steps_url = f"./ml_files/steps/{model_id}/steps.json"

    if not path.isdir(steps_dir):
        mkdir(steps_dir)
    with open(steps_url, "w") as f:
        json.dump(preprocessing_steps, f)
    return steps_url

def set_labels(model_data):
    label_ids = []
    labels = []
    for label_id in model_data["labels"]:
        label = Label.query.filter_by(id=label_id).first()
        if label:
            labels.append(label)
            label_ids.append(label.id)
    return labels, label_ids

def delete_ml_classifier_files(ml_classifier_id):
    delete_file(path.join(basedir,'ml_files', "graphs", str(ml_classifier_id)))
    delete_file(path.join(basedir,'ml_files', "models", str(ml_classifier_id)))
    delete_file(path.join(basedir,'ml_files', "layers", str(ml_classifier_id)))
    delete_file(path.join(basedir,'ml_files', "steps", str(ml_classifier_id)))

def delete_file(file_path):
    if path.exists(file_path):
        shutil.rmtree(file_path)
    else:
        print(f"The file '{file_path}' does not exist")

class MLClassifier(db.Model):
    """
    This model holds information about a classifier
    """
    __tablename__ = "model"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(45), nullable=False,)
    type = db.Column(db.String(45), nullable=False,)
    source = db.Column(db.String(45), nullable=False,)
    preprocessing_steps_json_url = db.Column(db.String(45), nullable=True,)
    layers_json_url = db.Column(db.String(45), nullable=True,)
    train = db.Column(db.Float(4, 2), nullable=True,)
    test = db.Column(db.Float(4, 2), nullable=True,)
    validation = db.Column(db.Float(4, 2), nullable=True,)
    epochs = db.Column(db.Integer, default=0)
    batch_size = db.Column(db.Integer, default=0)
    learning_rate = db.Column(db.Float(4, 2), nullable=True,)
    loss = db.Column(db.String(45), nullable=True,)
    optimizer = db.Column(db.String(45), nullable=True,)
    metric = db.Column(db.String(45), nullable=True,)
    loss_graph_url = db.Column(db.String(45), nullable=True,)
    accuracy_graph_url = db.Column(db.String(45), nullable=True,)
    saved_model_url = db.Column(db.String(45), nullable=True,)
    transfer_source = db.Column(db.String(45), nullable=True,)
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)

    def __init__(self, model_data):
        """
        Initializes the model instance
        """
        self.name = model_data["name"]
        self.type = model_data["type"]
        self.source = model_data["source"]
        self.project_id = model_data["project_id"]["id"]
        
        for key in optional_params:
            if key in model_data:
                if key is "layers":
                    self.layers_json_url = set_layers(model_data)

                if key is "preprocessingSteps":
                    self.preprocessing_steps_json_url = set_preprocessing_steps(model_data)
                    
                if key is "labels":
                    self.labels, self.label_ids = set_labels(model_data)
                        
                else:
                    self[key] = model_data[key]
            else:
                self[key] = None

    def __getitem__(self, index):
        if index is "id": return self.id
        if index is "name": return self.name
        if index is "type": return self.type
        if index is "source": return self.source
        if index is "project_id": return self.project_id
        if index is "preprocessing_steps_json_url": return self.preprocessing_steps_json_url
        if index is "layers_json_url": return self.layers_json_url
        if index is "train": return self.train
        if index is "test": return self.test
        if index is "validation": return self.validation
        if index is "epochs": return self.epochs
        if index is "batch_size": return self.batch_size
        if index is "learning_rate": return self.learning_rate
        if index is "loss": return self.loss
        if index is "optimizer": return self.optimizer
        if index is "metric": return self.metric
        if index is "loss_graph_url": return self.loss_graph_url
        if index is "accuracy_graph_url": return self.accuracy_graph_url
        if index is "saved_model_url": return self.saved_model_url
        if index is "transfer_source": return self.transfer_source

    def __setitem__(self, index, value):
        if index is "id": self.id = value
        if index is "name": self.name = value
        if index is "type": self.type = value
        if index is "source": self.source = value
        if index is "project_id": self.project_id = value
        if index is "preprocessing_steps_json_url": self.preprocessing_steps_json_url = value
        if index is "layers_json_url": self.layers_json_url = value
        if index is "train": self.train = value
        if index is "test": self.test = value
        if index is "validation": self.validation = value
        if index is "epochs": self.epochs = value
        if index is "batch_size": self.batch_size = value
        if index is "learning_rate": self.learning_rate = value
        if index is "loss": self.loss = value
        if index is "optimizer": self.optimizer = value
        if index is "metric": self.metric = value
        if index is "loss_graph_url": self.loss_graph_url = value
        if index is "accuracy_graph_url": self.accuracy_graph_url = value
        if index is "saved_model_url": self.saved_model_url = value
        if index is "transfer_source": self.transfer_source = value

    def __repr__(self):
        """
        Returns the object representation
        """
        return "<MLClassifier %r>" % self.name