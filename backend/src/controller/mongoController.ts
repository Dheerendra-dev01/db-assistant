import mongoose from 'mongoose';
import axios from 'axios';
import { Request, Response } from 'express';

 class MongoController {
  constructor(){}

  public connectDB = async (req: Request, res: Response): Promise<void> => {
<<<<<<< HEAD
  const { mongoUri } = req.body;

  if (!mongoUri) {
    res.status(400).json({ success: false, message: 'mongoUri is required' });
    return;
  }

  try {
    const dbConnection = await mongoose.connect(mongoUri, {});
=======

    console.log("void--------->>>>>", Promise<void>)
    const { mongoUri } = req.body;
     let  dbConnection:any
     console.log("dbConnection---------->>>>>>")


    try {
      dbConnection = await mongoose.connect(mongoUri, {});
      console.log(dbConnection)
      res.json({ success: true, message: 'MongoDB connected successfully' });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: 'MongoDB connection failed',
        error: err.message,
      });
    }
  };
>>>>>>> 515aa1ff55a528aacbdcc1a29e70e6c7c73ba5cb

    res.json({
      success: true,
      message: 'MongoDB connected successfully',
      host: dbConnection.connection.host,
      db: dbConnection.connection.name,
    });
  } catch (err: any) {
    console.error("DB Connection Error:", err.message);
    res.status(500).json({
      success: false,
      message: 'MongoDB connection failed',
      error: err.message,
    });
  }
};


public handleQuery = async (req: Request, res: Response): Promise<void> => {
  const { prompt, collectionName } = req.body;

<<<<<<< HEAD
  if (!prompt || !collectionName) {
    res.status(400).json({ success: false, message: 'Prompt and collectionName are required' });
    return;
  }
=======
>>>>>>> 515aa1ff55a528aacbdcc1a29e70e6c7c73ba5cb

  if (mongoose.connection.readyState !== 1 || !mongoose.connection.db) {
    res.status(400).json({ success: false, message: 'No DB connection' });
    return;
  }

  const data = JSON.stringify({
    contents: [
      {
        parts: [
          {
text: `You are a MongoDB query generator. ONLY return the MongoDB query as a JSON object. Do not include any explanation or text. Use the MongoDB collection named "${collectionName}". Convert the following prompt into a valid MongoDB query:\n\nPrompt: ${prompt}`
          }
        ]
      }
    ]
  });

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
    headers: {
      'Content-Type': 'application/json',
      'X-goog-api-key': process.env.GEMINI_API_KEY || '', // Ensure this is defined in .env
    },
    data: data,
  };

  try {
    const geminiRes = await axios.request(config);


    console.log("geminiRes------------->>>>",geminiRes)

    let generatedText = geminiRes.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    console.log("Generated Text:", generatedText);

    generatedText = generatedText.replace(/```(?:json)?\s*|```/g, '').trim();


    console.log("generatedText---------------->>>>",generatedText)

    let mongoQuery;
    try {
      mongoQuery = JSON.parse(generatedText);
      console.log("mongoQuery---------------------->>>>>>",mongoQuery)
    } catch (parseErr: any) {
      res.status(400).json({
        success: false,
        message: 'Failed to parse generated query as JSON',
        error: parseErr.message,
        rawQuery: generatedText,
      });
      return;
    }

    const collection = mongoose.connection.db.collection(collectionName);

<<<<<<< HEAD
  let result;
=======
    // Check if it's an aggregation pipeline (array) or a simple find query (object)
    const result = Array.isArray(mongoQuery) ? await collection.aggregate(mongoQuery).toArray(): await collection.find(mongoQuery).toArray();
>>>>>>> 515aa1ff55a528aacbdcc1a29e70e6c7c73ba5cb

if (mongoQuery.find) {
  // Gemini returned a command-style query
  if (mongoQuery.find === collectionName) {
    result = await collection.find({}).toArray();
  } else {
     res.status(400).json({
      success: false,
      message: `Query collection mismatch. Expected "${collectionName}", got "${mongoQuery.find}"`,
      rawQuery: mongoQuery,
    });
  }
} else if (Array.isArray(mongoQuery)) {
  // Aggregation pipeline
  result = await collection.aggregate(mongoQuery).toArray();
} else {
  // Normal filter query
  result = await collection.find(mongoQuery).toArray();
}
    res.json({ success: true, mongoQuery, result });

  } catch (err: any) {
    console.error('Error in /query:', err.response?.data || err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};


};
 
export default MongoController

