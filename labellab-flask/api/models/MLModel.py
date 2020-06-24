from datetime import datetime
from flask import current_app

from api.extensions import db, Base
from api.models.Projects import Project
from api.models.Label import Label

import json

optional_params = ["id", "name", "type", "source", "preprocessingSteps", "layers", "train", "test", "validation", "epochs",
                   "batch_size", "learning_rate", "loss", "optimizer", "metric", "loss_graph_url", "accuracy_graph_url", "saved_model_url", "transfer_source", "labels"]

class MLModel(db.Model):
    """
    This model holds information about a model
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
        self.project_id = model_data["project_id"].id
        
        for key in optional_params:
            if key in model_data:
                if key is "layers":
                    self.layers = model_data[key]
                    layers = {"layers": model_data[key]}
                    layers = json.dumps(layers)
                    layers = json.loads(layers)
                    layers_url = f"./model_files/layers/{self.project_id}_{self.name}.json"
                    with open(layers_url, "w") as f:
                        json.dump(layers, f)
                    self.layers_json_url = layers_url

                if key is "preprocessingSteps":
                    self.preprocessing_steps = model_data[key]
                    preprocessing_steps = {"steps": model_data[key]}
                    preprocessing_steps = json.dumps(preprocessing_steps)
                    preprocessing_steps = json.loads(preprocessing_steps)
                    steps_url = f"./model_files/steps/{self.project_id}_{self.name}.json"
                    with open(steps_url, "w") as f:
                        json.dump(preprocessing_steps, f)
                    self.preprocessing_steps_json_url = steps_url
                    
                if key is "labels":
                    self.label_ids = []
                    if "id" not in model_data:
                        for label_id in model_data[key]:
                            label = Label.find_by_id_in_project(label_id, self.project_id)
                            if label:
                                self.labels.append(label)
                                self.label_ids.append(label.id)
                    else:
                        model = self.find_by_id(self.id)
                        if model:
                            for label in model.labels:
                                model.labels.remove(label)
                                db.session.commit()
                            # TODO: Ensure frontend sends ID instead of label name
                            # TODO: Refactor based on new label and image controllers
                            for label_id in model_data[key]:
                                label = Label.find_by_id_in_project(label_id, self.project_id)
                                if label:
                                    model.labels.append(label)
                                    db.session.commit()
                                    self.label_ids.append(label.id)
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
        return "<MLModel %r>" % self.name

    def to_json(self):
        """
        Returns a JSON object
        """
        model_json = {"id": self.id, "name": self.name, "type": self.type,
                      "source": self.source, "project_id": self.project_id, "preprocessingSteps": self.preprocessing_steps, "layers": self.layers, "train": f'{self.train}', "test": f'{self.test}', "validation": f'{self.validation}', "epochs": self.epochs, "batch_size": self.batch_size, "learning_rate": f'{self.learning_rate}', "loss": self.loss, "metric": self.metric, "optimizer": self.optimizer, "loss_graph_url": self.loss_graph_url, "accuracy_graph_url": self.accuracy_graph_url, "saved_model_url": self.saved_model_url, "transfer_source": self.transfer_source, "labels": self.label_ids}
        return model_json

    def set_saved_model_url(self, url):
        self.saved_model_url = url

    @classmethod
    def find_by_id(cls, _id):
        return cls.query.filter_by(id=_id).first()

    def save(self):
        """
        Save a model to the database.
        This includes creating a new user and editing one.
        """
        if self.id is None:
            db.session.add(self)
            db.session.commit()
        else:
            model = self.find_by_id(self.id)
            for key in optional_params:
                model[key] = self[key]
            db.session.commit()
