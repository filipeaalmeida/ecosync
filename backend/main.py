from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from app.routers import auth, processos, licencas, exigencias, dashboard
from app.utils.firebase import initialize_firebase

# Carregar variáveis de ambiente
load_dotenv()

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

# Incluir routers
app.include_router(auth.router, prefix="/api/auth", tags=["Autenticação"])
app.include_router(processos.router, prefix="/api/processos", tags=["Processos"])
app.include_router(licencas.router, prefix="/api/licencas", tags=["Licenças"])
app.include_router(exigencias.router, prefix="/api/exigencias", tags=["Exigências"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])

@app.get("/")
async def root():
    return {"message": "EcoSync API", "status": "online"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)