
import os
os.environ["OPENCV_AVFOUNDATION_SKIP_AUTH"] = "1"  # Prevents OpenCV GUI errors
os.environ["QT_QPA_PLATFORM"] = "offscreen"  # Ensures OpenCV does not use a GUI-based backend
import streamlit as st
import cv2
import numpy as np
import tempfile
import imageio
import time
import pygame
from gtts import gTTS
from ultralytics import YOLO
from PIL import Image, ImageDraw

# Initialize session state variables
if "detection_count" not in st.session_state:
    st.session_state.detection_count = 0
if "processed_frames" not in st.session_state:
    st.session_state.processed_frames = 0
if "camera_active" not in st.session_state:
    st.session_state.camera_active = False
if "session_start" not in st.session_state:
    st.session_state.session_start = time.time()
if 'theme' not in st.session_state:
    st.session_state.theme = 'light'

# Configure the page layout
st.set_page_config(
    page_title="Underwater Trash Detection",
    page_icon="🌊",
    layout="wide",
    initial_sidebar_state="expanded"
)

st.markdown("""
    <style>
        /* Global styles */
        body {
            background-color: #121212;
            color: #ffffff;
            font-family: 'Arial', sans-serif;
        }

        /* Main container */
        .main {
            background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
            padding: 2rem;
            border-radius: 1rem;
            box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease-in-out;
        }

        /* Header Section */
        .main-header {
            text-align: center;
            padding: 2.5rem;
            background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
            color: white;
            border-radius: 1rem;
            margin-bottom: 2.5rem;
            box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.3);
            transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
        }

        .main-header:hover {
            transform: scale(1.03);
            box-shadow: 0px 8px 20px rgba(30, 64, 175, 0.5);
        }

        .main-header h1 {
            font-size: 2.7rem;
            font-weight: 700;
        }

        .main-header p {
            font-size: 1.2rem;
            opacity: 0.85;
            color: #cbd5e1;
        }

        /* Sidebar Styling */
        [data-testid="stSidebar"] {
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            color: #ffffff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 2px 2px 10px rgba(255, 255, 255, 0.1);
        }

        /* Sidebar Content */
        .css-1d391kg {
            background: rgba(34, 34, 34, 0.9);
            padding: 1.5rem;
            color: #e0e0e0;
            border-radius: 0.5rem;
            backdrop-filter: blur(5px);
        }

        /* Metrics */
        .stMetric {
            background: #242424;
            padding: 1rem;
            border-radius: 0.75rem;
            box-shadow: 0px 2px 8px rgba(255, 255, 255, 0.1);
            color: white;
            transition: transform 0.2s ease-in-out, box-shadow 0.3s ease-in-out;
        }

        .stMetric:hover {
            transform: translateY(-3px);
            box-shadow: 0px 4px 12px rgba(255, 255, 255, 0.2);
        }

        /* Dropdown Styling */
        select {
            background-color: #1e293b !important;
            color: #ffffff !important;
            padding: 10px;
            border-radius: 5px;
            border: 1px solid #64748b;
            font-size: 16px;
            transition: all 0.3s ease-in-out;
        }

        select:hover {
            border-color: #3b82f6;
            box-shadow: 0px 0px 10px rgba(59, 130, 246, 0.5);
        }

        /* Buttons */
        .stButton>button {
            width: 100%;
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            color: white;
            padding: 0.8rem 1.5rem;
            border: none;
            border-radius: 0.5rem;
            font-weight: 600;
            transition: all 0.3s, box-shadow 0.3s ease-in-out;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }

        .stButton>button:hover {
            background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
            box-shadow: 0 4px 12px rgba(255, 255, 255, 0.3);
        }

        /* File Uploader */
        .stFileUploader {
            background: #333;
            padding: 1.5rem;
            border-radius: 0.5rem;
            border: 2px solid #555;
            margin-bottom: 1.5rem;
            transition: border-color 0.3s ease-in-out;
        }

        .stFileUploader:hover {
            border-color: #3b82f6;
        }

        /* Progress Bar */
        .stProgress > div > div {
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            border-radius: 10px;
            transition: width 0.5s ease-in-out;
        }

        /* Expander Styling */
        [data-testid="stExpander"] {
            background: #1e293b;
            color: #ffffff;
            border-radius: 8px;
            transition: all 0.3s ease-in-out;
        }

        [data-testid="stExpander"]:hover {
            box-shadow: 0px 0px 12px rgba(59, 130, 246, 0.5);
        }

        /* Status Indicators */
        .status-active {
            color: #4ade80;
            font-weight: 600;
            text-shadow: 0px 0px 10px rgba(74, 222, 128, 0.7);
        }

        .status-inactive {
            color: #ef4444;
            font-weight: 600;
            text-shadow: 0px 0px 10px rgba(239, 68, 68, 0.7);
        }

        /* Slider */
        .stSlider .st-ae {
            background-color: #303030;
        }

        .stSlider .st-af {
            background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
        }

        /* Hover Effects */
        .stSlider .st-af:hover,
        .stMetric:hover {
            box-shadow: 0px 4px 12px rgba(255, 255, 255, 0.2);
        }
    </style>
""", unsafe_allow_html=True)


