import React, { useState, useRef, useContext } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import styles from './ImageUpload.module.css';
import { AppContext } from '../../context/AppContext';
import { API_URL } from '../../services/apiClient';
import CropModal from './CropModal';

function ImageUpload({ images = [], onChange }) {
    const { user } = useContext(AppContext);
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [pendingImages, setPendingImages] = useState([]);
    const [activeCrop, setActiveCrop] = useState(null);
    const fileInputRef = useRef(null);

    console.log("ImageUpload received images:", images);

    const uploadToBackend = async (file) => {
        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await fetch(`${API_URL}/api/upload`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${user.accessToken}`
                },
                body: formData
            });
            const data = await response.json();
            
            if (data.success) {
                return data.url;
            } else {
                console.error("Upload failed:", data.message);
                return null;
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            return null;
        }
    };

    const handleFiles = async (files) => {
        if (!files || files.length === 0) return;

        const fileArray = Array.from(files);
        const fileUrls = fileArray.map(file => URL.createObjectURL(file));
        
        setPendingImages(prev => [...prev, ...fileUrls]);
        setActiveCrop(fileUrls[0]);
    };

    const onCropComplete = async (croppedFile) => {
        setActiveCrop(null);
        setUploading(true);
        
        const url = await uploadToBackend(croppedFile);
        
        if (url) {
            onChange([...images, url]);
        }
        
        setUploading(false);

        // Process next pending image if any
        const remainingPending = pendingImages.slice(1);
        setPendingImages(remainingPending);
        if (remainingPending.length > 0) {
            setActiveCrop(remainingPending[0]);
        }
    };


    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const removeImage = (indexToRemove) => {
        const updatedImages = images.filter((_, index) => index !== indexToRemove);
        onChange(updatedImages);
    };

    return (
        <div className={styles.uploadContainer}>
            {images.length > 0 && (
                <div className={styles.imageGrid}>
                    {images.map((url, index) => (
                        <div key={index} className={styles.imageItem}>
                            <img src={url} alt={`Product ${index + 1}`} className={styles.previewImage} />
                            <button 
                                type="button" 
                                className={styles.removeBtn} 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeImage(index);
                                }}
                                title="Remove image"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                    {uploading && (
                        <div className={`${styles.imageItem} ${styles.skeleton}`}>
                            <div className={styles.loadingOverlay}>
                                <Loader2 className={styles.spinnerIcon} />
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div 
                className={`${styles.dropzone} ${dragActive ? styles.dropzoneActive : ''} ${images.length > 0 ? styles.dropzoneCompact : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <input 
                    type="file" 
                    multiple 
                    className={styles.hiddenInput} 
                    ref={fileInputRef}
                    onChange={(e) => handleFiles(e.target.files)}
                    accept="image/*"
                />
                
                <div className={styles.iconContainer}>
                    {uploading ? <Loader2 className={styles.spinnerIcon} /> : <Upload size={images.length > 0 ? 18 : 24} />}
                </div>

                <div className={styles.uploadText}>
                    <span>{uploading ? 'Uploading...' : images.length > 0 ? 'Drop more images here' : 'Click or drag images here'}</span>
                    {!images.length && <span>Supports JPG, PNG, WebP (Max 10 images)</span>}
                </div>

                {uploading && (
                    <div className={styles.loadingOverlay}>
                        <div className={styles.progressContainer}>
                            <div className={styles.progressBar} style={{ width: '100%' }}></div>
                        </div>
                    </div>
                )}
            </div>

            <div className={styles.uploadActions}>
                <button 
                    type="button" 
                    className={styles.actionBtn}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Upload size={18} />
                    Upload Files
                </button>
            </div>

            {activeCrop && (
                <CropModal 
                    image={activeCrop} 
                    onCropComplete={onCropComplete} 
                    onCancel={() => {
                        setActiveCrop(null);
                        setPendingImages(prev => prev.slice(1));
                    }} 
                />
            )}
        </div>
    );
}

export default ImageUpload;