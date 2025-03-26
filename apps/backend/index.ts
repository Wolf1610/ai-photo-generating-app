
import express from "express";
import { S3Client } from "bun";

import { GenerateImage, GenerateImagesFromPack, TrainModel } from "common/types"
import { prismaClient } from "db/client";
import FalAIModel from "./models/FalAIModel";


const app = express();
const PORT = process.env.PORT;

const falAIModel = new FalAIModel();


// This user is comes from clerk
const USER_ID = "1234";

app.use(express.json());

app.get("/", (req, res) => {

    res.json({
        message: "Hi From Me"
    });
});

app.post("/ai/training", async (req, res) => {
    try {
        const parsedBody = TrainModel.safeParse(req.body);

        if (!parsedBody.success) {
            res.status(411).json({
                message: "Input incorrect"
            });
            return
        }

        const { request_id, response_url } = await falAIModel.trainModel(parsedBody.data.zipUrl, parsedBody.data.name);

        const { name, type, age, ethinicity, eyeColor, bald } = parsedBody.data;

        const data = await prismaClient.model.create({
            data: {
                name,
                type,
                age,
                ethinicity: ethinicity as any,
                eyeColor,
                bald,
                userId: USER_ID,
                falAIReqiestId: request_id
            }
        })

        res.json({
            modelId: data.id
        })
    } catch (error) {
        res.json({
            message: "Something went wrong in Training"
        })
    }
});

app.post("/ai/generate", async (req, res) => {
    const parsedBody = GenerateImage.safeParse(req.body);

    if (!parsedBody.success) {
        res.status(400).json({
            message: "Invalid input"
        })
        return;
    }

    const model = await prismaClient.model.findUnique({
        where: {
            id: parsedBody.data.modelId
        }
    })


    if (!model || !model.tensorPath) {
        res.status(411).json({
            message: "Model not found."
        })
        return
    }

    const { request_id, response_url } = await falAIModel.generateImage(parsedBody.data.prompt, model?.tensorPath);


    const { prompt, modelId } = parsedBody.data;

    const data = await prismaClient.outputImages.create({
        data: {
            prompt,
            userId: USER_ID,
            modelId,
            imageUrl: "",
            falAIReqiestId: request_id
        }
    })

    res.json({
        imageId: data.id
    })
});

app.post("/pack/generate",   async (req, res) => {
    const parsedBody = GenerateImagesFromPack.safeParse(req.body);

    if (!parsedBody.success) {
        res.status(411).json({
            message: "Input incorrect"
        })
        return;
    }

    const prompt = await prismaClient.packPrompts.findMany({
        where: {
            packId: parsedBody.data.packId
        }
    })

    const images = await prismaClient.outputImages.createManyAndReturn({
        data: prompt.map((prompt) => ({
            prompt: prompt.prompt,
            userId: USER_ID,
            modelId: parsedBody.data.modelId,
            imageUrl: ""
        }))
    })
    res.json({
        images: images.map((image) => image.id)
    })
});

app.get("/pack/bulk", async (req, res) => {
    const packs = await prismaClient.packPrompts.findMany({})
    // good idea to add caching here
    res.json({
        packs
    });
});

app.get("/image/bulk", async (req, res) => {
    const imageIds = req.query.imageIds as string[];
    const limit = (req.query.limit as string) ?? "100";
    const offSet = (req.query.offSet as string) ?? "0";

    console.log(imageIds);

    const imagesData = await prismaClient.outputImages.findMany({
        where: {
            id: { in: imageIds },
            userId: USER_ID
        },
        skip: parseInt(offSet),
        take: parseInt(limit)
    });

    res.json({
        images: imagesData
    })
});

app.post("/fal-ai/webhook", async (req, res) => {
    console.log(req.body);
    // update the status of the image in the DB
    res.json({
        message: "Webhook received"
    })
})

app.post("/fal-ai/webhook/image", async (req, res) => {
    console.log(req.body);
    // update the status of the image in the DB

    const requestId = req.body.request_id;

    await prismaClient.outputImages.updateMany({
        where: {
            falAIReqiestId: requestId
        },
        data: {
            status: "Generated",
            imageUrl: req.body.image_url
        }
    })

    res.json({
        message: "Webhook received"
    })
})

app.post("/fal-ai/webhook/train", async (req, res) => {
    console.log(req.body);
    // update the status of the image in the DB
    const requestId = req.body.request_id;

    await prismaClient.model.updateMany({
        where: {
            falAIReqiestId: requestId
        }, 
        data: {
            trainingStatus: "Generated",
            tensorPath: req.body.tensor_path
        }
    })

    res.json({
        message: "Webhook received"
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
