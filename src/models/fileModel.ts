// Define types for uploaded files
export interface UploadedFile {
    originalName: string;
    location: string;
    sizeKB: string;
}

export interface UploadResult {
    message: string;
    folderUrl: string;
    sessionFolder: string;
    files: any[];
}