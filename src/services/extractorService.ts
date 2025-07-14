import axios from "axios";
import { AiProcessRequest } from "../models/fileModel";
import { BadRequestError } from "../exceptions/applicationErrors";

const baseUrl = process.env.AI_URL
const extratorAPI = `${baseUrl}/process`

export const extractorService = async (request: AiProcessRequest): Promise<boolean> => {
    try {
        const { email, folderUrl } = request;
        if (!email || !folderUrl) {
            throw new BadRequestError("provide email and folderUrl to process extractor api")
        }

        // call ai process api
        const aiProcessResponse = await axios.post(`${extratorAPI}`, {
            email: email,
            s3_folder_url: folderUrl
        })
        console.log("extractor service response", aiProcessResponse.data)

        if (aiProcessResponse.status == 200) {
            return true;
        }
        return false;

    }
    catch (err: any) {
        console.log(`Extractor service error: ${err.name} - ${err.message}`);

        // Add more detailed error logging
        if (err.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log("Error response data:", err.response.data);
            console.log("Error response status:", err.response.status);
            console.log("Error response headers:", err.response.headers);
        } else if (err.request) {
            // The request was made but no response was received
            console.log("Error request:", err.request);
        }

        // Instead of crashing the application, return false and log the error
        console.error("Failed to process extraction request:", err);
        return false;
    }
}