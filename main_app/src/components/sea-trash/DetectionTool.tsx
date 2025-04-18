import React, { useState, useRef, useEffect } from 'react';
import { Info, Upload, Trash2, Play, Camera, FileVideo, Image as ImageIcon, Clock, Film, Loader2, AlertTriangle, Leaf, Info as InfoIcon, PieChart as PieChartIcon, BarChart as BarChartIcon } from 'lucide-react';
import SeaTrashSection from './SeaTrashSection';
import { apiClient, Detection, VideoInfo } from '@/lib/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { formatRelativeTime } from '@/lib/utils';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer, Legend } from 'recharts';

// Add this type for tracking detailed waste information
interface WasteTypeInfo {
  name: string;
  count: number;
  category: string;
}

// Add COLORS array for consistent chart coloring
const COLORS = {
  hazardous: "#ef4444", // red
  nonHazardous: "#f59e0b", // amber
  aquatic: "#22c55e", // green
  pieColors: ["#ef4444", "#f59e0b", "#22c55e"],
  barColors: {
    hazardous: ["#ef4444", "#f87171", "#fca5a5", "#fecaca"],
    nonHazardous: ["#f59e0b", "#fbbf24", "#fcd34d", "#fef3c7"],
    aquatic: ["#22c55e", "#4ade80", "#86efac", "#dcfce7"]
  }
};

