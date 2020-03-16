# For downloading the image.
import matplotlib.pyplot as plt
# For drawing onto the image.
import numpy as np
import tensorflow as tf
import tensorflow_hub as hub
from PIL import Image, ImageColor, ImageFont, ImageOps

tf.enable_eager_execution()

# Check available GPU devices.
print("The following GPU devices are available: %s" %
      tf.test.gpu_device_name())


def display_image(image):
    fig = plt.figure(figsize=(20, 15))
    plt.grid(False)
    plt.imshow(image)


# def download_image(url):
#   _, filename = tempfile.mkstemp(suffix=".jpg")
#   response = urlopen(url)
#   image_data = response.read()
#   image_data = BytesIO(image_data)
#   return filename, image_data


def resize_image(image_data,
                 filename,
                 new_width=256,
                 new_height=256,
                 display=False):
    # filename, image_data = download_image(url)
    pil_image = Image.open(image_data)
    pil_image = ImageOps.fit(pil_image, (new_width, new_height),
                             Image.ANTIALIAS)
    pil_image_rgb = pil_image.convert("RGB")
    pil_image_rgb.save(filename, format="JPEG", quality=90)
    print("Image downloaded to %s." % filename)
    if display:
        display_image(pil_image)
    return filename


def draw_boxes(image, boxes, class_names, scores, max_boxes=10, min_score=0.1):
    """Overlay labeled boxes on an image with formatted scores and label names."""
    colors = list(ImageColor.colormap.values())

    try:
        font = ImageFont.truetype(
            "/usr/share/fonts/truetype/liberation/LiberationSansNarrow-Regular.ttf",
            25)
    except IOError:
        print("Font not found, using default font.")
        font = ImageFont.load_default()

    for i in range(min(boxes.shape[0], max_boxes)):
        if scores[i] >= min_score:
            ymin, xmin, ymax, xmax = tuple(boxes[i])
            display_str = "{}: {}%".format(class_names[i].decode("ascii"),
                                           int(100 * scores[i]))
            color = colors[hash(class_names[i]) % len(colors)]
            image_pil = Image.fromarray(np.uint8(image)).convert("RGB")
            draw_bounding_box_on_image(image_pil,
                                       ymin,
                                       xmin,
                                       ymax,
                                       xmax,
                                       color,
                                       font,
                                       display_str_list=[display_str])
            np.copyto(image, np.array(image_pil))
    return image


module_handle = "https://tfhub.dev/google/openimages_v4/ssd/mobilenet_v2/1"  # @param ["https://tfhub.dev/google/openimages_v4/ssd/mobilenet_v2/1", "https://tfhub.dev/google/faster_rcnn/openimages_v4/inception_resnet_v2/1"]

detector = hub.load(module_handle).signatures['default']


def load_img(path):
    img = tf.io.read_file(path)
    img = tf.image.decode_jpeg(img, channels=3)
    return img


def run_detector(detector, path):
    img = load_img(path)

    converted_img = tf.image.convert_image_dtype(img,
                                                 tf.float32)[tf.newaxis, ...]

    result = detector(converted_img)

    result = {key: value.numpy() for key, value in result.items()}

    return result["detection_class_entities"]


def mobilenet(image, filename):
    image_path = resize_image(image, filename, 640, 480)
    results = run_detector(detector, image_path)
    return results
