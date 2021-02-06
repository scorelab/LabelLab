from api.extensions import db, ma
from api.models.MLClassifier import (
    MLClassifier, 
    optional_params, 
    set_layers, 
    get_layers,
    set_preprocessing_steps, 
    get_preprocessing_steps,
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
    if("preprocessing_steps_json_url" in classifier_data and ml_classifier.preprocessing_steps_json_url is not None):
        classifier_data["preprocessingSteps"] = get_preprocessing_steps(ml_classifier.preprocessing_steps_json_url)
    if("layers_json_url" in classifier_data and ml_classifier.layers_json_url is not None):
        classifier_data["layers"] = get_layers(ml_classifier.layers_json_url)
    
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
    if "train" in classifier_data: ml_classifier.train = classifier_data["train"]
    if "test" in classifier_data: ml_classifier.test = classifier_data["test"]
    if "validation" in classifier_data: ml_classifier.validation = classifier_data["validation"]
    if "epochs" in classifier_data: ml_classifier.epochs = classifier_data["epochs"]
    if "batchSize" in classifier_data: ml_classifier.batch_size = classifier_data["batchSize"]
    if "learningRate" in classifier_data: ml_classifier.learning_rate = classifier_data["learningRate"]
    if "loss" in classifier_data: ml_classifier.loss = classifier_data["loss"]
    if "optimizer" in classifier_data: ml_classifier.optimizer = classifier_data["optimizer"]
    if "metric" in classifier_data: ml_classifier.metric = classifier_data["metric"]
    if "lossGraphUrl" in classifier_data: ml_classifier.loss_graph_url = classifier_data["lossGraphUrl"]
    if "accuracyGraphUrl" in classifier_data: ml_classifier.accuracy_graph_url = classifier_data["accuracyGraphUrl"]
    if "savedModelUrl" in classifier_data: ml_classifier.saved_model_url = classifier_data["savedModelUrl"]
    if "transferSource" in classifier_data: ml_classifier.transfer_source = classifier_data["transferSource"]
    if "preprocessingSteps" in classifier_data: ml_classifier.preprocessing_steps_json_url = set_preprocessing_steps(classifier_data)
    if "layers" in classifier_data: ml_classifier.layers_json_url = set_layers(classifier_data)
    if "preprocessingStepsJsonUrl" in classifier_data: ml_classifier.preprocessing_steps_json_url = classifier_data["preprocessingStepsJsonUrl"]
    if "layersJsonUrl" in classifier_data: ml_classifier.layers_json_url = classifier_data["layersJsonUrl"]

    if "labels" in classifier_data:
        ml_classifier.labels = []
        label_ids = []
        for label_id in classifier_data["labels"]:
            label = Label.query.get(label_id)
            ml_classifier.labels.append(label)
            label_ids.append(label.id)

    db.session.commit()

    classifier_data = ml_classifier_schema.dump(ml_classifier).data
    if("label_ids" in locals() and len(label_ids) > 0):
        classifier_data["labels"] = label_ids
    else:
        labels = Label.query.filter(Label.models.any(id=classifier_data["id"])).all()
        if len(labels) > 0:
            label_ids = []
            for label in labels:
                label_ids.append(label.id)
            classifier_data["labels"] = label_ids
    if(ml_classifier.preprocessing_steps_json_url is not None):
        classifier_data["preprocessingSteps"] = get_preprocessing_steps(ml_classifier.preprocessing_steps_json_url)
    if(ml_classifier.layers_json_url is not None):
        classifier_data["layers"] = get_layers(ml_classifier.layers_json_url)
    return classifier_data

def save(ml_classifier):
    """
    Create and save a new model.
    """
    db.session.add(ml_classifier)
    db.session.commit()
    return ml_classifier_schema.dump(ml_classifier).data