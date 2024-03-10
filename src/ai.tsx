import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

async function createTitle(jsonObject:any) {
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

function createPrompt(contentArray: any) {
  return (
    "You are very good at generating titles base on the digital whiteboard's content. Can you please create the title for this content which are grouped: " +
    contentArray + "in max 10 words, following [main idea]: [sub idea] format? If the content is not meaningful, please update title as 'The board is farley empty'"
  );
};

export async function addTitle(jsonObject: any) {
  for (const cluster in jsonObject) {
    const subClusterTitles: string[] = [];
    if (Array.isArray(jsonObject[cluster].content)) {
      jsonObject[cluster].title = await createTitle(jsonObject[cluster].content);
    } else {
      const clusterObj = jsonObject[cluster].content;
      for (const subCluster in clusterObj) {
        if (clusterObj[subCluster].title === "No Title") {
          const title = await createTitle(clusterObj[subCluster].content);
          clusterObj[subCluster].title = title;
          subClusterTitles.push(title);
        }
      }
      jsonObject[cluster].title = await createTitle(subClusterTitles);
    }
  }

  return jsonObject;
}
