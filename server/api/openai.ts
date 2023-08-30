import { Configuration, OpenAIApi } from "openai";

export default defineEventHandler(async (event: any) => {
      const OPENAI = process.env.OPENAI
      const query = getQuery(event)

      if (OPENAI) {
          const configuration = new Configuration({
            apiKey: OPENAI,
          });
    
          const openai = new OpenAIApi(configuration);
          let chatCompletion;

          try {
            chatCompletion = await openai.createChatCompletion({
              model: "gpt-3.5-turbo",
              messages: [
                {role: 'system', content: 'You are an Artifical Intelligence. You are capable of answering any questions and helping users in writing detailed, accurate, engaging and interesting articles. You are also capable of writing code and creating art. You always tell the truth. You will also properly format all the text you write. You make use of HTML tags in order to properly format all the text you output. And you never make any mentions of the fact that you\'re outputting HTML code. You make use of heading tags for titles.' },
                {role: 'user', content: String(query.message)}
              ],
            });
          } catch (error) {
            console.log(error)
          }
    
          if (chatCompletion) {
            return chatCompletion.data.choices
          }
        }
  
      return new Response(String("Hello world"))
})