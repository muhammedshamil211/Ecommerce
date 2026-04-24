import React, { useState, useCallback } from 'react';
import styles from './MultiImageUpload.module.css';
import { Upload, Camera, X, Plus, Image as ImageIcon, Loader2 } from 'lucide-react';
import ImageCropper from '../ImageCropper/ImageCropper';
import CameraCapture from '../CameraCapture/CameraCapture';
import { getPresignedUrl, uploadToS3 } from '../../services/uploadApi';
import toast from 'react-hot-toast';

const MultiImageUpload = ({ images = [], onChange, accessToken }) => {
    const [selectedImage, setSelectedImage] = useState(null); // Local image for cropping
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setSelectedImage({ src: reader.result, name: file.name, type: file.type });
            };
        }
    };

    const handleCameraCapture = (imgSrc) => {
        setSelectedImage({ src: imgSrc, name: `camera-${Date.now()}.jpg`, type: 'image/jpeg' });
        setIsCameraOpen(false);
    };

    const handleCropComplete = async (blob) => {
        const imageName = selectedImage.name;
        const imageType = 'image/jpeg';
        setSelectedImage(null);
        setIsUploading(true);

        try {
            const { uploadUrl, key, publicUrl } = await getPresignedUrl(accessToken, imageName, imageType);
            await uploadToS3(uploadUrl, blob, imageType);

            const newImages = [...images, publicUrl];
            onChange(newImages);
            toast.success('Image uploaded successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to upload image');
        } finally {
            setIsUploading(false);
        }
    };

    const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        onChange(newImages);
    };

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                {images.map((url, index) => (
                    <div key={index} className={styles.imageCard}>
                        <img src={url} alt={`product-${index}`} />
                        <button 
                            type="button" 
                            className={styles.removeBtn} 
                            onClick={() => removeImage(index)}
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}

                {images.length < 10 && !isUploading && (
                    <div className={styles.uploadOptions}>
                        <label className={styles.optionBtn}>
                            <input type="file" accept="image/*" onChange={handleFileChange} hidden />
                            <Plus size={20} />
                            <span>Upload</span>
                        </label>
                        <button 
                            type="button" 
                            className={styles.optionBtn} 
                            onClick={() => setIsCameraOpen(true)}
                        >
                            <Camera size={20} />
                            <span>Camera</span>
                        </button>
                    </div>
                )}

                {isUploading && (
                    <div className={styles.uploadingCard}>
                        <Loader2 className={styles.spin} />
                        <span>Uploading...</span>
                    </div>
                )}
            </div>

            {images.length === 0 && !isUploading && (
                <div className={styles.emptyState}>
                    <ImageIcon size={40} className={styles.emptyIcon} />
                    <p>Add up to 10 product images</p>
                    <p className={styles.subText}>JPEG format, 4:3 aspect ratio</p>
                </div>
            )}

            {selectedImage && (
                <ImageCropper 
                    image={selectedImage.src} 
                    onCropComplete={handleCropComplete} 
                    onCancel={() => setSelectedImage(null)} 
                />
            )}

            {isCameraOpen && (
                <CameraCapture 
                    onCapture={handleCameraCapture} 
                    onCancel={() => setIsCameraOpen(false)} 
                />
            )}
        </div>
    );
};

export default MultiImageUpload;
