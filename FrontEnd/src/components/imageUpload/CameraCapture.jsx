import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { X, RefreshCw, Camera } from 'lucide-react';
import styles from './ImageUpload.module.css';

const CameraCapture = ({ onCapture, onCancel }) => {
    const webcamRef = useRef(null);
    const [facingMode, setFacingMode] = useState("environment"); // Use "user" for front camera

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
            onCapture(imageSrc);
        }
    }, [webcamRef, onCapture]);

    const toggleFacingMode = () => {
        setFacingMode(prev => prev === "user" ? "environment" : "user");
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h3>Take Product Photo</h3>
                    <button className={styles.closeBtn} onClick={onCancel}>
                        <X size={18} />
                    </button>
                </div>
                
                <div className={styles.cameraWrapper}>
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        videoConstraints={{
                            facingMode: facingMode
                        }}
                        className={styles.webcam}
                    />
                    
                    <div className={styles.cameraControls}>
                        <button className={styles.flipBtn} onClick={toggleFacingMode} title="Switch Camera">
                            <RefreshCw size={20} />
                        </button>
                        
                        <button className={styles.captureBtn} onClick={capture} title="Capture Image">
                            {/* Inner circle is handled by CSS */}
                        </button>
                        
                        <div style={{ width: '44px' }}></div> {/* Spacer to keep capture centered */}
                    </div>
                </div>

                <div className={styles.modalFooter}>
                    <button className={styles.btnSecondary} onClick={onCancel} style={{ width: '100%' }}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CameraCapture;
