import os
import time
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options

url = "http://www.cprh.pe.gov.br:81/silia/resgate_licenca/resgate_licenca.php"
processo = "000140/2023"
chave = "F86MBGBAeF419111186"

# Configurar o Selenium para trabalhar com o Chrome
chrome_options = Options()
chrome_options.add_experimental_option("prefs", {
    "download.default_directory": os.getcwd(),
    "download.prompt_for_download": False,
    "download.directory_upgrade": True,
    "plugins.always_open_pdf_externally": True,
})

driver = webdriver.Chrome(options=chrome_options)

# Acessar o site
driver.get(url)

# Digitar o processo e a chave nos campos apropriados
campo_processo = driver.find_element(by=webdriver.common.by.By.ID, value="id_sc_field_processo")
campo_processo.send_keys(processo)
campo_chave = driver.find_element(by=webdriver.common.by.By.ID, value="id_sc_field_chave")
campo_chave.send_keys(chave)

# Clicar no botão
botao = driver.find_element(by=webdriver.common.by.By.ID, value="sc_Ok_bot")
botao.click()

# Aguardar o download do PDF
time.sleep(10)

# Fechar o navegador
driver.quit()
