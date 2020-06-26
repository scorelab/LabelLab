# Documentation for the LabelLab labeller
<br/>

### What is data-labelled data?
<br/>
In machine learning, if you have labeled data, that means your data is marked up, or annotated, to show the target, which is the answer you want your machine learning model to predict. In general, data labeling can refer to tasks that include data tagging, annotation, classification, moderation, transcription, or processing.<br/>
Labeled data highlights data features - or properties, characteristics, or classifications - that can be analyzed for patterns that help predict the target. For example, in the case of LabelLab this labelled data is used to track the path of various forms of wildlife.

### What are the labels in machine learning?
<br/>
Labels are what the human-in-the-loop uses to identify and call out features that are present in the data. It’s critical to choose informative, discriminating, and independent features to label if you want to develop high-performing algorithms in pattern recognition, classification, and regression. Accurately labeled data can provide ground truth for testing and iterating your models.

### What are the benefits of using LabelLab's data labelling tool?
The data enrichment tool one chooses, will significantly influence their ability to scale data labeling. A tool that gives you the flexibility to make changes to your data features and labeling process. It gives you more control over workflow, features, and integration. It also gives you the flexibility to make changes.<br/> 
Some of the highlighting features of it are:<br/>
1. Project planning, process operationalization and project management through the concept of Teams.
2. Easy managemnet of data labels.
3. Easy integration of any format of images.
4. Ease of use of the labeller using shortcuts and zoom features allowing even specific portions of the image to be labelled.
5. Process iteration, such as changes in data feature selection.
6. Making changes to the labelled data easily and making process of data-labelling flexible.
<br/>

## Steps to use LabelLab labeller:
1. First we need to upload an image and then select the `edit` option on the right next to the image.<br/>
![Image of project->images](https://github.com/scorelab/labellab/reference/images/edit-elephant-1.png)
2. Then we need to create labels and give them name according to the users needs and labels can be on two types:<br/>
![Image of labels in project sidebar](https://github.com/scorelab/labellab/reference/images/labels.png)<br/>
* Bounding-box<br/>
![Image of an example of bounding box](https://github.com/scorelab/labellab/reference/images/bounding-box.png)<br/>
* Polygon figure<br/>
![Image of an example of polygon figure](https://github.com/scorelab/labellab/reference/images/polygon.png)
3. The when we open the labeller we can choose any of the above two types of labels to label an image.<br/>
![Image of an example of polygon figure](https://github.com/scorelab/labellab/reference/images/labeller.png)
4. The side bar shows all the different labels available in the project and help us choose frm them.<br/>
![Image of sidebar](https://github.com/scorelab/labellab/reference/images/sidebar.png)
5. the labeller allows the user to zoom in or zoom out in order to label the parts of an image more accurately using the `plus` and `minus` buttons on the labeller screen or the `+` and `-` keys on the keyboard or even double tapping the left mouse.
6. The `back` and `skip` buttons allow us to toggle between different labelled images in a project in a consecutive manner.<br/>
![Image of back-skip button](https://github.com/scorelab/labellab/reference/images/back-skip.png)
7. The watch icon helps us unsee an existing label on an image.<br/>
![Image of back-skip button](https://github.com/scorelab/labellab/reference/images/watch.png)
## Apart from all these functionalities there are many shortcuts available as well.
<br/>

| Shortcut                  | Usage -                                                                                        |
| ------------------------- | ---------------------------------------------------------------------------------------------- |
| `ESC`                     | Unselect a label                                                                               |
| `Delete`                  | Delete a bounding-box or a polygon                                                             |
| `0-9` or `q`,`w`,`e`      | Select a label                                                                                 |
| `CTRL + C`                | Change the label of the selected label from the ones having the same label-type on the sidebar |
| `CTRL + F`                | Complete the polygon                                                                           |

<br/>

>**Note** These shortcuts can also be viewed from the `keyboard` button.
![Image of back-skip button](https://github.com/scorelab/labellab/reference/images/shortcut.png)