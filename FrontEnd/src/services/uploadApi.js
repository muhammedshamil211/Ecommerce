import { apiClient, API_URL } from './apiClient';

const UPLOAD = `${API_URL}/api/upload`;

export const getPresignedUrl = (accessToken, fileName, fileType) =>
  apiClient(`${UPLOAD}/presigned-url`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ fileName, fileType }),
  });

/** Standard fetch for S3 upload as it's a direct PUT to AWS/Render cloud storage */
export const uploadToS3 = (uploadUrl, fileBlob, fileType) =>
  fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': fileType },
    body: fileBlob,
  });
