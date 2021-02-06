from api.extensions import db, ma
from api.models.Label import Label
from api.serializers.label import LabelSchema

label_schema = LabelSchema()
labels_schema = LabelSchema(many=True)

def to_json(label):
    """
    Returns a label JSON object
    """
    return label_schema.dump(label).data

def find_by_id(_id):
    """
    query label on their id
    """
    label = Label.query.filter_by(id=_id).first()
    return label_schema.dump(label).data

def find_by_label_name(label_name):
    """
    query label on their label_name
    """
    label = Label.query.filter_by(label_name=label_name).first()
    return label_schema.dump(label).data

def find_by_label_type(label_type):
    """
    query label on their label type.
    """
    labels = Label.query.filter_by(label_type=label_type).all()
    return labels_schema.dump(labels).data

def find_all_by_project_id(project_id):
    """
    find all the labels in a project
    """
    labels = Label.query.filter_by(project_id=project_id).all()
    return labels_schema.dump(labels).data

def get_label_type(label_id):
    """
    get the label type
    """
    label = Label.query.get(label_id)
    return label.label_type

def update_label(label_id, data):
    """
    update label using its id.
    """
    label = Label.query.get(label_id)
    label.label_name = data['label_name']
    label.label_type = data['label_type']
    db.session.commit()
    return label_schema.dump(label).data

def delete_by_id(_id):
    """
    Delete label by their id
    """
    Label.query.filter_by(id=_id).delete()
    db.session.commit()
    
def delete_by_label_name(label_name):
    """
    Delete label by their name
    """
    Label.query.filter_by(label_name=label_name).delete()
    db.session.commit()

def delete_by_label_type(label_type):
    """
    Delete label by their label type
    """
    Label.query.filter_by(label_type=label_type).delete()
    db.session.commit()

def save(label):
    """
    Save a label to the database.
    This includes creating a new label and editing one.
    """
    db.session.add(label)
    db.session.commit()
    return label_schema.dump(label).data