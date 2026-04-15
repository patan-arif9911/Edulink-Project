package com.edulink.studentservice.service;

import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import com.mongodb.client.gridfs.model.GridFSFile;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.gridfs.GridFsOperations;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

@Service
public class GridFsService {

    @Autowired
    private GridFsTemplate gridFsTemplate;

    @Autowired
    private GridFsOperations gridFsOperations;

    /**
     * Upload file to GridFS and return file ID
     * @param file the MultipartFile to upload
     * @param courseId course ID for metadata
     * @return file ID in GridFS
     */
    public String uploadFile(MultipartFile file, String courseId) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }

        try (InputStream inputStream = file.getInputStream()) {
            return gridFsTemplate.store(
                inputStream,
                file.getOriginalFilename(),
                file.getContentType(),
                new Document("courseId", courseId)
            ).toHexString();
        }
    }

    /**
     * Download file from GridFS by file ID
     * @param fileId the GridFS file ID (hex string)
     * @return file content as byte array
     */
    public byte[] downloadFile(String fileId) throws IOException {
        try {
            ObjectId objectId = new ObjectId(fileId);
            GridFSFile gridFSFile = gridFsTemplate.findOne(new Query(Criteria.where("_id").is(objectId)));
            
            if (gridFSFile == null) {
                throw new IllegalArgumentException("File not found with ID: " + fileId);
            }

            try (InputStream inputStream = gridFsOperations.getResource(gridFSFile).getInputStream()) {
                return IOUtils.toByteArray(inputStream);
            }
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid file ID format: " + fileId, e);
        }
    }

    /**
     * Delete file from GridFS by file ID
     * @param fileId the GridFS file ID (hex string)
     */
    public void deleteFile(String fileId) {
        try {
            ObjectId objectId = new ObjectId(fileId);
            gridFsTemplate.delete(new Query(Criteria.where("_id").is(objectId)));
        } catch (IllegalArgumentException e) {
            // Invalid ObjectId format, ignore or log
        }
    }

    /**
     * Get file metadata from GridFS
     * @param fileId the GridFS file ID (hex string)
     * @return GridFSFile metadata
     */
    public GridFSFile getFileMetadata(String fileId) {
        try {
            ObjectId objectId = new ObjectId(fileId);
            return gridFsTemplate.findOne(new Query(Criteria.where("_id").is(objectId)));
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    /**
     * Get file size in bytes
     * @param fileId the GridFS file ID
     * @return file size
     */
    public long getFileSize(String fileId) {
        GridFSFile gridFSFile = getFileMetadata(fileId);
        return gridFSFile != null ? gridFSFile.getLength() : 0;
    }

    /**
     * Get file name
     * @param fileId the GridFS file ID
     * @return file name
     */
    public String getFileName(String fileId) {
        GridFSFile gridFSFile = getFileMetadata(fileId);
        return gridFSFile != null ? gridFSFile.getFilename() : null;
    }

    /**
     * Get content type
     * @param fileId the GridFS file ID
     * @return content type
     */
    public String getContentType(String fileId) {
        GridFSFile gridFSFile = getFileMetadata(fileId);
        if (gridFSFile != null && gridFSFile.getMetadata() != null) {
            Object contentType = gridFSFile.getMetadata().get("contentType");
            return contentType != null ? contentType.toString() : "application/octet-stream";
        }
        return "application/octet-stream";
    }
}
