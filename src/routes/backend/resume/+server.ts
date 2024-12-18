import { db } from '$lib/server/db/index.js';
import { JobApplications } from '$lib/server/db/schema.js';
import { error, isHttpError } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const GET = async (event) => {
	// Get page query parameters
	const url = event.url;
	const query = new URLSearchParams(url.search);
	const applicationID = query.get('applicationID');

	if (!applicationID) throw error(400, 'No application ID provided');

	try {
		// Select the jobs from the database that match the query `applicationID` and return it back to the client
		const application = await db
			.select()
			.from(JobApplications)
			.where(eq(JobApplications.Id, applicationID))
			.limit(1)
			.then((res) => res[0]); // Turn the array into an object;

		if (!application) throw error(404, 'Application not found');

		// Convert the data URI into a buffer that can be sent to the client
		const regex = /^data:(.*);base64,(.*)$/;
		const matches = regex.exec(application.ResumeUrl);
		if (!matches) {
			throw error(400, 'File corrupt or not found');
		}
		const mimeType = matches[1];
		const base64Data = matches[2];
		const data = Buffer.from(base64Data, 'base64');

		// Return the data to the client
		return new Response(data, {
			status: 200,
			headers: {
				'Content-Type': mimeType
				// Uncomment the below line to download the file instead of displaying it in the browser
				//'Content-Disposition': `attachment; filename=${application.Id}`
			}
		});
	} catch (e) {
        if(isHttpError(e)) throw e;
		const error_obj = e as Error;
		throw error(500, error_obj.message);
	}
};
