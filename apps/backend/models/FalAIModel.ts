import { fal } from "@fal-ai/client";
import { BaseModel } from "./BaseModel";

export default class FalAIModel {
    constructor(){}

    // You can't really do a function call wait for some time to get back result, Why?? Because Backend go up and down very quickly often, 
    
    // If function takes 5sec to get back the image if the backend crashed user will never get back the updated image

    // we can't subscribe an event for 30 min

    public async generateImage(prompt: string, tensorPath: string){
        const { request_id, response_url } = await fal.queue.submit("fal-ai/flux-lora", {
            input: { 
                prompt: prompt,
                loras: [{ path: tensorPath, scale: 1 }]
            },
            webhookUrl: `${process.env.WEBHOOK_BASE_URL}/fal-ai/webhook/image`
        })
        return { request_id, response_url };
    }

    public async trainModel(zipUrl: string, triggerWord: string) {
        const { request_id, response_url } = await fal.queue.submit("fal-ai/flux-lora-fast-training", {
            input: {
                images_data_url: zipUrl,
                trigger_word: triggerWord
            },
            webhookUrl: `${process.env.WEBHOOK_BASE_URL}/fal-ai/webhook/train`
        })

        return { request_id, response_url };
    }
}

