from flask import Flask, request, jsonify, send_file, render_template
from flask import Flask, send_from_directory
import os
from werkzeug.utils import secure_filename
from tabulate import tabulate
import torch
import torchvision
from torchvision import transforms
from torchvision.models.detection import maskrcnn_resnet50_fpn_v2
from torchvision.models.detection.faster_rcnn import FastRCNNPredictor
from torchvision.models.detection.mask_rcnn import MaskRCNNPredictor
import pandas as pd
import numpy as np
from PIL import Image
import random
import torch.nn.functional as F
from flask_cors import CORS
from pymongo import MongoClient
import datetime
import base64
from io import BytesIO
from datetime import datetime


import torch

# Assuming this is already set up somewhere in your code
client = MongoClient("mongodb://mern_user:laiba526@estate-shard-00-00.cjith.mongodb.net:27017,estate-shard-00-01.cjith.mongodb.net:27017,estate-shard-00-02.cjith.mongodb.net:27017/Estate?ssl=true&replicaSet=atlas-110ft0-shard-0&authSource=admin&retryWrites=true&w=majority")
db = client["Estate"]
collection = db["predictions"]

from torchvision.utils import draw_bounding_boxes, draw_segmentation_masks
from flask_cors import CORS


# Move up one directory from "python/" to get to "backend/"
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
RESULTS_FOLDER = os.path.join(BASE_DIR, 'results')

# Initialize the Flask app
app = Flask(__name__)
CORS(app) 



# Set the upload folder and allowed extensions
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['RESULTS_FOLDER'] = RESULTS_FOLDER


# Serve static images from /uploads and /results
@app.route('/uploads/<filename>')
def get_uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/results/<filename>')
def get_result_file(filename):
    return send_from_directory(app.config['RESULTS_FOLDER'], filename)


app.config['ALLOWED_EXTENSIONS'] = {'jpg', 'jpeg', 'png'}

