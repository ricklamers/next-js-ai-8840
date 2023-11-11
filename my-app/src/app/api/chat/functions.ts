import { ChatCompletionCreateParams } from "openai/resources/chat/index";

export const functions: ChatCompletionCreateParams.Function[] = [
  {
    name: "get_top_stories",
    description:
      "Get the top stories from Hacker News. Also returns the Hacker News URL to each story.",
    parameters: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "The number of stories to return. Defaults to 10.",
        },
      },
      required: [],
    },
  },
];

async function get_top_stories(limit: number = 10) {
  const response = await fetch(
    "https://hacker-news.firebaseio.com/v0/topstories.json",
  );
  const ids = await response.json();
  const stories = await Promise.all(
    ids.slice(0, limit).map((id: number) => get_story(id)),
  );
  return stories;
}

async function get_story(id: number) {
  const response = await fetch(
    `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
  );
  const story = await response.json();
  return `${story.title} (${story.url})`;
}

export async function runFunction(name: string, args: any) : Promise<Array<string>> {
  switch (name) {
    case "get_top_stories":
      return await get_top_stories();
    default:
      return [];
  }
}