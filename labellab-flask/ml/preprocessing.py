from ml.layer import get_setting

def get_preprocessing_steps(steps):
    steps_dict = {
        "featurewise_center":False, 
        "samplewise_center":False,
        "featurewise_std_normalization":False, 
        "samplewise_std_normalization":False, 
        "rotation_range":0, 
        "width_shift_range":0.0,
        "height_shift_range":0.0, 
        "shear_range":0.0,
        "zoom_range":0.0,
        "channel_shift_range":0.0,
        "horizontal_flip":False,
        "vertical_flip":False, 
        "rescale":None
    }

    for step in steps:
            step_name = step["name"]
            if "settings" in step: step_settings = step["settings"]
            if step_name == "Center":
                if get_setting(step_settings, "Type") == "Samplewise":
                    steps_dict["samplewise_center"]=True
                else:
                    steps_dict["featurewise_center"]=True
            elif step_name == "STD Normalization":
                if get_setting(step_settings, "Type") == "Samplewise":
                    steps_dict["samplewise_std_normalization"]=True
                else:
                    steps_dict["featurewise_std_normalization"]=True
            elif step_name == "Rotation Range":
                steps_dict["rotation_range"]=float(get_setting(step_settings, "Range"))
            elif step_name == "Width Shift Range":
                steps_dict["width_shift_range"]=float(get_setting(step_settings, "Range"))
            elif step_name == "Height Shift Range":
                steps_dict["height_shift_range"]=float(get_setting(step_settings, "Range"))
            elif step_name == "Shear Range":
                steps_dict["shear_range"]=float(get_setting(step_settings, "Range"))
            elif step_name == "Zoom Range":
                steps_dict["zoom_range"]=float(get_setting(step_settings, "Range"))
            elif step_name == "Channel Shift Range":
                steps_dict["channel_shift_range"]=float(get_setting(step_settings, "Range"))
            elif step_name == "Horizontal Flip":
                steps_dict["horizontal_flip"]=True
            elif step_name == "Vertical Flip":
                steps_dict["vertical_flip"]=True
            elif step_name == "Rescale":
                steps_dict["rescale"]=float(get_setting(step_settings, "Factor"))

    return steps_dict
            