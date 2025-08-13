from google.cloud import vision
import io

# Substitua 'caminho_para_sua_chave.json' pelo caminho da sua chave de conta de serviço
client = vision.ImageAnnotatorClient.from_service_account_json("/Users/filipe/Google Drive/faa consultoria/engea/engea-gpt-289577149211.json")

# Substitua 'path/to/your/image.jpg' pelo caminho da sua imagem
with io.open('/Users/filipe/Google Drive/faa consultoria/engea/licencas gpt/arquivos/imagens/BUT - LO Nº 179-2021 - RSU - Vencimento 22-11-27.jpg', 'rb') as image_file:
    content = image_file.read()

image = vision.Image(content=content)
response = client.text_detection(image=image)

for page in response.full_text_annotation.pages:
    for block in page.blocks:
        for paragraph in block.paragraphs:
            paragraph_text = ''.join([symbol.text for word in paragraph.words for symbol in word.symbols])
            print(paragraph_text)
            print('\n')  # Adiciona uma linha em branco entre parágrafos para melhor legibilidade

if response.error.message:
    raise Exception('{}\nFor more info on error messages, check: '
                    'https://cloud.google.com/apis/design/errors'.format(response.error.message))