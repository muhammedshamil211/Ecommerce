import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X } from 'lucide-react';
import styles from './ImageUpload.module.css';
import { getCroppedFile } from '../../utils/cropImage';

const CropModal = ({ image, onCropComplete, onCancel }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropChange = useCallback((crop) => {
        setCrop(crop);
    }, []);

    const onZoomChange = useCallback((zoom) => {
        setZoom(zoom);
    }, []);

    const onCropCompleteInternal = useCallback((_croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleConfirm = async () => {
        try {
            const croppedFile = await getCroppedFile(image, croppedAreaPixels);
            onCropComplete(croppedFile);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h3>Crop Product Image (3:4)</h3>
                    <button className={styles.closeBtn} onClick={onCancel}>
                        <X size={18} />
                    </button>
                </div>
                
                <div className={styles.cropperContainer}>
                    <Cropper
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        aspect={3 / 4}
                        onCropChange={onCropChange}
                        onCropComplete={onCropCompleteInternal}
                        onZoomChange={onZoomChange}
                    />
                </div>

                <div className={styles.modalFooter}>
                    <button className={styles.btnSecondary} onClick={onCancel}>
                        Cancel
                    </button>
                    <button className={styles.btnPrimary} onClick={handleConfirm}>
                        Apply Crop
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CropModal;
