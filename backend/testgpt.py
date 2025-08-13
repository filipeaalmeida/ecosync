# This code is for v1 of the openai package: pypi.org/project/openai
from openai import OpenAI
import env
client = OpenAI(api_key=env.OPENAI_API_KEY)

response = client.chat.completions.create(
  model="gpt-3.5-turbo",
  messages=[
    {
      "role": "system",
      "content": "você é um médico"
    },
    {
      "role": "user",
      "content": "qual o remédio para dor de cabeça?"
    },
  ],
  temperature=1,
  max_tokens=256,
  top_p=1,
  frequency_penalty=0,
  presence_penalty=0
)

print(type(response))
print(">>>>>>>>>>>>>>")
print(response)