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

// request body for insurance ai
export interface AiProcessRequest {
    email: string,
    folderUrl: string
}

// request body for invoice ai
export interface InvoiceAGentRequest {
    email: string
    file: Buffer | string  // Can be either Buffer or string
}