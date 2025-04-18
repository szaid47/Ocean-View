
import { toast } from "@/components/ui/use-toast";

export interface GeoJsonEntry {
  latitude: number;
  longitude: number;
  intensity?: number;
  type: string;
}

// Memory cache for storing loaded data
const dataCache = new Map<string, [number, number, number][]>();

// Preload status tracking
let preloadStarted = false;
let preloadedTypes = new Set<string>();

/**
 * Loads and filters GeoJSON data from files with performance optimizations
 */
export const loadGeoJsonFiles = async (selectedTypes: string[]): Promise<[number, number, number][]> => {
  // Create a cache key based on selected types
  const cacheKey = selectedTypes.sort().join('_') || 'all';
  
  // Check if we have cached data
  if (dataCache.has(cacheKey)) {
    console.log(`✅ Using cached data for ${cacheKey}`);
    return dataCache.get(cacheKey) || [];
  }
  
  // For initial load with no types selected, check if we can return pre-cached data
  if (selectedTypes.length === 0 && dataCache.has('initial_preload')) {
    console.log('✅ Using preloaded initial data');
    return dataCache.get('initial_preload') || [];
  }
  
  // Use a more efficient approach - load a limited set of files first and show results
  // This provides faster initial rendering while more data loads in the background
  const priorityFilesToLoad = 100; // Load just enough for initial view
  let allPoints: [number, number, number][] = [];
  let loadedFiles = 0;
  
  try {
    // Use a web worker approach for non-blocking loading
    await new Promise<void>(async (resolve) => {
      // First, try to load a smaller batch to show something quickly
      const initialBatch = Array.from(
        { length: priorityFilesToLoad }, 
        (_, i) => `/geojson_files/file${i + 1}.geojson`
      );
      
      // Load initial batch sequentially but fast
      for (let i = 0; i < initialBatch.length; i += 10) {
        const batchChunk = initialBatch.slice(i, i + 10);
        const responses = await Promise.all(
          batchChunk.map(file => 
            fetch(file, { priority: 'high' })
              .then(response => response.ok ? response.json() : [])
              .catch(() => [])
          )
        );
        
        // Process responses
        responses.forEach(data => {
          if (!Array.isArray(data)) return;
          loadedFiles++;
          
          // Filter by type if needed
          const filteredData = processGeoJsonData(data, selectedTypes);
          allPoints = [...allPoints, ...filteredData];
        });
        
        // If we've found a reasonable number of points, we can show an initial view
        if (allPoints.length > 200 && i > 50) {
          // Cache this initial data for quick future loads
          if (selectedTypes.length === 0 && !dataCache.has('initial_preload')) {
            dataCache.set('initial_preload', [...allPoints]);
          }
          resolve();
          break;
        }
      }
      
      // Always resolve, even if we don't have many points
      resolve();
    });
    
    // Continue loading more files in the background if this isn't already a cached request
    if (!preloadStarted) {
      preloadStarted = true;
      loadDataInBackground();
    }
    
    // Cache the current data for future use
    dataCache.set(cacheKey, allPoints);
    
    console.log(`✅ Loaded ${allPoints.length} points from ${loadedFiles} files for quick display`);
    return allPoints;
  } catch (error) {
    console.error("Error loading GeoJSON files:", error);
    toast({
      variant: "destructive",
      title: "Error loading map data",
      description: "There was a problem loading the waste data. Please try again.",
    });
    return [];
  }
};

