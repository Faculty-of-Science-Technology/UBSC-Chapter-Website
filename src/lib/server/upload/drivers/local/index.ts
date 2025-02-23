import { db } from "$lib/server/db";
import { MediaPool } from "$lib/server/db/schema";

export function saveToMediaPool(data: Buffer, mimeType: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const blob = new Blob([data], { type: mimeType });
        const formData = new FormData();
        formData.append('file', blob, 'file');
        formData.append('mimeType', mimeType);
        
        const response = db.insert(MediaPool).values({ 
            File: data,
            MimeType: mimeType }).execute();
        
    });
}