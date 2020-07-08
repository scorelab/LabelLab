from api.extensions import db, ma
from api.models.MLClassifier import (
    MLClassifier, 
    optional_params, 
    set_layers, 
    set_preprocessing_steps, 
    set_labels,
    delete_ml_classifier_files
)
from api.models.Label import Label
from api.serializers.mlclassifier import MLClassifierSchema
from api.serializers.label import LabelSchema


ml_classifier_schema = MLClassifierSchema()
ml_classifiers_schema = MLClassifierSchema(many=True)

def to_json(MLClassifier):
    """
    Returns an ML Classifier JSON object
    """
    return ml_classifier_schema.dump(MLClassifier).data

def find_by_id(_id):
    """
    Query ML Classifier based on the ID
    """
    ml_classifier = MLClassifier.query.filter_by(id=_id).first()
    labels = Label.query.filter(Label.models.any(id=_id)).all()
    label_ids = []
    for label in labels:
        label_ids.append(label.id)

    classifier_data = ml_classifier_schema.dump(ml_classifier).data
    if(len(label_ids) > 0):
        classifier_data["labels"] = label_ids
    return classifier_data

def find_all_by_project_id(_project_id):
    ml_classifiers = MLClassifier.query.filter_by(project_id=_project_id).all()
    return ml_classifiers_schema.dump(ml_classifiers).data

def delete_by_id(_id):
    ml_classifier = MLClassifier.query.filter_by(id=_id).first()
    # Delete related files
    delete_ml_classifier_files(_id)

    # Remove labels from this model
    for label in ml_classifier.labels:
        ml_classifier.labels.remove(label)
    
    # Delete model from database
    db.session.delete(ml_classifier)
    db.session.commit()

def update(classifier_data):
    """
    Save changes to an existing model.
    """
    ml_classifier = MLClassifier.query.get(classifier_data["id"])

    if "name" in classifier_data: ml_classifier.name = classifier_data["name"]
    if "type" in classifier_data: ml_classifier.type = classifier_data["type"]
    if "source" in classifier_data: ml_classifier.source = classifier_data["source"]
    if "project_id" in classifier_data: ml_classifier.project_id = classifier_data["project_id"]["id"]
    if "train" in classifier_data: ml_classifier.train = classifier_data["train"]
    if "test" in classifier_data: ml_classifier.test = classifier_data["test"]
    if "validation" in classifier_data: ml_classifier.validation = classifier_data["validation"]
    if "epochs" in classifier_data: ml_classifier.epochs = classifier_data["epochs"]
    if "batch_size" in classifier_data: ml_classifier.batch_size = classifier_data["batch_size"]
    if "learning_rate" in classifier_data: ml_classifier.learning_rate = classifier_data["learning_rate"]
    if "loss" in classifier_data: ml_classifier.loss = classifier_data["loss"]
    if "optimizer" in classifier_data: ml_classifier.optimizer = classifier_data["optimizer"]
    if "metric" in classifier_data: ml_classifier.metric = classifier_data["metric"]
    if "loss_graph_url" in classifier_data: ml_classifier.loss_graph_url = classifier_data["loss_graph_url"]
    if "accuracy_graph_url" in classifier_data: ml_classifier.accuracy_graph_url = classifier_data["accuracy_graph_url"]
    if "saved_model_url" in classifier_data: ml_classifier.saved_model_url = classifier_data["saved_model_url"]
    if "transfer_source" in classifier_data: ml_classifier.transfer_source = classifier_data["transfer_source"]
    if "preprocessingSteps" in classifier_data: ml_classifier.preprocessing_steps_json_url = set_preprocessing_steps(classifier_data)
    if "layers" in classifier_data: ml_classifier.layers_json_url = set_layers(classifier_data)
    if "preprocessing_steps_json_url" in classifier_data: ml_classifier.preprocessing_steps_json_url = classifier_data["preprocessing_steps_json_url"]
    if "layers_json_url" in classifier_data: ml_classifier.layers_json_url = classifier_data["layers_json_url"]

    ml_classifier.labels = []

    if "labels" in classifier_data:
        label_ids = []
        for label_id in classifier_data["labels"]:
            label = Label.query.get(label_id)
            ml_classifier.labels.append(label)
            label_ids.append(label.id)

    db.session.commit()

    classifier_data = ml_classifier_schema.dump(ml_classifier).data
    if("label_ids" in locals() and len(label_ids) > 0):
        classifier_data["labels"] = label_ids
    return classifier_data

def save(ml_classifier):
    """
    Create and save a new model.
    """
    db.session.add(ml_classifier)
    db.session.commit()
    classifier_data = ml_classifier_schema.dump(ml_classifier).data
    if (hasattr(ml_classifier, "label_ids") and ml_classifier.label_ids is not None):
        classifier_data["labels"] = ml_classifier.label_ids
    return classifier_data