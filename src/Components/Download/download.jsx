import { useSelector } from 'react-redux';
import { selectCanvas } from "../../redux/features/Shapes/shapesSlice";

const Download = () => {
  const canvasId = useSelector(selectCanvas);

  const handleDownload = () => {
    const canvas = document.getElementById(canvasId);
    if (canvas) {
      const dataURL = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "canvas-react-doodle.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.error("Canvas element not found");
    }
  };

  return (
    <div className="download-container">
      <button onClick={handleDownload} title="Download" className="download-button">
        <i className="fa-solid fa-download"></i>
      </button>
    </div>
  );
};

export default Download;

