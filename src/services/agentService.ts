import { db } from "../utils/firebase_admin_sdk";
import { v4 as uuidv4 } from 'uuid';
import { IAgentRegister, IAgentRegisterResponse } from "../models/agentModel";
import { FIREBASE_COLLECTIONS } from "../constants/firestore";
import axios from "axios";
import { AiProcessRequest, InvoiceAGentRequest } from "../models/fileModel";
import { BadRequestError } from "../exceptions/applicationErrors";
import { extratorAPI, invoiceAPI } from "../constants/endpoint";
import FormData from 'form-data';


// create new agent
export const createAgentService = async (agent: IAgentRegister) => {
    try {
        const agentUuid = `agent-${uuidv4()}`;
        agent.agentId = agentUuid;
        agent.isActive = true;
        agent.updatedAt = new Date();
        const docRef = await db().collection(FIREBASE_COLLECTIONS.AGENTS).add({
            ...agent
        })

        const save = await docRef.get()
        const agentData = save.data();

        // console.log("Agent created with ID:", docRef.id);

        return agentData;
    } catch (err: any) {
        // console.log("Error creating agent", err.message);
        throw new Error(`Error in creating agent: ${err.message}`);
    }
}

// get all the agents
export const getAllAgentService = async (): Promise<IAgentRegisterResponse[]> => {
    try {
        const agentsSnapshot = await db().collection(FIREBASE_COLLECTIONS.AGENTS).get();

        const agentData = agentsSnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                agentId: data.agentId,
                name: data.name,
                description: data.description,
                tags: data.tags,
                icon: data.icon,
            } as IAgentRegisterResponse;
        });

        return agentData;
    } catch (err: any) {
        // console.log("Error in getting all agent", err.message);
        throw new Error(`Error in getting agents: ${err.message}`);
    }
}

// admin system
export const getAgentByIdService = async (agentId: string) => {
    try {
        // console.log("agentId in get agent service", agentId)
        const agent = await db().collection(FIREBASE_COLLECTIONS.AGENTS).where("agentId", "==", agentId).get();
        // console.log(agent.docs[0].data())
        const agentData = agent.docs.map((doc) => {
            const data = doc.data();
            return {
                agentId: data.agentId,
                name: data.name,
                description: data.description,
                tags: data.tags,
                icon: data.icon,
            } as IAgentRegisterResponse;
        })
        if (!agentData) {
            return null;
        }

        return agentData;
    } catch (err: any) {
        // console.log("agent not exist with this id:", err.message);
        throw new Error(`agent not exist with this id: ${err.message}`);
    }
}

// call insurance extractor service
export const extractorService = async (request: AiProcessRequest): Promise<void> => {
    try {
        const { email, folderUrl } = request;
        if (!email || !folderUrl) {
            throw new BadRequestError("provide email and folderUrl to process extractor api")
        }

        // console.log(`request came in extratcor ai ${email} || ${folderUrl}`)
        // call ai process api
        const aiProcessResponse = await axios.post(`${extratorAPI}`, {
            email: email,
            s3_folder_url: folderUrl
        })
        // console.log("extractor service response", aiProcessResponse.data)
        return;

    }
    catch (err: any) {
        // console.log(`Extractor service error: ${err.name} - ${err.message}`);

        // Add more detailed error logging
        if (err.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            // console.log("Error response data:", err.response.data);
            // console.log("Error response status:", err.response.status);
            // console.log("Error response headers:", err.response.headers);
        } else if (err.request) {
            // The request was made but no response was received
            // console.log("Error request:", err.request);
        }

        // Instead of crashing the application, return false and log the error
        // console.error("Failed to process extraction request:", err);
        return;
    }
}

// invoice service
export const invoiceAgentService = async (request: InvoiceAGentRequest) => {
    try {
        const { email, file } = request;
        if (!email || !file) {
            throw new BadRequestError("provide email and file to process invoice ai")
        }

        // console.log(`request came in invoice ai ${email} || ${file}`)
        const url = invoiceAPI
        const body: InvoiceAGentRequest = {
            email: email,
            file: file
        }

        // Log the request body for debugging
        // console.log('Request body:', JSON.stringify(body, null, 2));

        // Create form data
        const form = new FormData();
        form.append('email', email);

        // Append the file buffer directly with a filename
        form.append('file', Buffer.from(file), {
            filename: 'data.csv',
            contentType: 'text/csv',
        });

        const res = await axios.post(url, form, {
            headers: {
                ...form.getHeaders()
            }
        })

        if (res.data.detail) {
            // console.log('API Error Details:', res.data.detail);
            throw new Error(Array.isArray(res.data.detail) ? res.data.detail[0] : res.data.detail);
        }

        // console.log("Invoice API response:", res.data)

        return res.data;

    } catch (err: any) {
        // console.log(err)
        // console.log("Error in invoice agent service:", err.message);
        throw new Error(`Error processing invoice: ${err.message}`);
    }
}