import { Response } from "express";
import { db } from "./config/firebase";

interface IEntry {
  title: string;
  text: string;
}

interface IRequest {
  body: IEntry;
  params: { entryId: string };
}

export const addEntry = async (req: IRequest, res: Response) => {
  const { title, text } = req.body;
  try {
    const entry = db.collection("entries").doc();
    const entryObject = {
      id: entry.id,
      title,
      text,
    };

    await entry.set(entryObject);

    return res.status(200).send({
      status: "success",
      message: " entry added successfully",
      data: entryObject,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const getAllEntries = async (req: IRequest, res: Response) => {
  try {
    const allEntries: IEntry[] = [];
    const querySnapshot = await db.collection("entries").get();
    querySnapshot.forEach((doc: any) => allEntries.push(doc.data()));
    return res.status(200).json(allEntries);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const updateEntry = async (req: IRequest, res: Response) => {
  const {
    body: { text, title },
    params: { entryId },
  } = req;
  try {
    const entry = db.collection("entries").doc(entryId);
    const currentData = (await entry.get()).data() || {};

    const entryObject = {
      title: title || currentData.title,
      text: text || currentData.text,
    };

    await entry.update(entryObject);
    return res.status(200).json({
      status: "success",
      message: "entry updated successfully",
      data: entryObject,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const deleteEntry = async (req: IRequest, res: Response) => {
  const { entryId } = req.params;
  try {
    const entry = db.collection("entries").doc(entryId);
    await entry.delete();
    return res.status(200).json({
      status: "success",
      message: "entry deleted successfully",
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
