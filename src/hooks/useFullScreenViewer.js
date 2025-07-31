import { useState, useMemo } from 'react';

export default function useFullScreenViewer(allImagesForFullscreen = []) {
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [currentFullScreenImageIndex, setFullScreenImageIndex] = useState(0);

  const openFullScreen = (imageIndex) => {
    setFullScreenImageIndex(imageIndex);
    setShowFullScreen(true);
    setZoomLevel(1);
    setRotation(0);
    setImageLoadError(false);
  };

  const closeFullScreen = () => {
    setShowFullScreen(false);
    setZoomLevel(1);
    setRotation(0);
    setImageLoadError(false);
  };

  const navigateFullScreen = (direction) => {
    setFullScreenImageIndex((prev) =>
      direction === 'next'
        ? (prev + 1) % allImagesForFullscreen.length
        : (prev - 1 + allImagesForFullscreen.length) % allImagesForFullscreen.length
    );
    setZoomLevel(1);
    setRotation(0);
    setImageLoadError(false);
  };

  const handleZoom = (type) => {
    setZoomLevel((prev) =>
      type === 'in' ? Math.min(prev + 0.25, 3) : Math.max(prev - 0.25, 0.5)
    );
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const currentFullScreenImage = useMemo(() => {
    return allImagesForFullscreen[currentFullScreenImageIndex];
  }, [allImagesForFullscreen, currentFullScreenImageIndex]);

  return {
    showFullScreen,
    zoomLevel,
    rotation,
    imageLoadError,
    currentFullScreenImage,
    currentFullScreenImageIndex,
    openFullScreen,
    closeFullScreen,
    navigateFullScreen,
    handleZoom,
    handleRotate,
    setImageLoadError,
  };
}
