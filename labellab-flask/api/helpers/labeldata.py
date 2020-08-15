from api.extensions import db, ma
from api.models.LabelData import LabelData
from api.serializers.labeldata import LabelDataSchema

labeldata_schema = LabelDataSchema()
labeldatas_schema = LabelDataSchema(many=True)

def to_json(labeldata):
    """
    Returns a labeldata JSON object
    """
    return labeldata_schema.dump(labeldata).data

def find_by_id(_id):
    """
    query labeldata on their id
    """
    labeldata = LabelData.query.filter_by(id=_id).first()
    return labeldata_schema.dump(labeldata).data

def find_by_image_id(image_id):
    """
    query labeldata on their image_id
    """
    labeldatas = LabelData.query.filter_by(image_id=image_id).all()
    labels = labeldatas_schema.dump(labeldatas).data
    format_data = []
    for label_id in labels:
        if labels[label_id]:
            for i in range(len(labels[label_id])):
                labels[label_id][i]['label_id'] = int(label_id)
                format_data.append(labels[label_id][i])
    labels = format_data
    return labels

def find_by_label_id(label_id):
    """
    query labeldata on their label id.
    """
    labeldatas = LabelData.query.filter_by(label_id=label_id).all()
    labels = labeldatas_schema.dump(labeldatas).data
    format_data = []
    for label_id in labels:
        if labels[label_id]:
            for i in range(len(labels[label_id])):
                labels[label_id][i]['label_id'] = int(label_id)
                format_data.append(labels[label_id][i])
    labels = format_data
    return labels

def update_labeldata(labeldata_id, data):
    """
    update labeldata using its id.
    """
    labeldata = LabelData.query.get(labeldata_id)
    labeldata.label_id = data['label_id']
    db.session.commit()
    labeldatas = find_by_image_id(labeldata.image_id)
    return labeldatas

def delete_by_id(_id):
    """
    Delete labeldata by their id
    """
    LabelData.query.filter_by(id=_id).delete()
    db.session.commit()
    
def delete_by_image_id(image_id):
    """
    Delete labeldata by their image id
    """
    LabelData.query.filter_by(image_id=image_id).delete()
    db.session.commit()

def delete_by_label_id(label_id):
    """
    Delete labeldata by their label id
    """
    LabelData.query.filter_by(label_id=label_id).delete()
    db.session.commit()

def save(labeldata):
    """
    Save a labeldata to the database.
    This includes creating a new labeldata and editing one.
    """
    db.session.add(labeldata)
    db.session.commit()
    return labeldata_schema.dump(labeldata).data