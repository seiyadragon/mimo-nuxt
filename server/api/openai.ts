import { Configuration, OpenAIApi } from "openai";
import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event: any) => {
      const OPENAI = process.env.OPENAI as string
      const query = getQuery(event)

      const SUPABASE_URL = process.env.SUPABASE_URL as string
      const SUPABASE_KEY = process.env.SUPABASE_KEY as string

      let supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

      let { data, error } = await supabase.from('UserData').select('aiTokens').eq('user_id', query.userid).single()

      let errors = []

      if (error) {
        console.log(error)
        errors.push(error)
      }

      if (!data) {
        errors.push('No data found.')
      }

      if (data?.aiTokens == 0) {
        errors.push('You have run out of tokens.')
      }

      if (errors.length > 0) {
        return new Response(String(errors))
      }

      console.log('OpenAI key: ' + OPENAI)

      console.log('User ID: ' + query.userid)
      console.log('User has ' + data?.aiTokens + ' tokens left.')

      if (OPENAI) {
          console.log('OpenAI key found.')

          const configuration = new Configuration({
            apiKey: OPENAI,
          });
    
          const openai = new OpenAIApi(configuration);
          let chatCompletion;

          try {
            console.log('Trying to create chat completion.')

            chatCompletion = await openai.createChatCompletion({
              model: "gpt-3.5-turbo",
              messages: [
                {role: 'system', content: 'You are an Artifical Intelligence. You are capable of answering any questions and helping users in writing detailed, accurate, engaging and interesting articles. You are also capable of writing code and creating art. You always tell the truth. You will also properly format all the text you write. You make use of HTML tags in order to properly format all the text you output. And you never make any mentions of the fact that you\'re outputting HTML code. You make use of heading tags for titles.' },
                {role: 'user', content: String(query.message)}
              ],
            });
          } catch (error) {
            console.log(error)
            errors.push(error)

            return new Response(String(errors))
          }
    
          if (chatCompletion) {
            console.log('Chat completion created.')
            
            let totalTokensUsed = parseInt((chatCompletion.data.usage?.total_tokens as number / 100).toString())
            console.log("Tokens used: " + totalTokensUsed)
            
            if (totalTokensUsed > data?.aiTokens) {
              console.log('User has run out of tokens.')
              errors.push('You have run out of tokens.')

              await supabase.from('UserData').update({ aiTokens: 0 }).eq('user_id', query.userid)
            } else {
              console.log('User has ' + (data?.aiTokens - totalTokensUsed) + ' tokens left.')
              let { error } = await supabase.from('UserData').update({ aiTokens: (data?.aiTokens - totalTokensUsed) as number }).eq('user_id', query.userid)

              if (error) {
                console.log(error)
                errors.push(error)
              }
            }

            return chatCompletion.data.choices
          }
      }
      
      errors.push('No OpenAI key found.')

      return new Response(String(errors))
})