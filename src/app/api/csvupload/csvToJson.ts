import openai from "openai";

export async function csvToJson(csvContent: string): Promise<unknown> {
  // Initialize OpenAI API
  const client = new openai({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Prepare the prompt
  const prompt = `Please convert the following CSV data into a JSON object matching the schema: 
  export type Product = {
    id: string;
    name: string;
    price: string; // Numerical value only, no currency symbol
    image: string;
  };

  RESPONSE FORMATTING: JSON string, no markdown.
  
  CSV:\n${csvContent}`;

  try {
    // Call the OpenAI API
    const response = await client.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: "You are a CSV to JSON converter bot.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // Extract and parse the JSON from the response
    try {
      const jsonResponse = JSON.parse(
        response.choices[0].message.content as string
      );

      // Further processing, validation, etc.
      return jsonResponse;
    } catch (error) {
      console.error(
        "Error parsing JSON from OpenAI response:",
        error,
        csvContent
      );
      throw error;
    }
  } catch (error) {
    console.error("Error calling OpenAI:", error, csvContent);
    throw error;
  }
}