# Header
st.markdown("""
    <div class='main-header'>
        <h1>🌊 Underwater Trash Detection</h1>
        <p>Advanced AI-powered system for detecting and monitoring underwater debris</p>
    </div>
""", unsafe_allow_html=True)


# Load YOLO Model
@st.cache_resource
def load_model():
    return YOLO("best1.pt")

model = load_model()

# Sidebar
with st.sidebar:
    
    
    
    # Detection Statistics
    st.markdown("### 📊 Detection Statistics")
    col1, col2 = st.columns(2)
    with col1:
        st.metric("Detections", st.session_state.detection_count)
    with col2:
        st.metric("Frames", st.session_state.processed_frames)
    
    st.markdown("---")
    
    # Session Information
    st.markdown("### ⏱ Session Information")
    elapsed_placeholder = st.empty()
    
    st.markdown("---")
    
    #Mode Selection
    st.markdown("### 🎯 Detection Mode")
    detection_mode = st.selectbox(
        "Choose Detection Mode:",
        ["📂 Upload Frames", "🖼 Upload Image", "🎥 Real-time Camera"],
        key="detection_mode"
    )

    
    # FPS Control
    fps = st.slider("Frames per Second", min_value=1, max_value=30, value=5)
    confidence_threshold = st.sidebar.slider("Confidence Threshold", 0.1, 1.0, 0.5)

def update_elapsed_time():
    elapsed = time.time() - st.session_state.session_start
    minutes, seconds = divmod(int(elapsed), 60)
    elapsed_placeholder.markdown(f"Duration: {minutes:02d}:{seconds:02d}")

