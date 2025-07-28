import "./zommed-crop.styles.css";

const ZoomedCrop = ({ imageSrc, box, imageWidth, imageHeight }) => {
  const cropSize = 400;
  const scale = (cropSize / imageWidth) * 3;
  if (!box) return null;

  const style = {
    width: cropSize,
    height: cropSize,
    overflow: "hidden",
    position: "relative",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
  };

  const left = -box.x * scale + cropSize / 2 - (box.w * scale) / 2;
  const top = -box.y * scale + cropSize / 2 - (box.h * scale) / 2;

  const imageStyle = {
    position: "absolute",
    left: left > 0 ? 0 : left,
    top: top > 0 ? 0 : top,
    transform: `scale(${scale})`,
    transformOrigin: "top left",
    width: `${imageWidth}px`,
    height: `${imageHeight}px`,
  };

  return (
    <div style={style}>
      <img src={imageSrc} alt="Zoomed Item" style={imageStyle} />
      <div
        className="modal-hotspot"
        style={{
          left: box.x * scale + (left > 0 ? 0 : left),
          top: box.y * scale + (top > 0 ? 0 : top),
          width: box.w * scale,
          height: box.h * scale,
        }}
      ></div>
    </div>
  );
};

export default ZoomedCrop;
