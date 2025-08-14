from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from app.routers import auth, processos, licencas, exigencias, dashboard
from app.utils.firebase import initialize_firebase
from app.utils.env_loader import load_env_from_yaml

# Carregar variáveis de ambiente do YAML
load_env_from_yaml()

# Inicializar Firebase
initialize_firebase()

# Criar aplicação FastAPI
app = FastAPI(
    title="EcoSync API",
    description="API para gestão de licenças ambientais",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "EcoSync API", "status": "online"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT"))
    uvicorn.run(app, host="0.0.0.0", port=port)