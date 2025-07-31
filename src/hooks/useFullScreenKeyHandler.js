import { useEffect } from 'react';

export default function useFullScreenKeyHandler({
  showFullScreen,
  closeFullScreen,
  allImagesForFullscreen,
  currentFullScreenImage,
  navigateFullScreen,
  handleZoom,
  handleRotate,
}) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!showFullScreen) return;

      switch (event.key) {
        case 'Escape':
          closeFullScreen();
          break;
        case 'ArrowLeft':
          if (allImagesForFullscreen.length > 1) navigateFullScreen('prev');
          break;
        case 'ArrowRight':
          if (allImagesForFullscreen.length > 1) navigateFullScreen('next');
          break;
        case '+':
        case '=':
          if (currentFullScreenImage?.fileType === 'image') handleZoom('in');
          break;
        case '-':
          if (currentFullScreenImage?.fileType === 'image') handleZoom('out');
          break;
        case 'r':
        case 'R':
          if (currentFullScreenImage?.fileType === 'image') handleRotate();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    if (showFullScreen) document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [
    showFullScreen,
    closeFullScreen,
    allImagesForFullscreen.length,
    currentFullScreenImage?.fileType,
    navigateFullScreen,
    handleZoom,
    handleRotate,
  ]);
}