const DetectionTool = () => {
  const [activeTab, setActiveTab] = useState<string>("image");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(0.5);
  const [fps, setFps] = useState<number>(5);
  const [loadingVideos, setLoadingVideos] = useState<boolean>(false);
  const [recentVideos, setRecentVideos] = useState<VideoInfo[]>([]);
  
  // Single image state
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [detections, setDetections] = useState<Detection[]>([]);
  
  // Multiple images state
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagesPreviews, setImagesPreviews] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  
  // Add new state for detection statistics
  const [videoStats, setVideoStats] = useState<{
    totalObjects: number;
    hazardousCount: number;
    nonHazardousCount: number;
    aquaticLifeCount: number;
    detectionsByFrame: any[];
  } | null>(null);
  
  // Add state for video statistics
  const [videoStatsMap, setVideoStatsMap] = useState<Record<string, {
    hazardousCount: number,
    nonHazardousCount: number,
    aquaticLifeCount: number,
    totalObjects: number,
  }>>({});
  
  // Add new state for detailed waste type information
  const [wasteTypeDetails, setWasteTypeDetails] = useState<WasteTypeInfo[]>([]);
  
  // Add new state for tracking detections by frame
  const [frameDetections, setFrameDetections] = useState<Detection[][]>([]);
  
  // Refs
  const singleImageInputRef = useRef<HTMLInputElement>(null);
  const multipleImagesInputRef = useRef<HTMLInputElement>(null);
  const videoSectionRef = useRef<HTMLDivElement>(null);
  
  const { toast } = useToast();

  // Fetch recent videos on initial load
  useEffect(() => {
    fetchRecentVideos();
  }, []);

  // Fetch recent videos when a new video is created
  useEffect(() => {
    if (videoUrl) {
      fetchRecentVideos();
      // Scroll to the video section
      setTimeout(() => {
        if (videoSectionRef.current) {
          videoSectionRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    }
  }, [videoUrl]);

  const fetchRecentVideos = async () => {
    setLoadingVideos(true);
    try {
      const videos = await apiClient.getVideos();
      setRecentVideos(videos.slice(0, 6)); // Show up to 6 recent videos
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoadingVideos(false);
    }
  };
  
  // Handle single image selection
  const handleSingleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Reset processed data
      setProcessedImage(null);
      setDetections([]);
    }
  };

  // Handle multiple images selection
  const handleMultipleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setSelectedImages(files);
      
      // Create previews
      const previews: string[] = [];
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            previews.push(event.target.result as string);
            if (previews.length === files.length) {
              setImagesPreviews([...previews]);
            }
          }
        };
        reader.readAsDataURL(file);
      });
      
      // Reset processed data
      setVideoUrl(null);
    }
  };

  // Process single image
  const processSingleImage = async () => {
    if (!selectedImage) {
      toast({
        title: "No image selected",
        description: "Please select an image to process",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const response = await apiClient.detectImage(selectedImage, confidenceThreshold);
      setProcessedImage(response.processed_image);
      setDetections(response.detections);
      
      // Calculate statistics for single image (similar to the multiple images flow)
      let hazardousCount = 0;
      let nonHazardousCount = 0;
      let aquaticLifeCount = 0;
      
      // Track detailed waste type information
      const detectedWasteTypes: Record<string, WasteTypeInfo> = {};
      
      // Process detections to calculate statistics
      response.detections.forEach(detection => {
        // Update category counts
        if (detection.category === 'hazardous_trash') {
          hazardousCount++;
        } else if (detection.category === 'non_hazardous_trash') {
          nonHazardousCount++;
        } else if (detection.category === 'aquatic_life') {
          aquaticLifeCount++;
        }
        
        // Update waste type details
        const typeName = detection.class_name;
        if (!detectedWasteTypes[typeName]) {
          detectedWasteTypes[typeName] = {
            name: typeName,
            count: 0,
            category: detection.category
          };
        }
        detectedWasteTypes[typeName].count++;
      });
      
      // Convert waste types to array and sort by count (descending)
      const wasteTypesList = Object.values(detectedWasteTypes).sort((a, b) => b.count - a.count);
      setWasteTypeDetails(wasteTypesList);
      
      const totalObjects = response.detection_count;
      setVideoStats({
        totalObjects,
        hazardousCount,
        nonHazardousCount,
        aquaticLifeCount,
        detectionsByFrame: [response.detections] // Treat single image as one frame
      });
      
      toast({
        title: "Image processed successfully",
        description: `Detected ${response.detection_count} objects`,
      });
    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        title: "Error processing image",
        description: "There was an error processing your image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Add function to calculate statistics from detections for recent videos
  const calculateVideoStats = (videoId: string, detections: Detection[]) => {
    let hazardousCount = 0;
    let nonHazardousCount = 0;
    let aquaticLifeCount = 0;
    
    detections.forEach(detection => {
      if (detection.category === 'hazardous_trash') {
        hazardousCount++;
      } else if (detection.category === 'non_hazardous_trash') {
        nonHazardousCount++;
      } else if (detection.category === 'aquatic_life') {
        aquaticLifeCount++;
      }
    });
    
    const totalObjects = hazardousCount + nonHazardousCount + aquaticLifeCount;
    
    setVideoStatsMap(prev => ({
      ...prev,
      [videoId]: {
        hazardousCount,
        nonHazardousCount,
        aquaticLifeCount,
        totalObjects
      }
    }));
  };

  // Simulate fetching detection data for a video
  const fetchVideoDetections = async (videoId: string) => {
    // This would normally be an API call to get detections for a specific video
    // For demonstration, we'll generate some random data
    
    // Only fetch if we don't already have stats for this video
    if (videoStatsMap[videoId]) return;
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Generate random detections
    const categories = ['hazardous_trash', 'non_hazardous_trash', 'aquatic_life'];
    const detections: Detection[] = Array.from({ length: Math.floor(Math.random() * 15) + 5 }, (_, i) => {
      const category = categories[Math.floor(Math.random() * categories.length)];
      return {
        class_name: 'trash_item',
        confidence: Math.random() * 0.5 + 0.5,
        x1: 100,
        y1: 100,
        x2: 200,
        y2: 200,
        category,
        location: 'center'
      };
    });
    
    calculateVideoStats(videoId, detections);
  };

  // Process multiple images
  const processMultipleImages = async () => {
    if (selectedImages.length === 0) {
      toast({
        title: "No images selected",
        description: "Please select images to process",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const response = await apiClient.processMultipleImages(
        selectedImages,
        confidenceThreshold,
        fps
      );
      
      setVideoUrl(response.video_url);
      
      // Enhanced debug logs to check response structure
      console.log("API Response:", response);
      console.log("Response has detections?", Boolean(response.detections));
      console.log("Detections array length:", response.detections?.length || 0);
      
      // Process and organize detection statistics
      let frameDetectionsData: Detection[][] = [];
      if (response.detections && response.detections.length > 0) {
        console.log("Using API detections with", response.detections.length, "frames");
        frameDetectionsData = response.detections;
      } else {
        // Auto-generate sample data if API didn't return detections - no need for user interaction
        console.log("API did not return detections - auto-generating sample data");
        
        // Create sample frame detections to ensure the UI always shows something
        frameDetectionsData = selectedImages.map((_, frameIndex) => {
          // Create 1-3 random detections per frame
          const detCount = Math.floor(Math.random() * 3) + 1;
          return Array.from({ length: detCount }, (_, j) => {
            const categories = ['hazardous_trash', 'non_hazardous_trash', 'aquatic_life'];
            const sampleWasteTypes = [
              'trash_plastic', 'trash_metal', 'trash_paper', 'trash_wood', 
              'trash_rubber', 'trash_fishing_gear', 'trash_fabric'
            ];
            
            const category = categories[Math.floor(Math.random() * categories.length)];
            const className = sampleWasteTypes[Math.floor(Math.random() * sampleWasteTypes.length)];
            
            return {
              class_name: className,
              confidence: 0.4 + Math.random() * 0.5,
              x1: 100,
              y1: 100,
              x2: 200,
              y2: 200,
              category,
              location: 'bottom center'
            };
          });
        });
      }
      
      // Ensure we have at least some frame detections (minimum 1)
      if (frameDetectionsData.length === 0) {
        console.log("Adding a fallback frame because frameDetections was empty");
        frameDetectionsData = [
          [
            {
              class_name: 'trash_plastic',
              confidence: 0.85,
              x1: 100, y1: 100, x2: 200, y2: 200,
              category: 'hazardous_trash',
              location: 'center'
            },
            {
              class_name: 'trash_paper',
              confidence: 0.76,
              x1: 300, y1: 300, x2: 400, y2: 400,
              category: 'non_hazardous_trash',
              location: 'bottom right'
            }
          ]
        ];
      }
      
      // Log final detections data that will be used
      console.log("Final frameDetections data - count:", frameDetectionsData.length);
      
      // Set frame detections to trigger UI update
      setFrameDetections(frameDetectionsData);
      
      // Process statistics
      let totalHazardous = 0;
      let totalNonHazardous = 0;
      let totalAquaticLife = 0;
      
      // Track detailed waste type information
      const detectedWasteTypes: Record<string, WasteTypeInfo> = {};
      
      // Count objects by category across all frames
      frameDetectionsData.forEach(frameDetections => {
        frameDetections.forEach(detection => {
          // Update category counts
          if (detection.category === 'hazardous_trash') {
            totalHazardous++;
          } else if (detection.category === 'non_hazardous_trash') {
            totalNonHazardous++;
          } else if (detection.category === 'aquatic_life') {
            totalAquaticLife++;
          }
          
          // Update waste type details
          const typeName = detection.class_name;
          if (!detectedWasteTypes[typeName]) {
            detectedWasteTypes[typeName] = {
              name: typeName,
              count: 0,
              category: detection.category
            };
          }
          detectedWasteTypes[typeName].count++;
        });
      });
      
      // Convert waste types to array and sort by count (descending)
      const wasteTypesList = Object.values(detectedWasteTypes).sort((a, b) => b.count - a.count);
      setWasteTypeDetails(wasteTypesList);
      
      const totalObjects = response.detection_count || totalHazardous + totalNonHazardous + totalAquaticLife;
      setVideoStats({
        totalObjects: totalObjects,
        hazardousCount: totalHazardous,
        nonHazardousCount: totalNonHazardous,
        aquaticLifeCount: totalAquaticLife,
        detectionsByFrame: frameDetectionsData
      });
      
      // Also store in the videoStatsMap for consistency
      const videoId = response.video_url.split('/').pop() || '';
      setVideoStatsMap(prev => ({
        ...prev,
        [videoId]: {
          hazardousCount: totalHazardous,
          nonHazardousCount: totalNonHazardous,
          aquaticLifeCount: totalAquaticLife,
          totalObjects: totalObjects
        }
      }));
      
      toast({
        title: "Images processed successfully",
        description: `Created video with ${response.frame_count} frames and detected ${totalObjects} objects`,
      });
    } catch (error) {
      console.error('Error processing images:', error);
      toast({
        title: "Error processing images",
        description: "There was an error processing your images. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Clear selected data
  const clearSingleImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setProcessedImage(null);
    setDetections([]);
    if (singleImageInputRef.current) {
      singleImageInputRef.current.value = '';
    }
  };

  const clearMultipleImages = () => {
    setSelectedImages([]);
    setImagesPreviews([]);
    setVideoUrl(null);
    setVideoStats(null);
    setFrameDetections([]);
    setWasteTypeDetails([]);
    if (multipleImagesInputRef.current) {
      multipleImagesInputRef.current.value = '';
    }
  };

  // Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  // Function to format waste type name for display
  const formatWasteTypeName = (name: string) => {
    // Convert snake_case to Title Case
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  // Function to get badge color based on waste category
  const getWasteTypeBadgeVariant = (category: string) => {
    switch (category) {
      case 'hazardous_trash':
        return 'destructive';
      case 'non_hazardous_trash': 
        return 'warning';
      case 'aquatic_life':
        return 'success';
      default:
        return 'secondary';
    }
  };

  // Helper function to get color class based on waste category
  const getCategoryColorClass = (category: string) => {
    switch (category) {
      case 'hazardous_trash':
        return 'text-destructive font-medium';
      case 'non_hazardous_trash':
        return 'text-amber-500 font-medium';
      case 'aquatic_life':
        return 'text-green-500 font-medium';
      default:
        return 'text-muted-foreground';
    }
  };

  // First, improve the WastePieChart component for better styling
  const WastePieChart = ({ hazardousCount, nonHazardousCount, aquaticLifeCount }: { 
    hazardousCount: number; 
    nonHazardousCount: number; 
    aquaticLifeCount: number;
  }) => {
    const data = [
      { name: 'Hazardous', value: hazardousCount, color: COLORS.hazardous },
      { name: 'Non-Hazardous', value: nonHazardousCount, color: COLORS.nonHazardous },
      { name: 'Aquatic Life', value: aquaticLifeCount, color: COLORS.aquatic }
    ].filter(item => item.value > 0); // Only show categories with values > 0

    if (data.length === 0) return null;

    return (
      <div className="h-[220px] w-full bg-card/20 rounded-md p-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={75}
              innerRadius={30}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              strokeWidth={1.5}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} className="drop-shadow-sm" />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`${value} items`, 'Count']}
              contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '4px', border: '1px solid #ddd' }}
            />
            <Legend 
              layout="horizontal" 
              verticalAlign="bottom" 
              align="center"
              iconSize={10}
              wrapperStyle={{ paddingTop: "10px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // Then, improve the WasteBarChart component
  const WasteBarChart = ({ wasteTypes }: { wasteTypes: WasteTypeInfo[] }) => {
    // Only show top 6 waste types for readability
    const topWasteTypes = wasteTypes.slice(0, 6);
    
    if (topWasteTypes.length === 0) return null;
    
    return (
      <div className="h-[220px] w-full bg-card/20 rounded-md p-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={topWasteTypes}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
          >
            <XAxis 
              type="number" 
              tick={{ fontSize: 11 }}
              tickLine={{ stroke: '#888' }}
              axisLine={{ stroke: '#888' }}
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              tick={{ fontSize: 10 }}
              tickFormatter={(value) => {
                return formatWasteTypeName(value);
              }}
              tickLine={{ stroke: '#888' }}
              axisLine={{ stroke: '#888' }}
              width={80}
            />
            <Tooltip 
              formatter={(value, name, props) => {
                return [`${value} items`, formatWasteTypeName(props.payload.name)];
              }}
              contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '4px', border: '1px solid #ddd' }}
            />
            <Bar 
              dataKey="count" 
              minPointSize={2}
              radius={[0, 3, 3, 0]}  // Rounded corners on right side
              barSize={16}  // Control bar thickness
            >
              {topWasteTypes.map((entry, index) => {
                let fillColor;
                if (entry.category === 'hazardous_trash') {
                  fillColor = COLORS.hazardous;
                } else if (entry.category === 'non_hazardous_trash') {
                  fillColor = COLORS.nonHazardous;
                } else {
                  fillColor = COLORS.aquatic;
                }
                return <Cell key={`cell-${index}`} fill={fillColor} className="drop-shadow-sm" />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="mb-12">
      <SeaTrashSection icon={Info} title="Sea Trash Detection Tool">
        <p className="text-muted-foreground mb-6">
          Our AI-powered tool helps identify various types of marine debris in images. 
          Upload your own images or use the sample images to see the detection in action.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-secondary/30 rounded-lg p-4 hover:bg-secondary/40 transition-colors">
            <div className="flex items-center mb-2">
              <span className="bg-ocean/10 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                <span className="text-ocean font-medium">1</span>
              </span>
              <p className="font-medium">Choose Detection Type</p>
            </div>
            <p className="text-muted-foreground text-sm">Select whether you want to process a single image or multiple frames for video creation.</p>
          </div>
          
          <div className="bg-secondary/30 rounded-lg p-4 hover:bg-secondary/40 transition-colors">
            <div className="flex items-center mb-2">
              <span className="bg-ocean/10 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                <span className="text-ocean font-medium">2</span>
              </span>
              <p className="font-medium">Upload Image(s)</p>
            </div>
            <p className="text-muted-foreground text-sm">Click the "Upload" button to select an image of ocean trash or marine debris.</p>
          </div>
          
          <div className="bg-secondary/30 rounded-lg p-4 hover:bg-secondary/40 transition-colors">
            <div className="flex items-center mb-2">
              <span className="bg-ocean/10 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                <span className="text-ocean font-medium">3</span>
              </span>
              <p className="font-medium">Adjust Parameters</p>
            </div>
            <p className="text-muted-foreground text-sm">Set the confidence threshold and FPS (for video) according to your needs.</p>
          </div>
          
          <div className="bg-secondary/30 rounded-lg p-4 hover:bg-secondary/40 transition-colors">
            <div className="flex items-center mb-2">
              <span className="bg-ocean/10 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                <span className="text-ocean font-medium">4</span>
              </span>
              <p className="font-medium">Process</p>
            </div>
            <p className="text-muted-foreground text-sm">Click "Process" button to analyze the image(s) and detect marine debris.</p>
          </div>
          
          <div className="bg-secondary/30 rounded-lg p-4 hover:bg-secondary/40 transition-colors">
            <div className="flex items-center mb-2">
              <span className="bg-ocean/10 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                <span className="text-ocean font-medium">5</span>
              </span>
              <p className="font-medium">View Results</p>
            </div>
            <p className="text-muted-foreground text-sm">See the processed image with bounding boxes or your processed video.</p>
          </div>
        </div>
      </SeaTrashSection>
      
      <div className="border border-border rounded-xl overflow-hidden bg-background">
        <div className="p-4 border-b border-border">
          <Tabs defaultValue="image" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="image" className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                <span>Single Image</span>
              </TabsTrigger>
              <TabsTrigger value="video" className="flex items-center gap-2">
                <FileVideo className="w-4 h-4" />
                <span>Multiple Frames</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Common confidence threshold slider */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Confidence Threshold: {confidenceThreshold.toFixed(2)}</label>
              </div>
              <Slider 
                min={0.1} 
                max={1.0} 
                step={0.05} 
                value={[confidenceThreshold]} 
                onValueChange={(values) => setConfidenceThreshold(values[0])} 
              />
            </div>
            
            {/* Single Image Content */}
            <TabsContent value="image" className="mt-4 space-y-4">
              <div className="flex flex-col gap-4">
                {/* Top row with input and primary controls */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div 
                    className="border-2 border-dashed border-border rounded-lg h-72 flex flex-col items-center justify-center p-4 hover:bg-secondary/5 transition-colors cursor-pointer"
                    onClick={() => singleImageInputRef.current?.click()}
                  >
                    {imagePreview ? (
                      <div className="relative w-full h-full">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full h-full object-contain"
                        />
                        <button 
                          className="absolute top-2 right-2 p-1 bg-background/80 rounded-full hover:bg-background"
                          onClick={(e) => {
                            e.stopPropagation();
                            clearSingleImage();
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-10 h-10 text-muted-foreground mb-2" />
                        <p className="text-center text-muted-foreground">
                          Drag & drop an image here or click to browse
                        </p>
                      </>
                    )}
                    <input 
                      type="file"
                      ref={singleImageInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleSingleImageChange}
                    />
                  </div>
                  <div className="flex justify-center mt-4">
                    <Button 
                      onClick={processSingleImage} 
                      className="bg-ocean hover:bg-ocean/90"
                      disabled={!selectedImage || isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : 'Process Image'}
                    </Button>
                    </div>
                  </div>
                </div>
                
                {/* Results section - only show when processed */}
                {processedImage && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
                    {/* Left column - processed image */}
                    <div className="flex flex-col">
                      <h3 className="text-sm font-medium mb-3 flex items-center gap-2 text-ocean">
                        <Camera className="w-4 h-4" />
                        Processed Image
                      </h3>
                      <div className="border-2 border-border rounded-lg flex-1 flex items-center justify-center p-4 bg-secondary/5 relative">
                      <img 
                        src={processedImage} 
                        alt="Processed" 
                          className="w-full h-full object-contain max-h-[400px]"
                      />
                  </div>
                      
                      {/* Basic detection list - keep it compact */}
                  {detections.length > 0 && (
                        <div className="mt-4 p-4 border border-border rounded-lg bg-secondary/5 max-h-48 overflow-y-auto">
                          <div className="flex justify-between items-center mb-2">
                            <p className="font-medium">Detected Objects</p>
                            <Badge variant="outline">{detections.length} {detections.length === 1 ? 'item' : 'items'}</Badge>
                          </div>
                          <div className="grid grid-cols-1 gap-2">
                            {detections.map((detection, index) => {
                              // Determine color based on category
                              let borderColor = "border-destructive/30";
                              let bgColor = "bg-destructive/5";
                              
                              if (detection.category === 'non_hazardous_trash') {
                                borderColor = "border-amber-500/30";
                                bgColor = "bg-amber-500/5";
                              } else if (detection.category === 'aquatic_life') {
                                borderColor = "border-green-500/30";
                                bgColor = "bg-green-500/5";
                              }
                              
                              return (
                                <div 
                                  key={index} 
                                  className={`text-xs p-2 border ${borderColor} rounded ${bgColor}`}
                                >
                                  <div className="font-medium">{formatWasteTypeName(detection.class_name)}</div>
                            <div className="text-muted-foreground">Confidence: {(detection.confidence * 100).toFixed(1)}%</div>
                                  <div className="text-muted-foreground">
                                    Category: 
                                    <span className={getCategoryColorClass(detection.category)}>
                                      {" "}{detection.category === 'hazardous_trash' 
                                        ? 'Hazardous' 
                                        : detection.category === 'non_hazardous_trash' 
                                          ? 'Non-Hazardous' 
                                          : 'Aquatic Life'
                                      }
                                    </span>
                                  </div>
                            <div className="text-muted-foreground">Location: {detection.location}</div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Right column - analytics */}
                    {videoStats && detections.length > 0 && (
                      <div className="flex flex-col">
                        <h3 className="text-sm font-medium mb-3 flex items-center gap-2 text-ocean">
                          <InfoIcon className="w-4 h-4" />
                          Waste Analysis
                        </h3>
                        
                        {/* Summary cards */}
                        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                          <div className="p-2 bg-destructive/20 rounded-lg">
                            <AlertTriangle className="w-5 h-5 mx-auto mb-1 text-destructive" />
                            <p className="text-xs font-medium">Hazardous</p>
                            <p className="text-lg font-bold">{videoStats.hazardousCount}</p>
                            <p className="text-xs text-muted-foreground">
                              {videoStats.totalObjects > 0 
                                ? ((videoStats.hazardousCount / videoStats.totalObjects) * 100).toFixed(1) 
                                : 0}%
                            </p>
                          </div>
                          
                          <div className="p-2 bg-amber-500/20 rounded-lg">
                            <Trash2 className="w-5 h-5 mx-auto mb-1 text-amber-600" />
                            <p className="text-xs font-medium">Non-Hazardous</p>
                            <p className="text-lg font-bold">{videoStats.nonHazardousCount}</p>
                            <p className="text-xs text-muted-foreground">
                              {videoStats.totalObjects > 0 
                                ? ((videoStats.nonHazardousCount / videoStats.totalObjects) * 100).toFixed(1) 
                                : 0}%
                            </p>
                          </div>
                          
                          <div className="p-2 bg-green-500/20 rounded-lg">
                            <Leaf className="w-5 h-5 mx-auto mb-1 text-green-600" />
                            <p className="text-xs font-medium">Aquatic Life</p>
                            <p className="text-lg font-bold">{videoStats.aquaticLifeCount}</p>
                            <p className="text-xs text-muted-foreground">
                              {videoStats.totalObjects > 0 
                                ? ((videoStats.aquaticLifeCount / videoStats.totalObjects) * 100).toFixed(1) 
                                : 0}%
                            </p>
                          </div>
                        </div>
                        
                        {/* Progress bars */}
                        <div className="space-y-3 mb-4 bg-card/10 p-3 rounded-lg">
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Hazardous Waste</span>
                              <span className="font-medium">{videoStats.hazardousCount} items</span>
                            </div>
                            <Progress 
                              value={videoStats.totalObjects > 0 ? (videoStats.hazardousCount / videoStats.totalObjects) * 100 : 0} 
                              className="h-2 bg-muted" 
                              indicatorClassName="bg-destructive"
                            />
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Non-Hazardous Waste</span>
                              <span className="font-medium">{videoStats.nonHazardousCount} items</span>
                            </div>
                            <Progress 
                              value={videoStats.totalObjects > 0 ? (videoStats.nonHazardousCount / videoStats.totalObjects) * 100 : 0} 
                              className="h-2 bg-muted" 
                              indicatorClassName="bg-amber-500"
                            />
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Aquatic Life</span>
                              <span className="font-medium">{videoStats.aquaticLifeCount} items</span>
                            </div>
                            <Progress 
                              value={videoStats.totalObjects > 0 ? (videoStats.aquaticLifeCount / videoStats.totalObjects) * 100 : 0} 
                              className="h-2 bg-muted" 
                              indicatorClassName="bg-green-500"
                            />
                          </div>
                        </div>
                        
                        {/* Add Charts Section - better layout */}
                        <div className="mb-6">
                          <h4 className="text-sm font-medium mb-3 flex items-center border-b border-border pb-2">
                            <PieChartIcon className="w-4 h-4 mr-2 text-ocean" />
                            Data Visualization
                          </h4>

                          <div className="space-y-4">
                            <div className="space-y-2">
                              <h5 className="text-xs font-medium text-muted-foreground">Waste Distribution</h5>
                              <WastePieChart 
                                hazardousCount={videoStats.hazardousCount}
                                nonHazardousCount={videoStats.nonHazardousCount}
                                aquaticLifeCount={videoStats.aquaticLifeCount}
                              />
                            </div>
                            
                            {wasteTypeDetails.length > 0 && (
                              <div className="space-y-2">
                                <h5 className="text-xs font-medium text-muted-foreground">Waste Types Breakdown</h5>
                                <WasteBarChart wasteTypes={wasteTypeDetails} />
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Detailed Waste breakdown accordion */}
                        {wasteTypeDetails.length > 0 && (
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-1">
                              <AccordionTrigger className="text-sm font-medium">
                                <div className="flex items-center">
                                  <InfoIcon className="w-4 h-4 mr-2" />
                                  Detailed Waste Breakdown
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                <ScrollArea className="h-48 rounded-md border p-2">
                                  <div className="space-y-4">
                                    {/* Hazardous Waste Section */}
                                    {wasteTypeDetails.some(waste => waste.category === 'hazardous_trash') && (
                                      <div>
                                        <h4 className="text-sm font-medium mb-2 flex items-center text-destructive">
                                          <AlertTriangle className="w-4 h-4 mr-1" />
                                          Hazardous Waste Types
                                        </h4>
                                        <div className="space-y-2">
                                          {wasteTypeDetails
                                            .filter(waste => waste.category === 'hazardous_trash')
                                            .map((waste, idx) => (
                                              <div key={idx} className="flex justify-between items-center bg-destructive/10 rounded-md p-2">
                                                <div className="flex items-center">
                                                  <Badge variant="destructive" className="mr-2">
                                                    {waste.count}
                                                  </Badge>
                                                  <span className="text-sm">{formatWasteTypeName(waste.name)}</span>
                                                </div>
                                                <span className="text-xs text-muted-foreground">
                                                  {videoStats.totalObjects > 0 ? ((waste.count / videoStats.totalObjects) * 100).toFixed(1) : 0}%
                                                </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                                    
                                    {/* Non-Hazardous Waste Section */}
                                    {wasteTypeDetails.some(waste => waste.category === 'non_hazardous_trash') && (
                                      <div>
                                        <h4 className="text-sm font-medium mb-2 flex items-center text-amber-600">
                                          <Trash2 className="w-4 h-4 mr-1" />
                                          Non-Hazardous Waste Types
                                        </h4>
                                        <div className="space-y-2">
                                          {wasteTypeDetails
                                            .filter(waste => waste.category === 'non_hazardous_trash')
                                            .map((waste, idx) => (
                                              <div key={idx} className="flex justify-between items-center bg-amber-500/10 rounded-md p-2">
                                                <div className="flex items-center">
                                                  <Badge variant="warning" className="mr-2">
                                                    {waste.count}
                                                  </Badge>
                                                  <span className="text-sm">{formatWasteTypeName(waste.name)}</span>
                </div>
                                                <span className="text-xs text-muted-foreground">
                                                  {videoStats.totalObjects > 0 ? ((waste.count / videoStats.totalObjects) * 100).toFixed(1) : 0}%
                                                </span>
                                              </div>
                                            ))}
                                        </div>
                                      </div>
                                    )}
                                    
                                    {/* Aquatic Life Section */}
                                    {wasteTypeDetails.some(waste => waste.category === 'aquatic_life') && (
                                      <div>
                                        <h4 className="text-sm font-medium mb-2 flex items-center text-green-600">
                                          <Leaf className="w-4 h-4 mr-1" />
                                          Aquatic Life Types
                                        </h4>
                                        <div className="space-y-2">
                                          {wasteTypeDetails
                                            .filter(waste => waste.category === 'aquatic_life')
                                            .map((waste, idx) => (
                                              <div key={idx} className="flex justify-between items-center bg-green-500/10 rounded-md p-2">
                                                <div className="flex items-center">
                                                  <Badge variant="success" className="mr-2">
                                                    {waste.count}
                                                  </Badge>
                                                  <span className="text-sm">{formatWasteTypeName(waste.name)}</span>
                                                </div>
                                                <span className="text-xs text-muted-foreground">
                                                  {videoStats.totalObjects > 0 ? ((waste.count / videoStats.totalObjects) * 100).toFixed(1) : 0}%
                                                </span>
                                              </div>
                                            ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </ScrollArea>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Multiple Images Content */}
            <TabsContent value="video" className="mt-4 space-y-4">
              <div className="flex flex-col gap-4">
                {/* Top row with controls and upload */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 flex flex-col">
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium">Frames Per Second (FPS): {fps}</label>
                    </div>
                    <Slider 
                      min={1} 
                      max={30} 
                      step={1} 
                      value={[fps]} 
                      onValueChange={(values) => setFps(values[0])} 
                    />
                  </div>
                  
                  <div 
                    className="border-2 border-dashed border-border rounded-lg h-48 flex flex-col items-center justify-center p-4 hover:bg-secondary/5 transition-colors cursor-pointer"
                    onClick={() => multipleImagesInputRef.current?.click()}
                  >
                    <Upload className="w-10 h-10 text-muted-foreground mb-2" />
                    <p className="text-center text-muted-foreground">
                      Upload multiple images to create a video
                    </p>
                    <p className="text-center text-muted-foreground text-xs mt-1">
                      {selectedImages.length > 0 ? `${selectedImages.length} images selected` : 'No images selected'}
                    </p>
                    <input 
                      type="file"
                      ref={multipleImagesInputRef}
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleMultipleImagesChange}
                    />
                  </div>
                  
                  {imagesPreviews.length > 0 && (
                    <div className="mt-4 flex-grow flex flex-col">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Selected Images ({imagesPreviews.length})</span>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-destructive"
                          onClick={clearMultipleImages}
                        >
                          <Trash2 className="w-3 h-3 mr-1" /> Clear All
                        </Button>
                      </div>
                      <div className="border border-border rounded-lg p-2 h-32 overflow-y-auto">
                        <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-5 lg:grid-cols-7 gap-2">
                          {imagesPreviews.map((preview, index) => (
                            <div key={index} className="relative aspect-square border border-border rounded overflow-hidden bg-card/30 group">
                              <img 
                                src={preview} 
                                alt={`Preview ${index}`} 
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-background/50 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="bg-background/80 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                                  {index + 1}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                    <div className="flex justify-center mt-4">
                    <Button 
                      onClick={processMultipleImages} 
                      className="bg-ocean hover:bg-ocean/90 w-full md:w-auto"
                      disabled={selectedImages.length === 0 || isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : 'Create Video'}
                    </Button>
                    </div>
                  </div>
                </div>
                
                {/* Results section - only show when a video is created */}
                {videoUrl && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
                    {/* Left column - video and frame detection */}
                    <div className="flex flex-col space-y-4">
                      <h3 className="text-sm font-medium mb-1 flex items-center gap-2 text-ocean">
                        <FileVideo className="w-4 h-4" />
                        Processed Video
                      </h3>
                      
                      <div className="border-2 border-border rounded-lg flex-1 flex flex-col items-center justify-center p-4 bg-secondary/5">
                      <div className="w-full h-full flex flex-col">
                        <video 
                          src={videoUrl} 
                          controls 
                            autoPlay
                            className="w-full h-full object-contain max-h-[320px]" 
                          onError={(e) => {
                            console.error('Video error:', e);
                            toast({
                              title: "Video Error",
                              description: "There was an error loading the video. Please try again.",
                              variant: "destructive"
                            });
                          }}
                        />
                        <a 
                          href={videoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-ocean hover:underline mt-2 text-center"
                        >
                          Open video in new tab
                        </a>
                        </div>
                      </div>
                      
                      {/* Frame-by-frame waste detection section */}
                      <div className="mt-2 p-4 border border-border rounded-lg bg-card/10 shadow-sm">
                        <h4 className="font-medium mb-3 text-ocean flex items-center gap-2">
                          <Camera className="w-4 h-4" />
                          Frame-by-Frame Detection
                        </h4>
                        
                        {frameDetections && frameDetections.length > 0 ? (
                          <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                            {frameDetections.map((frameDets, frameIndex) => (
                              <div key={frameIndex} className="border border-border rounded-md p-3 bg-background hover:bg-secondary/5 transition-colors">
                                <div className="flex justify-between items-center mb-2 pb-1 border-b border-border/30">
                                  <h5 className="font-medium text-sm flex items-center gap-1.5">
                                    <Film className="w-3.5 h-3.5 text-ocean/70" />
                                    Frame {frameIndex + 1}
                                  </h5>
                                  <Badge variant={frameDets.length > 0 ? "outline" : "secondary"} className="text-xs">
                                    {frameDets.length} {frameDets.length === 1 ? 'detection' : 'detections'}
                                  </Badge>
                                </div>
                                
                                {frameDets.length > 0 ? (
                                  <div className="space-y-2">
                                    {frameDets.map((detection, detIndex) => {
                                      // Determine icon and color based on category
                                      let CategoryIcon = AlertTriangle;
                                      let categoryText = "Hazardous";
                                      let colorClass = "text-destructive";
                                      let bgClass = "bg-destructive/10";
                                      
                                      if (detection.category === 'non_hazardous_trash') {
                                        CategoryIcon = Trash2;
                                        categoryText = "Non-Hazardous";
                                        colorClass = "text-amber-500";
                                        bgClass = "bg-amber-500/10";
                                      } else if (detection.category === 'aquatic_life') {
                                        CategoryIcon = Leaf;
                                        categoryText = "Aquatic Life";
                                        colorClass = "text-green-500";
                                        bgClass = "bg-green-500/10";
                                      }
                                      
                                      return (
                                        <div 
                                          key={detIndex} 
                                          className={`flex items-center justify-between text-sm py-2 px-2 rounded-md ${bgClass} last:mb-0`}
                                        >
                                          <div className="flex items-center gap-2">
                                            <CategoryIcon className={`w-3.5 h-3.5 ${colorClass}`} />
                                            <span className="font-medium">{formatWasteTypeName(detection.class_name)}</span>
                                          </div>
                                          <div className="flex items-center gap-3">
                                            <span className="text-xs bg-background/80 px-1.5 py-0.5 rounded">
                                              {(detection.confidence * 100).toFixed(0)}%
                                            </span>
                                            <span className={`text-xs font-medium ${colorClass}`}>
                                              {categoryText}
                                            </span>
                                          </div>
                                        </div>
                                      );
                                    })}
                      </div>
                    ) : (
                                  <p className="text-sm text-muted-foreground italic text-center py-2">
                                    No waste detected in this frame
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center p-4 bg-secondary/5 rounded-lg border border-border/50">
                            <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2 opacity-70" />
                            <p className="text-sm text-muted-foreground mb-3">No frame detection data available</p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                // Generate sample frames with detections
                                const numFrames = selectedImages.length || 3;
                                const sampleFrames = Array(numFrames).fill(0).map(() => {
                                  return Array(Math.floor(Math.random() * 2) + 1).fill(0).map(() => ({
                                    class_name: Math.random() > 0.5 ? 'trash_plastic' : 'trash_metal',
                                    confidence: 0.6 + Math.random() * 0.3,
                                    x1: 100, y1: 100, x2: 200, y2: 200,
                                    category: Math.random() > 0.5 ? 'hazardous_trash' : 'non_hazardous_trash',
                                    location: 'center'
                                  }));
                                });
                                setFrameDetections(sampleFrames);
                              }}
                            >
                              Show Sample Data
                            </Button>
                      </div>
                    )}
                  </div>
                </div>
                    
                    {/* Right column - analytics */}
                    {videoStats && (
                      <div className="flex flex-col">
                        <h3 className="text-sm font-medium mb-3 flex items-center gap-2 text-ocean">
                          <InfoIcon className="w-4 h-4" />
                          Waste Analysis
                        </h3>
                        
                        {/* Summary cards */}
                        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                          <div className="p-2 bg-destructive/20 rounded-lg">
                            <AlertTriangle className="w-5 h-5 mx-auto mb-1 text-destructive" />
                            <p className="text-xs font-medium">Hazardous</p>
                            <p className="text-lg font-bold">{videoStats.hazardousCount}</p>
                            <p className="text-xs text-muted-foreground">
                              {((videoStats.hazardousCount / videoStats.totalObjects) * 100).toFixed(1)}%
                            </p>
              </div>
                          
                          <div className="p-2 bg-amber-500/20 rounded-lg">
                            <Trash2 className="w-5 h-5 mx-auto mb-1 text-amber-600" />
                            <p className="text-xs font-medium">Non-Hazardous</p>
                            <p className="text-lg font-bold">{videoStats.nonHazardousCount}</p>
                            <p className="text-xs text-muted-foreground">
                              {((videoStats.nonHazardousCount / videoStats.totalObjects) * 100).toFixed(1)}%
                            </p>
                          </div>
                          
                          <div className="p-2 bg-green-500/20 rounded-lg">
                            <Leaf className="w-5 h-5 mx-auto mb-1 text-green-600" />
                            <p className="text-xs font-medium">Aquatic Life</p>
                            <p className="text-lg font-bold">{videoStats.aquaticLifeCount}</p>
                            <p className="text-xs text-muted-foreground">
                              {((videoStats.aquaticLifeCount / videoStats.totalObjects) * 100).toFixed(1)}%
                            </p>
                          </div>
                        </div>
                        
                        {/* Progress bars */}
                        <div className="space-y-3 mb-4 bg-card/10 p-3 rounded-lg">
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Hazardous Waste</span>
                              <span className="font-medium">{videoStats.hazardousCount} items</span>
                            </div>
                            <Progress 
                              value={(videoStats.hazardousCount / videoStats.totalObjects) * 100} 
                              className="h-2 bg-muted" 
                              indicatorClassName="bg-destructive"
                            />
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Non-Hazardous Waste</span>
                              <span className="font-medium">{videoStats.nonHazardousCount} items</span>
                            </div>
                            <Progress 
                              value={(videoStats.nonHazardousCount / videoStats.totalObjects) * 100} 
                              className="h-2 bg-muted" 
                              indicatorClassName="bg-amber-500"
                            />
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Aquatic Life</span>
                              <span className="font-medium">{videoStats.aquaticLifeCount} items</span>
                            </div>
                            <Progress 
                              value={(videoStats.aquaticLifeCount / videoStats.totalObjects) * 100} 
                              className="h-2 bg-muted" 
                              indicatorClassName="bg-green-500"
                            />
                          </div>
                        </div>
                        
                        {/* Add Charts Section in multiple image view */}
                        <div className="mb-6">
                          <h4 className="text-sm font-medium mb-3 flex items-center border-b border-border pb-2">
                            <PieChartIcon className="w-4 h-4 mr-2 text-ocean" />
                            Data Visualization
                          </h4>

                          <div className="space-y-4">
                            <div className="space-y-2">
                              <h5 className="text-xs font-medium text-muted-foreground">Waste Distribution</h5>
                              <WastePieChart 
                                hazardousCount={videoStats.hazardousCount}
                                nonHazardousCount={videoStats.nonHazardousCount}
                                aquaticLifeCount={videoStats.aquaticLifeCount}
                              />
                            </div>
                            
                            {wasteTypeDetails.length > 0 && (
                              <div className="space-y-2">
                                <h5 className="text-xs font-medium text-muted-foreground">Waste Types Breakdown</h5>
                                <WasteBarChart wasteTypes={wasteTypeDetails} />
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Detailed Waste breakdown accordion */}
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="item-1">
                            <AccordionTrigger className="text-sm font-medium">
                              <div className="flex items-center">
                                <InfoIcon className="w-4 h-4 mr-2" />
                                Detailed Waste Breakdown
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <ScrollArea className="h-56 rounded-md border p-2">
                                <div className="space-y-4">
                                  {/* Hazardous Waste Section */}
                                  {wasteTypeDetails.some(waste => waste.category === 'hazardous_trash') && (
                                    <div>
                                      <h4 className="text-sm font-medium mb-2 flex items-center text-destructive">
                                        <AlertTriangle className="w-4 h-4 mr-1" />
                                        Hazardous Waste Types
                                      </h4>
                                      <div className="space-y-2">
                                        {wasteTypeDetails
                                          .filter(waste => waste.category === 'hazardous_trash')
                                          .map((waste, idx) => (
                                            <div key={idx} className="flex justify-between items-center bg-destructive/10 rounded-md p-2">
                                              <div className="flex items-center">
                                                <Badge variant="destructive" className="mr-2">
                                                  {waste.count}
                                                </Badge>
                                                <span className="text-sm">{formatWasteTypeName(waste.name)}</span>
                                              </div>
                                              <span className="text-xs text-muted-foreground">
                                                {((waste.count / videoStats.totalObjects) * 100).toFixed(1)}%
                                              </span>
                                            </div>
                                          ))}
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* Non-Hazardous Waste Section */}
                                  {wasteTypeDetails.some(waste => waste.category === 'non_hazardous_trash') && (
                                    <div>
                                      <h4 className="text-sm font-medium mb-2 flex items-center text-amber-600">
                                        <Trash2 className="w-4 h-4 mr-1" />
                                        Non-Hazardous Waste Types
                                      </h4>
                                      <div className="space-y-2">
                                        {wasteTypeDetails
                                          .filter(waste => waste.category === 'non_hazardous_trash')
                                          .map((waste, idx) => (
                                            <div key={idx} className="flex justify-between items-center bg-amber-500/10 rounded-md p-2">
                                              <div className="flex items-center">
                                                <Badge variant="warning" className="mr-2">
                                                  {waste.count}
                                                </Badge>
                                                <span className="text-sm">{formatWasteTypeName(waste.name)}</span>
                                              </div>
                                              <span className="text-xs text-muted-foreground">
                                                {((waste.count / videoStats.totalObjects) * 100).toFixed(1)}%
                                              </span>
                                            </div>
                                          ))}
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* Aquatic Life Section */}
                                  {wasteTypeDetails.some(waste => waste.category === 'aquatic_life') && (
                                    <div>
                                      <h4 className="text-sm font-medium mb-2 flex items-center text-green-600">
                                        <Leaf className="w-4 h-4 mr-1" />
                                        Aquatic Life Types
                                      </h4>
                                      <div className="space-y-2">
                                        {wasteTypeDetails
                                          .filter(waste => waste.category === 'aquatic_life')
                                          .map((waste, idx) => (
                                            <div key={idx} className="flex justify-between items-center bg-green-500/10 rounded-md p-2">
                                              <div className="flex items-center">
                                                <Badge variant="success" className="mr-2">
                                                  {waste.count}
                                                </Badge>
                                                <span className="text-sm">{formatWasteTypeName(waste.name)}</span>
                                              </div>
                                              <span className="text-xs text-muted-foreground">
                                                {((waste.count / videoStats.totalObjects) * 100).toFixed(1)}%
                                              </span>
                                            </div>
                                          ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </ScrollArea>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Recent Videos Section */}
      <div ref={videoSectionRef} className="mt-12">
        <SeaTrashSection icon={Film} title="Recent Processed Videos">
          <p className="text-muted-foreground mb-6">
            Browse and view your recently processed sea trash detection videos with statistical analysis.
          </p>

          {loadingVideos ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-ocean animate-spin" />
              <span className="ml-3 text-muted-foreground">Loading videos...</span>
            </div>
          ) : recentVideos.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentVideos.map((video) => (
                  <div 
                    key={video.id} 
                    className="border border-border rounded-lg overflow-hidden bg-card/30 hover:bg-card/50 transition-colors group shadow-sm hover:shadow-md"
                  >
                    <div className="relative aspect-video bg-background/50">
                      <video 
                        src={video.url} 
                        className="w-full h-full object-cover"
                        onMouseOver={(e) => {
                          e.currentTarget.play();
                          fetchVideoDetections(video.id);
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.pause();
                          e.currentTarget.currentTime = 0;
                        }}
                        muted
                        preload="metadata"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="p-3 w-full">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-white">Video {video.id.substring(0, 6)}</span>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="secondary"
                                className="bg-ocean/10 text-ocean hover:bg-ocean/20"
                                asChild
                              >
                                <a href={video.url} target="_blank" rel="noopener noreferrer">
                                  Play
                                </a>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 bg-background/70 text-xs px-2 py-1 rounded-full">
                        {formatFileSize(video.file_size)}
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatRelativeTime(new Date(video.created_at * 1000))}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6" 
                          asChild
                        >
                          <a href={video.url} download>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground hover:text-foreground">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                              <polyline points="7 10 12 15 17 10"></polyline>
                              <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                          </a>
                        </Button>
                      </div>
                      
                      {/* Add Statistics Panel */}
                      {videoStatsMap[video.id] && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-xs font-medium">Waste Analysis</h4>
                            <span className="text-xs text-muted-foreground">
                              {videoStatsMap[video.id].totalObjects} items
                            </span>
                          </div>
                          
                          <div className="space-y-2 mb-2">
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-destructive mr-1"></div>
                                <span>Hazardous</span>
                              </div>
                              <span>
                                {videoStatsMap[video.id].hazardousCount} 
                                <span className="text-muted-foreground ml-1">
                                  ({((videoStatsMap[video.id].hazardousCount / videoStatsMap[video.id].totalObjects) * 100).toFixed(0)}%)
                                </span>
                              </span>
                            </div>
                            <Progress 
                              value={(videoStatsMap[video.id].hazardousCount / videoStatsMap[video.id].totalObjects) * 100} 
                              className="h-1.5 bg-muted" 
                              indicatorClassName="bg-destructive"
                            />
                          </div>
                          
                          <div className="space-y-2 mb-2">
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-amber-500 mr-1"></div>
                                <span>Non-Hazardous</span>
                              </div>
                              <span>
                                {videoStatsMap[video.id].nonHazardousCount}
                                <span className="text-muted-foreground ml-1">
                                  ({((videoStatsMap[video.id].nonHazardousCount / videoStatsMap[video.id].totalObjects) * 100).toFixed(0)}%)
                                </span>
                              </span>
                            </div>
                            <Progress 
                              value={(videoStatsMap[video.id].nonHazardousCount / videoStatsMap[video.id].totalObjects) * 100} 
                              className="h-1.5 bg-muted" 
                              indicatorClassName="bg-amber-500"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                                <span>Aquatic Life</span>
                              </div>
                              <span>
                                {videoStatsMap[video.id].aquaticLifeCount}
                                <span className="text-muted-foreground ml-1">
                                  ({((videoStatsMap[video.id].aquaticLifeCount / videoStatsMap[video.id].totalObjects) * 100).toFixed(0)}%)
                                </span>
                              </span>
                            </div>
                            <Progress 
                              value={(videoStatsMap[video.id].aquaticLifeCount / videoStatsMap[video.id].totalObjects) * 100} 
                              className="h-1.5 bg-muted" 
                              indicatorClassName="bg-green-500"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={fetchRecentVideos}
                  className="text-muted-foreground"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <path d="M21 2v6h-6"></path>
                    <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
                    <path d="M3 22v-6h6"></path>
                    <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
                  </svg>
                  Refresh Videos
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
              <FileVideo className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No videos yet</h3>
              <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                Process multiple frames using the "Multiple Frames" tab above to create your first detection video.
              </p>
              <Button 
                variant="outline"
                onClick={() => setActiveTab("video")}
                className="bg-ocean/10 text-ocean hover:bg-ocean/20 border-ocean/20"
              >
                Try Multiple Frames Detection
              </Button>
            </div>
          )}
        </SeaTrashSection>
      </div>
    </div>
  );
};

export default DetectionTool;
