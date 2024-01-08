import React, { useRef, useState } from "react";
import { View, Image, Button, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";
import { captureRef } from "react-native-view-shot";
import * as ImageManipulator from "expo-image-manipulator";

const ImageMaskingComponent = () => {
  const imageRef = useRef(null);
  const [maskedImage, setMaskedImage] = useState(null);
  const [drawingPaths, setDrawingPaths] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);

  // Function to handle touch movements and store the drawn paths
  const handleTouchMove = (evt) => {
    if (isDrawing) {
      const { nativeEvent } = evt;
      const { locationX, locationY } = nativeEvent;
      setDrawingPaths([...drawingPaths, { x: locationX, y: locationY }]);
    }
  };

  // Function to start drawing
  const startDrawing = () => {
    setIsDrawing(true);
  };

  // Function to stop drawing
  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Function to display the drawn mask on top of the image
  const displayDrawnMask = () => {
    if (drawingPaths.length > 0) {
      return (
        <Svg height="300" width="300" style={StyleSheet.absoluteFill}>
          <Path
            d={createSvgPath(drawingPaths)}
            fill="none"
            stroke="red" // Change stroke color as desired
            strokeWidth={10} // Change stroke width as desired
          />
        </Svg>
      );
    }
    return null;
  };

  // Function to convert drawing paths into SVG path format
  const createSvgPath = (paths) => {
    return paths.reduce((acc, path, index) => {
      const pathString = `${index === 0 ? "M" : "L"} ${path.x},${path.y}`;
      return `${acc} ${pathString}`;
    }, "");
  };

  const applyMaskAndCutout = async () => {
    if (imageRef.current && drawingPaths.length > 0) {
      try {
        // Capture the original image
        const originalImageURI = await captureRef(imageRef, {
          format: "jpeg",
          quality: 1,
        });

        const maskedImageURI = applyMaskToImage(originalImageURI, drawingPaths);

        // Crop the masked portion
        const croppedImage = await cropMaskedPortion(
          maskedImageURI,
          drawingPaths
        );
        setMaskedImage(croppedImage);
      } catch (error) {
        console.error("Error applying mask:", error);
      }
    }
  };

  // Function to crop the masked portion
  const cropMaskedPortion = async (imageURI, paths) => {
    const cropParams = calculateBoundingBox(paths);
    const croppedImage = await ImageManipulator.manipulateAsync(
      imageURI,
      [{ crop: cropParams }],
      { compress: 1, format: "jpeg" }
    );
    return croppedImage.uri;
  };

  // Function to calculate bounding box based on drawn paths
  const calculateBoundingBox = (paths) => {
    if (paths.length === 0) {
      return null; // No paths drawn, return null or handle appropriately
    }

    let minX = paths[0].x;
    let minY = paths[0].y;
    let maxX = paths[0].x;
    let maxY = paths[0].y;

    for (let i = 1; i < paths.length; i++) {
      const { x, y } = paths[i];
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }

    const originX = minX;
    const originY = minY;
    const width = maxX - minX;
    const height = maxY - minY;

    return { originX, originY, width, height };
  };

  return (
    <View style={styles.container}>
      <View ref={imageRef} collapsable={false}>
        <Image
          source={require("./assets/img.jpg")}
          style={styles.image}
          onTouchStart={startDrawing}
          onTouchMove={handleTouchMove}
          onTouchEnd={stopDrawing}
        />
        {displayDrawnMask()}
      </View>
      <Button title="Apply Mask and Cutout" onPress={applyMaskAndCutout} />
      {maskedImage && (
        <Image source={{ uri: maskedImage }} style={styles.maskedImage} />
      )}
    </View>
  );
};

const applyMaskToImage = (imageURI, paths) => {
  return imageURI;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: "cover",
  },
  maskedImage: {
    width: 300,
    height: 300,
    resizeMode: "cover",
    marginTop: 20,
  },
});

export default ImageMaskingComponent;
