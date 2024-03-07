import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const createTitle = async (jsonObject: any) => {
  const prompt = createPrompt(jsonObject);

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }]
  });

  if (!completion.choices[0].message) {
    throw new Error("Message object in Openai response is empty.");
  }

  const content = completion.choices[0].message.content;

  if (!content) {
    throw new Error("Content in message object in openai response is empty.");
  }
  return content;
};

const createPrompt = (contentArray: any) => {
  return (
    "You are very good at generating titles for the low vision readers. Can you please create the title for this content which are grouped: " +
    contentArray
  );
};

export { createTitle };
