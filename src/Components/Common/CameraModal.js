import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FaCamera, FaTimes, FaRedo, FaCheck, FaVideo } from 'react-icons/fa';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999999;
  padding: 16px;
`;

const ModalContainer = styled.div`
  background: #1e293b;
  border-radius: 20px;
  width: 100%;
  max-width: 520px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const ModalHeader = styled.div`
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #0f172a;
  border-bottom: 1px solid #334155;

  h3 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 10px;
    color: #f8fafc;
  }
`;

const CloseBtn = styled.button`
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const VideoWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  background: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  video, img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CameraNotice = styled.div`
  padding: 20px;
  text-align: center;
  color: #f87171;
  font-size: 14px;
`;

const ModalFooter = styled.div`
  padding: 16px 20px;
  display: flex;
  justify-content: center;
  gap: 14px;
  background: #0f172a;
  border-top: 1px solid #334155;
`;

const ActionBtn = styled.button`
  padding: 10px 22px;
  border-radius: 30px;
  border: none;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;

  &.capture {
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  }

  &.save {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    color: white;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }

  &.retake {
    background: #475569;
    color: white;
  }

  &:hover {
    transform: translateY(-1px);
    opacity: 0.95;
  }
`;

const CameraModal = ({ isOpen, onClose, onCapture, title = "Capture Photo" }) => {
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(document.createElement('canvas'));

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setCapturedImage(null);
      setCameraError(null);
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    try {
      setCameraError(null);
      let mediaStream;
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }
        });
      } catch (err) {
        mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      }

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setCameraError("Camera permission denied or camera unavailable. Please check camera settings or upload photo from device.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleCapture = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(dataUrl);
    stopCamera();
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startCamera();
  };

  const handleSave = () => {
    if (!capturedImage) return;

    // Convert dataUrl to File
    const arr = capturedImage.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    const filename = `camera_capture_${Date.now()}.jpg`;
    const file = new File([u8arr], filename, { type: mime });

    onCapture(file);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h3>
            <FaCamera color="#38bdf8" /> {title}
          </h3>
          <CloseBtn onClick={onClose}>
            <FaTimes />
          </CloseBtn>
        </ModalHeader>

        <VideoWrapper>
          {cameraError ? (
            <CameraNotice>{cameraError}</CameraNotice>
          ) : capturedImage ? (
            <img src={capturedImage} alt="Captured preview" />
          ) : (
            <video ref={videoRef} autoPlay playsInline muted />
          )}
        </VideoWrapper>

        <ModalFooter>
          {capturedImage ? (
            <>
              <ActionBtn className="retake" onClick={handleRetake}>
                <FaRedo /> Retake
              </ActionBtn>
              <ActionBtn className="save" onClick={handleSave}>
                <FaCheck /> Save & Use Photo
              </ActionBtn>
            </>
          ) : (
            <>
              {!cameraError && (
                <ActionBtn className="capture" onClick={handleCapture}>
                  <FaCamera /> Take Photo
                </ActionBtn>
              )}
            </>
          )}
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default CameraModal;
