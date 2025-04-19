import os
os.environ["OPENCV_AVFOUNDATION_SKIP_AUTH"] = "1"  # Prevents OpenCV GUI errors
os.environ["QT_QPA_PLATFORM"] = "offscreen"  # Ensures OpenCV does not use a GUI-based backend

import cv2
import numpy as np
import tempfile
import base64
import uuid
import torch
from io import BytesIO
from typing import List, Optional, Dict
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel
from PIL import Image, ImageDraw
from ultralytics import YOLO
import glob
import os.path
import time
import imageio
from datetime import datetime
from pathlib import Path
import shutil

# Initialize FastAPI app
app = FastAPI(
    title="Sea Trash Detection System API",
    description="API for detecting underwater trash using YOLO model",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Create videos directory if it doesn't exist
os.makedirs("videos", exist_ok=True)

# IMPORTANT: First mount /videos and other specific paths before the frontend route
app.mount("/videos", StaticFiles(directory="videos"), name="videos")

# Define API routes BEFORE mounting the frontend static files
@app.get("/api/health")
async def health_check():
    """Health check endpoint for monitoring"""
    return {"status": "healthy", "model_loaded": model is not None}

@app.get("/api/videos")
def list_api_videos():
    """Return a list of processed videos for API consumers"""
    try:
        videos = []
        if os.path.exists("videos"):
            for file in os.listdir("videos"):
                if file.endswith((".mp4", ".avi", ".mov")):
                    video_path = os.path.join("videos", file)
                    video_stats = os.stat(video_path)
                    videos.append(VideoInfo(
                        id=file,
                        url=f"/videos/{file}",
                        created_at=video_stats.st_ctime,
                        file_size=video_stats.st_size
                    ))
        return videos
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing videos: {str(e)}")

@app.get("/api/video/{video_name}")
async def get_api_video(video_name: str):
    """Get a specific video file through the API"""
    video_path = os.path.join("videos", video_name)
    if not os.path.exists(video_path):
        raise HTTPException(status_code=404, detail="Video not found")
    return FileResponse(video_path)

# API-specific root endpoint
@app.get("/api")
def read_api_root():
    return {"status": "Sea Trash Detection System API is running"}

@app.post("/detect/image")
async def detect_image(
    file: UploadFile = File(...),
    confidence_threshold: float = Form(0.5)
):
    # Check if the uploaded file is an image
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file is not an image")
    
    # Read and process the image
    contents = await file.read()
    np_arr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    
    if img is None:
        raise HTTPException(status_code=400, detail="Could not read the image")
    
    # Process the image
    processed_img, detections = process_image(img, confidence_threshold)
    
    # Encode the processed image to base64
    encoded_img = encode_image_to_base64(processed_img)
    
    # Return the results
    return ImageResponse(
        processed_image=encoded_img,
        detections=detections,
        detection_count=len(detections)
    )

@app.post("/detect/multiple")
async def detect_multiple_images(
    files: List[UploadFile] = File(...),
    confidence_threshold: float = Form(0.5),
    fps: int = Form(5)
):
    # Check if there are any files
    if not files:
        raise HTTPException(status_code=400, detail="No files provided")
    
    # Process all images
    frames = []
    all_detections = []  # Store detections for each frame
    total_detections = 0
    
    for file in files:
        if not file.content_type.startswith("image/"):
            continue
            
        contents = await file.read()
        np_arr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        
        if img is None:
            continue
            
        processed_img, detections = process_image(img, confidence_threshold)
        frames.append(processed_img)
        all_detections.append(detections)  # Add this frame's detections to the list
        total_detections += len(detections)
    
    if not frames:
        raise HTTPException(status_code=400, detail="No valid images were processed")
    
    # Generate a video file with a unique name
    video_filename = f"{uuid.uuid4()}.mp4"
    video_path = os.path.join("videos", video_filename)
    
    writer = imageio.get_writer(video_path, fps=fps)
    
    for frame in frames:
        writer.append_data(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
    
    writer.close()
    
    # Return the URL that can be accessed through the web
    video_url = f"/videos/{video_filename}"
    
    return MultipleImagesResponse(
        video_url=video_url,
        detection_count=total_detections,
        frame_count=len(frames),
        detections=all_detections  # Include detections per frame in the response
    )

# IMPORTANT: Mount React frontend assets - these are needed for the React app
app.mount("/assets", StaticFiles(directory="dist/assets"), name="assets")

# Mount the frontend at the root AFTER all API routes are defined
# This ensures React takes priority for the root route
if os.path.exists("dist"):
    app.mount("/", StaticFiles(directory="dist", html=True), name="frontend")
else:
    print("Warning: 'dist' directory not found. Frontend will not be served.")

# Define the categories
hazardous_trash = {"trash_metal", "trash_rubber", "trash_fishing_gear", "trash_plastic"}
non_hazardous_trash = {"trash_etc", "trash_fabric", "trash_paper", "trash_wood"}
aquatic_life = {"animal_fish", "animal_starfish", "animal_shells", "animal_crab", "animal_eel", "animal_etc", "plant"}

# Response models
class Detection(BaseModel):
    class_name: str
    confidence: float
    x1: int
    y1: int
    x2: int
    y2: int
    category: str
    location: str

class ImageResponse(BaseModel):
    processed_image: str  # Base64 encoded image
    detections: List[Detection]
    detection_count: int

class MultipleImagesResponse(BaseModel):
    video_url: str  # URL to processed video
    detection_count: int
    frame_count: int
    detections: List[List[Detection]]  # List of lists of detections

class VideoInfo(BaseModel):
    id: str
    url: str
    created_at: float
    file_size: int  # Size in bytes

# Global variable for our model
model = None

# Patch PyTorch load function to handle newer security restrictions
def safe_load_model(model_path):
    try:
        # Option 1: Try to load with regular settings (no verbose parameter)
        return YOLO(model_path)
    except TypeError as e:
        if "unexpected keyword argument 'verbose'" in str(e):
            print("Caught verbose parameter error, trying without it")
            # The verbose parameter is not supported in this version
            return YOLO(model_path)
        else:
            print(f"Standard loading failed with TypeError: {e}")
            # Option 2: If that fails, monkey patch torch.load
            original_torch_load = torch.load
            
            def patched_torch_load(f, *args, **kwargs):
                kwargs['weights_only'] = False
                return original_torch_load(f, *args, **kwargs)
            
            # Apply the monkey patch
            torch.load = patched_torch_load
            
            try:
                # Try loading with the patched function
                return YOLO(model_path)
            finally:
                # Restore original function regardless of outcome
                torch.load = original_torch_load
    except Exception as e:
        print(f"Model loading failed with error: {e}")
        return None

@app.on_event("startup")
async def startup_event():
    global model
    try:
        # Try to load with our safe loader function
        model_path = "best.pt"
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file {model_path} not found")
        
        model = safe_load_model(model_path)
        print("Model loaded successfully")
    except Exception as e:
        print(f"Error loading model: {e}")
        # Provide a detailed error message, but don't fail startup
        # This allows the API to start even if model loading fails
        # Users will get errors when trying to use detection endpoints

def get_location(x1, y1, x2, y2, img_width, img_height):
    center_x, center_y = (x1 + x2) // 2, (y1 + y2) // 2
    vertical_pos = "top" if center_y < img_height // 3 else "bottom" if center_y > 2 * (img_height // 3) else "center"
    horizontal_pos = "left" if center_x < img_width // 3 else "right" if center_x > 2 * (img_width // 3) else "center"
    return f"{vertical_pos} {horizontal_pos}" if vertical_pos != "center" or horizontal_pos != "center" else "center"

def get_category(class_name):
    if class_name in hazardous_trash:
        return "hazardous_trash"
    elif class_name in non_hazardous_trash:
        return "non_hazardous_trash"
    elif class_name in aquatic_life:
        return "aquatic_life"
    else:
        return "unknown"

def process_image(image, confidence_threshold=0.5):
    global model
    
    # Debug protection in case model failed to load
    if model is None:
        print("Warning: Model not loaded, returning empty detections")
        # Create a copy of the image to avoid modifying the original
        processed_img = image.copy() if isinstance(image, np.ndarray) else image
        # Add a text warning on the image
        if isinstance(processed_img, np.ndarray):
            height, width = processed_img.shape[:2]
            cv2.putText(
                processed_img, 
                "Model not loaded - demo mode", 
                (10, height - 10), 
                cv2.FONT_HERSHEY_SIMPLEX, 
                0.7, 
                (0, 0, 255), 
                2
            )
        return processed_img, []
    
    try:    
        results = model(image)
        detections = []
        img_height, img_width = image.shape[:2]
        
        for r in results:
            for box in r.boxes:
                try:
                    conf = box.conf[0].item()
                    if conf < confidence_threshold:
                        continue
                        
                    class_id = int(box.cls[0])
                    class_name = model.names[class_id]
                    x1, y1, x2, y2 = map(int, box.xyxy[0])
                    
                    # Determine the category and location
                    category = get_category(class_name)
                    location = get_location(x1, y1, x2, y2, img_width, img_height)
                    
                    # Draw on image with category-specific colors
                    if category == 'hazardous_trash':
                        color = (0, 0, 255)  # Red in BGR
                    elif category == 'non_hazardous_trash':
                        color = (0, 165, 255)  # Orange in BGR
                    elif category == 'aquatic_life':
                        color = (0, 255, 0)  # Green in BGR
                    else:
                        color = (255, 255, 255)  # White in BGR
                        
                    cv2.rectangle(image, (x1, y1), (x2, y2), color, 2)
                    text = f"{class_name} ({conf:.2f})"
                    cv2.putText(image, text, (x1, y1 - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
                    
                    # Print debug info for each detection
                    print(f"Detection: {class_name}, category: {category}, confidence: {conf:.2f}")
                    
                    # Add to detections
                    detections.append(Detection(
                        class_name=class_name,
                        confidence=conf,
                        x1=x1, y1=y1, x2=x2, y2=y2,
                        category=category,
                        location=location
                    ))
                except Exception as e:
                    print(f"Error processing detection: {e}")
                    continue
        
        print(f"Total detections found: {len(detections)}")
        return image, detections
    except Exception as e:
        print(f"Error in process_image: {e}")
        # Return original image with error message
        if isinstance(image, np.ndarray):
            height, width = image.shape[:2]
            cv2.putText(
                image, 
                f"Error: {str(e)[:30]}...", 
                (10, height - 10), 
                cv2.FONT_HERSHEY_SIMPLEX, 
                0.7, 
                (0, 0, 255), 
                2
            )
        return image, []

def encode_image_to_base64(image):
    # Convert OpenCV image to PIL Image
    if isinstance(image, np.ndarray):
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        pil_image = Image.fromarray(image)
    else:
        pil_image = image
    
    # Save to buffer
    buffer = BytesIO()
    pil_image.save(buffer, format="JPEG")
    
    # Encode to base64
    img_str = base64.b64encode(buffer.getvalue()).decode('utf-8')
    return f"data:image/jpeg;base64,{img_str}"

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 