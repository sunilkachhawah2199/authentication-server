// Define types for uploaded files
export interface UploadedFile {
    originalName: string;
    location: string;
    sizeKB: string;
}

// response after file uploads
export interface UploadResult {
    message: string;
    folderUrl: string;
    sessionFolder: string;
    files: any[];
}

// request body for ai process api
export interface AiProcessRequest {
    email: string,
    folderUrl: string
}