# Ensure the upload directory exists
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB
def resize_with_padding(image, target_size=(2048, 2048)):
    orig_width, orig_height = image.size
    ratio = min(target_size[0] / orig_width, target_size[1] / orig_height)

    new_width = int(orig_width * ratio)
    new_height = int(orig_height * ratio)

    resized_image = image.resize((new_width, new_height), Image.LANCZOS)


    # Create a blank image with target size and paste the resized image
    new_image = Image.new("RGB", target_size, (0, 0, 0))  # Black padding
    new_image.paste(resized_image, ((target_size[0] - new_width) // 2, (target_size[1] - new_height) // 2))

    return new_image
# Device configuration (use CUDA if available, otherwise use CPU)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Define class names (for the number of classes)
class_names = ["background", "Cage", "Cross Arm", "Cross Pattern", "Insulator", "Peak", "Tower Base", "Tower Body"]

# Initialize Mask R-CNN model with pretrained weights
model = maskrcnn_resnet50_fpn_v2(weights=None)

# Get the number of input features for the classifier
in_features_box = model.roi_heads.box_predictor.cls_score.in_features
in_features_mask = model.roi_heads.mask_predictor.conv5_mask.in_channels

# Get the number of output channels for the Mask Predictor
dim_reduced = model.roi_heads.mask_predictor.conv5_mask.out_channels

# Replace the box predictor
model.roi_heads.box_predictor = FastRCNNPredictor(in_channels=in_features_box, num_classes=len(class_names))

# Replace the mask predictor
model.roi_heads.mask_predictor = MaskRCNNPredictor(in_channels=in_features_mask, dim_reduced=dim_reduced, num_classes=len(class_names))
# Set the model's device and data type
model.to(device=device)
# Load the trained model weights
model.load_state_dict(torch.load(
    'model\complete_tower_maskrcnn_resnet50_fpn_v2_augmented706_imgs_epochs320\complete_tower_maskrcnn_resnet50_fpn_v2_augmented706_imgs_epochs320.pth',
    map_location=device))

# Set the model to evaluation mode
model.eval()

# Define the transformation to convert the input image to a tensor
transform = transforms.Compose([transforms.ToTensor()])

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

# Function to process and predict on the uploaded image
def process_image(image_path, email):
    try:
        # Load the image
        print(f"Loading image from path: {image_path}")
        test_img = Image.open(image_path).convert("RGB")
        print(f"Image loaded, size: {test_img.size}")
        # Resize image while maintaining aspect ratio
        test_img = resize_with_padding(test_img)  # Resize and pad
        print(f"Resized Image Size: {test_img.size}")

        input_tensor = transform(test_img).unsqueeze(0).to(device)  # Add batch dimension
        print(f"Tensor shape after transformation: {input_tensor.shape}")
        torch.set_num_threads(1)  # Avoid deadlocks
        model.to("cpu")
        input_tensor = input_tensor.to("cpu")
        # Make a prediction with the model
        with torch.no_grad():                
                model_output = model(input_tensor)
        if model_output:
   
            boxes = model_output[0]['boxes']
            labels = model_output[0]['labels']
            scores = model_output[0]['scores']

        # Set the confidence threshold
        threshold = 0.8

        # Filter out predictions based on the threshold
        scores_mask = model_output[0]['scores'] > threshold
        print(f"Filtered masks, remaining predictions: {scores_mask.sum()}")

        pred_masks = model_output[0]['masks'][scores_mask]
        pred_labels = [class_names[label] for label in model_output[0]['labels'][scores_mask]]
        pred_bboxes = model_output[0]['boxes'][scores_mask]

        # Resize the masks to the original image size
        target_size = (test_img.size[1], test_img.size[0])  # (W, H)
        pred_masks = F.interpolate(pred_masks, size=target_size, mode='bilinear', align_corners=False)
        pred_masks = (pred_masks >= threshold).squeeze(1).bool()

        print(f"Predictions processed. Number of masks: {len(pred_labels)}")
        base_pattern_count = pred_labels.count("Cross Pattern")
        # Get the indices of insulators
        insulator_indices = [i for i, label in enumerate(pred_labels) if label == "Insulator"]
       
       # Select a random insulator if available
        if insulator_indices:
          print(f"Found {len(insulator_indices)} insulators")
          random_insulator_index = random.choice(insulator_indices)
           # Convert tensor values to float and round them
          random_insulator_height = pred_bboxes[random_insulator_index][3].item() - pred_bboxes [random_insulator_index][1].item()  # Height of random insulator
          random_insulator_width = pred_bboxes[random_insulator_index][2].item() - pred_bboxes     [random_insulator_index][0].item()  # Width of random insulator

         # Round to two decimal places
          random_insulator_height = round(random_insulator_height, 2)
          random_insulator_width = round(random_insulator_width, 2)
        else:
          print("No insulator found in the predictions")
          random_insulator_index = None
          random_insulator_height = random_insulator_width = None
           
        print("Annotating the image with predictions...")
        # Define custom color mapping for each class
        # Assuming class_names is a list of category names
        class_namesss = [
            "background",     # ID 0
            "Cage",   # ID 1
            "Cross Arm",           # ID 2
            "Cross Pattern",      # ID 3
            "Insulator",      # ID 4
            "Peak",           # ID 5
            "Tower Base",      # ID 6
            "Tower Body"       #ID 7
        
        ]
        
        # Color mapping for each class
      
        # Color mapping for each class
        int_colors = {
            1: (255, 0, 0),      # Cage (Bright Red)
            2: (0, 255, 0),      # Cross-Arm (Bright Green)
            3: (0, 0, 255),      # Cross Pattern (Bright Blue)
            4: (255, 165, 0),    # Insulator (Orange)
            5: (128, 0, 128),    # Peak (Purple)
            6: (255, 255, 0),    #Tower Base  (Pink)
            7: (0, 255, 255)     # Tower Body (Dark Cyan)
        }

        # Annotate the image with masks, bounding boxes, and labels for all components
        annotated_tensor = input_tensor[0].cpu()

        for i, (label, mask, bbox) in enumerate(zip(pred_labels, pred_masks, pred_bboxes)):

           # Get the class index from class_names (ensure it matches the class label)
           if label in class_namesss:
              class_idx = class_namesss.index(label)
           else:
              class_idx = 0  # Default to 'background' if the label is not found

            # Get the color for this class
           color = int_colors.get(class_idx, (0, 0, 0))  # Default to black if the color is not defined

            # Draw the mask using the defined color
           annotated_tensor = draw_segmentation_masks(image=annotated_tensor, masks=mask.unsqueeze(0), alpha=0.3, colors=[color])

             # Only draw bounding box for the randomly selected insulator
           if label == "Insulator" and i == random_insulator_index:
               x_min, y_min, x_max, y_max = bbox.int()
               annotated_tensor = draw_bounding_boxes(image=annotated_tensor, boxes=torch.tensor([[x_min, y_min, x_max, y_max]]),labels=[f"{label} (Selected)"],colors=[(255, 165, 0)], width=2)  # Orange color for the selected insulator
           elif label != "Insulator":
               x_min, y_min, x_max, y_max = bbox.int()
               annotated_tensor = draw_bounding_boxes(image=annotated_tensor, boxes=torch.tensor([[x_min, y_min, x_max, y_max]]),labels=[label], colors=[color], width=2)
      
             
        print("Finished annotating the image.")
        # Convert the annotated tensor back to an image
        annotated_img = transforms.ToPILImage()(annotated_tensor)

        # Prepare data for component dimensions
        tower_body_heights = []
        cage_heights = []
        peak_heights = []
        tower_body_widths = []
        cage_widths = []

        cross_arm_heights = []
        insulator_heights = []
        insulator_indices = []
        cross_arm_widths = []
        tower_base_heights = []
        tower_base_widths = []

        # Calculate heights and widths for each detected component
        for i, (label, bbox) in enumerate(zip(pred_labels, pred_bboxes)):
           x_min, y_min, x_max, y_max = bbox
           height = y_max - y_min
           width = x_max - x_min

           if label == "Tower Body":
              tower_body_heights.append(height)
              tower_body_widths.append(width)
           elif label == "Cage":
              cage_heights.append(height)
              cage_widths.append(width)
           elif label == "Peak":
              peak_heights.append(height)
           elif label == "Cross Arm":
              cross_arm_heights.append(height)
              cross_arm_widths.append(width)
           elif label == "Insulator":
              insulator_heights.append(height)
              insulator_indices.append(i)
           elif label == "Tower Base":
              tower_base_heights.append(height)
              tower_base_widths.append(width)

        # Prepare prediction data for display in a DataFrame
        dimension_data = {
           "Component": [],
           "Height (pixels)": [],
           "Width (pixels)": [],
           "Mapped Height (cm)": [],
           "Mapped Width (cm)": []
        }

        # Add Cross Arm data
        for i, (height, width) in enumerate(zip(cross_arm_heights, cross_arm_widths)):
           mapped_height = (112 / random_insulator_height) * height
           mapped_width = (mapped_height / height) * width
           dimension_data["Component"].append(f"Cross Arm {i + 1}")
           dimension_data["Height (pixels)"].append(height)
           dimension_data["Width (pixels)"].append(width)
           dimension_data["Mapped Height (cm)"].append(mapped_height)
           dimension_data["Mapped Width (cm)"].append(mapped_width)

        # Add Tower Body data
        for i, (height, width) in enumerate(zip(tower_body_heights, tower_body_widths)):
           mapped_height = (112 / random_insulator_height) * height
           mapped_width = (mapped_height / height) * width
           dimension_data["Component"].append(f"Tower Body")
           dimension_data["Height (pixels)"].append(height)
           dimension_data["Width (pixels)"].append(width)
           dimension_data["Mapped Height (cm)"].append(mapped_height)
           dimension_data["Mapped Width (cm)"].append(mapped_width)

        # Add Cage data
        for i, (height, width) in enumerate(zip(cage_heights, cage_widths)):
           mapped_height = (112 / random_insulator_height) * height
           mapped_width = (mapped_height / height) * width
           dimension_data["Component"].append(f"Cage")
           dimension_data["Height (pixels)"].append(height)
           dimension_data["Width (pixels)"].append(width)
           dimension_data["Mapped Height (cm)"].append(mapped_height)
           dimension_data["Mapped Width (cm)"].append(mapped_width)

        # Add Peak data
        for i, height in enumerate(peak_heights):
           mapped_height = (112 / random_insulator_height) * height
           
           dimension_data["Component"].append(f"Peak")
           dimension_data["Height (pixels)"].append(height)
           dimension_data["Width (pixels)"].append("-")
           dimension_data["Mapped Height (cm)"].append(mapped_height)
           dimension_data["Mapped Width (cm)"].append("-")

        # Add Tower Base data
        for i, (height, width) in enumerate(zip(tower_base_heights, tower_base_widths)):
            mapped_height = (112 / random_insulator_height) * height
            mapped_width = (mapped_height / height) * width
            dimension_data["Component"].append(f"Tower Base")
            dimension_data["Height (pixels)"].append(height)
            dimension_data["Width (pixels)"].append(width)
            dimension_data["Mapped Height (cm)"].append(mapped_height)
            dimension_data["Mapped Width (cm)"].append(mapped_width)
    
        # Convert the dictionary to a pandas DataFrame
        dimension_df = pd.DataFrame(dimension_data)
        
        # Print out the DataFrame and other details
        print(f"Random Insulator Height for mapping: {random_insulator_height:.2f} pixels")
        print(f"Random Insulator Width for mapping: {random_insulator_width:.2f} pixels")
        print("\n")
        print(f"Number of 'Base Pattern' predictions: {base_pattern_count}")
        print("\n")

        print("Final Dimensions Table:")
        print(tabulate(dimension_df, headers='keys', tablefmt='grid'))
      

      
        # ==== Add this block here ====

        def image_to_base64(img):
            buffered = BytesIO()
            img.save(buffered, format="JPEG")
            return base64.b64encode(buffered.getvalue()).decode("utf-8")

        print("Saving results to MongoDB Atlas...")

        try:
            # Convert images to base64
            original_base64 = image_to_base64(test_img)
            annotated_base64 = image_to_base64(annotated_img)

            # Convert tensors to native Python types before saving
            insulator_height_px = random_insulator_height.item() if hasattr(random_insulator_height, 'item') else random_insulator_height
            insulator_width_px = random_insulator_width.item() if hasattr(random_insulator_width, 'item') else random_insulator_width
            
            # Convert tensor values in DataFrame columns to floats
            for col in ['Height (pixels)', 'Width (pixels)', 'Mapped Height (cm)', 'Mapped Width (cm)']:
             dimension_df[col] = dimension_df[col].apply(lambda x: x.item() if hasattr(x, 'item') else x)

            # Prepare MongoDB document
            document = {
                "email": email,
                "original_image": original_base64,
                "annotated_image": annotated_base64,
                "insulator_height_px": insulator_height_px,
                "insulator_width_px": insulator_width_px,
                "cross_pattern_count": base_pattern_count,
                "dimensions": dimension_df.to_dict(orient='records'),
                "timestamp": datetime.utcnow()
            }

            # Insert into MongoDB
            result = collection.insert_one(document)
            print(f"✅ Successfully saved to MongoDB with _id: {result.inserted_id}")
            

        except Exception as mongo_err:
            print(f"❌ Failed to save to MongoDB: {mongo_err}")
            
        # Return the test image, annotated image, and dimension table
        # Inside process_image function before returning
        print(f"Returning images and dimensions: {test_img}, {annotated_img}, {dimension_df.shape}")
        return test_img, annotated_img, dimension_df, random_insulator_height, random_insulator_width, base_pattern_count

    except Exception as e:
        print(f"Error in processing image: {str(e)}")
        raise


@app.route('/predict', methods=['POST'])
def predict():
    try:
        print("Received POST request")
        print(f"Request Files: {request.files}")

        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
        
        email = request.form.get('email')  # <-- new
        if not email:
            return jsonify({'error': 'Email is required'}), 400
        
        # Proceed with image processing...
        print(f"Email received: {email}")

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            # Save file to backend/uploads (not static/)
            upload_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(upload_path)
            print("Image saved tooooo:", upload_path)


            original_img, annotated_img, dimensions, insulator_height, insulator_width, pattern_count = process_image(upload_path,email)

            # Save images
            #original_img_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            result_filename = f"annotated_{filename}"
            result_path = os.path.join(app.config['RESULTS_FOLDER'], result_filename)
            annotated_img.save(result_path)
            print("Image saved to:", result_path)


            
            # Save the original image to uploads folder
            original_img_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            original_img.save(original_img_path)
            

            # Convert tensor values to floats
            dimensions['Height (pixels)'] = dimensions['Height (pixels)'].apply(
                lambda x: round(float(x), 2) if isinstance(x, torch.Tensor) else x)
            dimensions['Width (pixels)'] = dimensions['Width (pixels)'].apply(
                lambda x: round(float(x), 2) if isinstance(x, torch.Tensor) else x)
            dimensions['Mapped Height (cm)'] = dimensions['Mapped Height (cm)'].apply(
                lambda x: round(float(x), 2) if isinstance(x, torch.Tensor) else x)
            dimensions['Mapped Width (cm)'] = dimensions['Mapped Width (cm)'].apply(
                lambda x: round(float(x), 2) if isinstance(x, torch.Tensor) else x)

            dimensions_list = dimensions.to_dict(orient='records')

            return jsonify({
                'original_image': f"/uploads/{filename}",
                'annotated_image': f"/results/{result_filename}",
                'dimensions': dimensions_list,
                'insulator_height': insulator_height,
                'insulator_width': insulator_width,
                'pattern_count': pattern_count
            })

        return jsonify({'error': 'Invalid file format'}), 400

    except Exception as e:
        print(f"Error during prediction: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Route for the home page
# Route for the home page
@app.route('/')
def index():
    return jsonify({'message': 'Backend is running'})  # Simple test response

if __name__ == '__main__':
    app.run(debug=True)
