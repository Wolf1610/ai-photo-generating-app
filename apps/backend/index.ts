
import express from "express";
import { GenerateImage, GenerateImagesFromPrompt, TrainModel } from "common/types"
import { prismaClient } from "db/client";

const app = express();
const PORT = process.env.PORT;

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

        const { name, type, age, ethinicity, eyeColor, bald } = parsedBody.data;

        const data = await prismaClient.model.create({
            data: {
                name,
                type,
                age,
                ethinicity: ethinicity as any,
                eyeColor,
                bald,
                userId: USER_ID
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

    const { prompt, modelId } = parsedBody.data;

    const data = await prismaClient.outputImages.create({
        data: {
            prompt,
            userId: USER_ID,
            modelId,
            imageUrl: ""
        }
    })

    res.json({
        imageId: data.id
    })
});

app.get("/pack/bulk", (req, res) => {
    res.json({
        message: "From pack"
    })
});

app.get("/image", (req, res) => {
    res.json({
        message: "From pack"
    })
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