// Helper function to process and filter GeoJSON data
const processGeoJsonData = (data: any[], selectedTypes: string[]): [number, number, number][] => {
  if (!Array.isArray(data)) return [];
  
  // Filter by type if needed
  const filteredData = selectedTypes.length > 0
    ? data.filter(({ type }) => {
        if (!type) return false;
        
        // Handle multiple waste types in a single entry (comma-separated)
        if (type.includes(',')) {
          const entryTypes = type.split(',').map(t => t.trim());
          return entryTypes.some(t => selectedTypes.includes(t));
        }
        
        return selectedTypes.includes(type);
      })
    : data;
  
  // Convert to the expected format
  return filteredData
    .filter(({ latitude, longitude }) => (
      typeof latitude === "number" &&
      typeof longitude === "number" &&
      !isNaN(latitude) && 
      !isNaN(longitude) &&
      latitude >= -90 &&
      latitude <= 90 &&
      longitude >= -180 &&
      longitude <= 180
    ))
    .map(({ latitude, longitude, intensity = 1 }) => {
      // Normalize intensity to values between 0.3 and 1
      const normalizedIntensity = intensity ? 
        Math.max(0.3, Math.min(1, intensity / 5)) : 0.5;
        
      return [latitude, longitude, normalizedIntensity];
    });
};

// Background loading function to preload all data for future requests
const loadDataInBackground = async () => {
  console.log("📊 Starting background data preloading...");
  const totalFilesToTry = 843;
  const commonTypes = ["plastic_waste", "plastic_debris", "ocean_waste", "fishing_gear", "industrial_waste", "sewage_waste"];
  
  try {
    // Load all data for faster filter changes later
    const batchSize = 30;
    const batches = Math.ceil(totalFilesToTry / batchSize);
    let allPoints: [number, number, number][] = [];
    let allTypePoints = new Map<string, [number, number, number][]>();
    
    // Initialize maps for each type
    commonTypes.forEach(type => {
      allTypePoints.set(type, []);
    });
    
    for (let batch = 0; batch < batches; batch++) {
      const start = batch * batchSize + 1;
      const end = Math.min(start + batchSize - 1, totalFilesToTry);
      
      // Create array of file paths for this batch
      const batchFiles = Array.from(
        { length: end - start + 1 }, 
        (_, i) => `/geojson_files/file${start + i}.geojson`
      );
      
      // Use Promise.all for parallel loading within batch
      const responses = await Promise.all(
        batchFiles.map(file => 
          fetch(file, { priority: 'low' })
            .then(response => response.ok ? response.json() : [])
            .catch(() => [])
        )
      );
      
      // Process responses and add to respective type collections
      responses.forEach(data => {
        if (!Array.isArray(data)) return;
        
        // Add to all points collection
        const validPoints = processGeoJsonData(data, []);
        allPoints = [...allPoints, ...validPoints];
        
        // Add to type-specific collections
        data.forEach(entry => {
          if (!entry.type) return;
          
          // Handle multiple types in a comma-separated string
          const types = entry.type.includes(',') 
            ? entry.type.split(',').map((t: string) => t.trim())
            : [entry.type];
          
          types.forEach((type: string) => {
            if (commonTypes.includes(type)) {
              const typePoints = allTypePoints.get(type) || [];
              const point: [number, number, number] = [
                entry.latitude,
                entry.longitude,
                entry.intensity ? Math.max(0.3, Math.min(1, entry.intensity / 5)) : 0.5
              ];
              
              if (
                typeof entry.latitude === "number" &&
                typeof entry.longitude === "number" &&
                !isNaN(entry.latitude) && 
                !isNaN(entry.longitude) &&
                entry.latitude >= -90 &&
                entry.latitude <= 90 &&
                entry.longitude >= -180 &&
                entry.longitude <= 180
              ) {
                typePoints.push(point);
                allTypePoints.set(type, typePoints);
                
                // Mark this type as preloaded
                preloadedTypes.add(type);
              }
            }
          });
        });
      });
      
      // Update the cache periodically with our progress
      if (batch % 10 === 0 || batch === batches - 1) {
        console.log(`📊 Background preloading progress: ${Math.round((batch + 1) / batches * 100)}%`);
        dataCache.set('all', allPoints);
        
        // Cache each type's data
        commonTypes.forEach(type => {
          const typePoints = allTypePoints.get(type) || [];
          if (typePoints.length > 0) {
            dataCache.set(type, typePoints);
          }
        });
      }
    }
    
    console.log(`✅ Background preloading complete. Cached ${allPoints.length} points across ${preloadedTypes.size} types.`);
  } catch (error) {
    console.error("Error in background data loading:", error);
  }
};

