import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; 

export interface Detection {
  class_name: string;
  confidence: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  category: string;
  location: string;
}

export interface ImageResponse {
  processed_image: string; // Base64 encoded image
  detections: Detection[];
  detection_count: number;
}

export interface MultipleImagesResponse {
  video_url: string;
  detection_count: number;
  frame_count: number;
  detections: Detection[][];  // Array of detections per frame
}

export interface VideoInfo {
  id: string;
  url: string;
  created_at: number;
  file_size: number;
}

class ApiClient {
  /**
   * Detect objects in a single image
   */
  async detectImage(file: File, confidenceThreshold: number = 0.5): Promise<ImageResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('confidence_threshold', confidenceThreshold.toString());

    try {
      const response = await axios.post<ImageResponse>(
        `${API_BASE_URL}/detect/image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error detecting image:', error);
      throw error;
    }
  }

  /**
   * Process multiple images and combine them into a video
   */
  async processMultipleImages(
    files: File[],
    confidenceThreshold: number = 0.5,
    fps: number = 5
  ): Promise<MultipleImagesResponse> {
    const formData = new FormData();
    
    // Append each file to formData
    files.forEach((file) => {
      formData.append('files', file);
    });
    
    formData.append('confidence_threshold', confidenceThreshold.toString());
    formData.append('fps', fps.toString());

    try {
      const response = await axios.post<MultipleImagesResponse>(
        `${API_BASE_URL}/detect/multiple`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      // Convert relative video URL to absolute URL
      if (response.data.video_url && response.data.video_url.startsWith('/')) {
        response.data.video_url = `${API_BASE_URL}${response.data.video_url}`;
      }
      
      return response.data;
    } catch (error) {
      console.error('Error processing multiple images:', error);
      throw error;
    }
  }

  /**
   * Get a list of all available videos
   */
  async getVideos(): Promise<VideoInfo[]> {
    try {
      const response = await axios.get<VideoInfo[]>(`${API_BASE_URL}/api/videos`);
      
      // Convert all relative URLs to absolute URLs
      const videos = response.data.map(video => ({
        ...video,
        url: video.url.startsWith('/') ? `${API_BASE_URL}${video.url}` : video.url
      }));
      
      return videos;
    } catch (error) {
      console.error('Error fetching videos:', error);
      throw error;
    }
  }
}

export const apiClient = new ApiClient(); 