def predict_frame(frame):
    results = model(frame)
    detections = 0
    for r in results:
        for box in r.boxes:
            conf = box.conf[0].item()
            if conf < confidence_threshold:  # Apply confidence threshold
                continue  
            detections += 1
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            label = model.model.names[int(box.cls[0])]

            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            text = f"{label} ({conf:.2f})"
            cv2.putText(frame, text, (x1, y1 - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
    
    st.session_state.detection_count += detections
    st.session_state.processed_frames += 1
    return frame
hazardous_trash = {"trash_metal", "trash_rubber", "trash_fishing_gear", "trash_plastic"}
non_hazardous_trash = {"trash_etc", "trash_fabric", "trash_paper", "trash_wood"}
aquatic_life = {"animal_fish", "animal_starfish", "animal_shells", "animal_crab", "animal_eel", "animal_etc", "plant"}

def get_location(x1, y1, x2, y2, img_width, img_height):
    center_x, center_y = (x1 + x2) // 2, (y1 + y2) // 2
    vertical_pos = "top" if center_y < img_height // 3 else "bottom" if center_y > 2 * (img_height // 3) else "center"
    horizontal_pos = "left" if center_x < img_width // 3 else "right" if center_x > 2 * (img_width // 3) else "center"
    return f"{vertical_pos} {horizontal_pos}" if vertical_pos != "center" or horizontal_pos != "center" else "center"

def generate_voice_alert(detections, img_width, img_height):
    if not detections:
        return None
    messages = []
    for class_name, x1, y1, x2, y2 in detections: 
        location = get_location(x1, y1, x2, y2, img_width, img_height)
        readable_name = class_name.replace("_", " ").title()
        if class_name in hazardous_trash:
            messages.append(f"Hazardous trash detected: {readable_name} at {location}.")
        elif class_name in non_hazardous_trash:
            messages.append(f"Non-hazardous trash detected: {readable_name} at {location}.")
        elif class_name in aquatic_life:
            messages.append(f"Aquatic life detected: {readable_name} at {location}. Part of the marine ecosystem.")
    if not messages:
        return None
    alert_text = " ".join(messages)
    temp_audio_path = tempfile.gettempdir() + "/alert_audio.mp3"
    tts = gTTS(text=alert_text, lang="en")
    tts.save(temp_audio_path)

    return temp_audio_path
    
def play_audio(audio_path):
    pygame.mixer.init()
    pygame.mixer.music.load(audio_path)
    pygame.mixer.music.play()
    while pygame.mixer.music.get_busy():
        time.sleep(1)

def draw_detections(image, results):
    draw = ImageDraw.Draw(image, "RGBA")
    img_width, img_height = image.size
    detected_objects = []
    for result in results:
        for box in result.boxes:
            class_id = int(box.cls[0])
            class_name = model.names[class_id]
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            detected_objects.append((class_name, x1, y1, x2, y2))
            box_color, mask_color = ("red", (255, 0, 0, 100)) if class_name in hazardous_trash else ("blue", (0, 0, 255, 100)) if class_name in non_hazardous_trash else ("green", (0, 255, 0, 100)) if class_name in aquatic_life else ("yellow", (255, 255, 0, 100))
            draw.rectangle([x1, y1, x2, y2], outline=box_color, width=3)
            draw.rectangle([x1, y1, x2, y2], fill=mask_color)
            draw.text((x1, y1 - 10), class_name, fill="yellow")
    return image, detected_objects, img_width, img_height

# Main content area
if detection_mode == "📂 Upload Frames":
    with st.container():
        st.markdown("### 📁 Upload Multiple Frames")
        uploaded_files = st.file_uploader(
            "Drag and drop image files here",
            type=["jpg", "jpeg", "png"],
            accept_multiple_files=True
        )

        if uploaded_files:
            frames = []
            progress_bar = st.progress(0)
            st.markdown("### 🔄 Processing Frames")

            # Read all files properly
            images = []
            for file in uploaded_files:
                file_bytes = file.read()  # Read file bytes once
                np_arr = np.frombuffer(file_bytes, np.uint8)
                img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

                if img is None:
                    st.error(f"Error decoding {file.name}. Please upload a valid image.")
                    continue  # Skip this image if there's an issue

                images.append(img)

            if not images:
                st.error("No valid images were uploaded. Please check your files.")
            else:
                # Get reference size from first image
                height, width = images[0].shape[:2]

                for i, img in enumerate(images):
                    img_resized = cv2.resize(img, (width, height))  # Resize all images to match
                    frames.append(predict_frame(img_resized))  # Process resized frame
                    progress_bar.progress((i + 1) / len(images))

                st.markdown("### 🎥 Results")

                # Generate video
                temp_video = tempfile.NamedTemporaryFile(delete=False, suffix=".mp4")
                temp_video_path = temp_video.name
                writer = imageio.get_writer(temp_video_path, fps=fps)

                for frame in frames:
                    writer.append_data(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))

                writer.close()
                temp_video.close()

                # Display video
                st.video(temp_video_path)

                
elif detection_mode == "🖼 Upload Image":
    with st.container():
        st.markdown("### 📸 Upload Single Image")
        uploaded_image = st.file_uploader(
            "Drag and drop an image file here",
            type=["jpg", "jpeg", "png"]
        )

        if uploaded_image:
            # Read file bytes once and store
            file_bytes = uploaded_image.read()

            with st.container():
                st.markdown("### 🔍 Detection Result")
                
                # Convert to NumPy array and decode
                np_bytes = np.asarray(bytearray(file_bytes), dtype=np.uint8)
                img = cv2.imdecode(np_bytes, cv2.IMREAD_COLOR)

                processed_image = predict_frame(img)
                st.image(processed_image, channels="BGR", use_column_width=True)
                
                # Download button
                with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as temp_img:
                    cv2.imwrite(temp_img.name, processed_image)
                    with open(temp_img.name, "rb") as f:
                        st.download_button(
                            label="📥 Download Result",
                            data=f,
                            file_name="detected_image.png",
                            mime="image/png"
                        )

                if st.button("🗣 Generate Speech Image"):
                    results = model(img)  # Ensure `model` is defined and loaded
                    processed_image, detections, img_width, img_height = draw_detections(
                        Image.fromarray(cv2.cvtColor(img, cv2.COLOR_BGR2RGB)), results
                    )
                    st.image(np.array(processed_image), use_column_width=True)

                    audio_path = generate_voice_alert(detections, img_width, img_height)
                    if audio_path:
                        st.audio(audio_path, format="audio/mp3")

elif detection_mode == "🎥 Real-time Camera":
    with st.container():
        st.markdown("### 📹 Real-time Detection")
        
        col1, col2 = st.columns(2)
        with col1:
            start_button = st.button("▶ Start Camera")
        with col2:
            stop_button = st.button("⏹ Stop Camera")
        
        if start_button:
            st.session_state.camera_active = True
        if stop_button:
            st.session_state.camera_active = False
        
        status_text = "✅ Active" if st.session_state.camera_active else "❌ Inactive"
        st.markdown(f"Status: {status_text}")
        
        if st.session_state.camera_active:
            cam = cv2.VideoCapture(0)
            frame_placeholder = st.empty()
            
            while st.session_state.camera_active:
                ret, frame = cam.read()
                if not ret:
                    st.error("❌ Camera error")
                    break
                
                frame = cv2.resize(frame, (1280, 720))
                frame_placeholder.image(predict_frame(frame), channels="BGR")
                update_elapsed_time()
                time.sleep(1/fps)
            
            cam.release()

# Refresh session state
update_elapsed_time()
