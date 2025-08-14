from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

# from app.routers import auth, processos, licencas, exigencias, dashboard
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
    """Endpoint de healthcheck com informações de status dos serviços"""
    from app.utils.firebase import get_firestore_client, get_storage_bucket
    import datetime
    
    status = {
        "status": "healthy",
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "version": "1.0.0",
        "environment": os.getenv("ENVIRONMENT", "unknown"),
        "services": {}
    }
    
    # Verificar Firestore
    try:
        db = get_firestore_client()
        # Teste simples de conexão
        collections = list(db.collections())
        status["services"]["firestore"] = "healthy"
    except Exception as e:
        status["services"]["firestore"] = f"unhealthy: {str(e)}"
        status["status"] = "degraded"
    
    # Verificar Storage
    try:
        bucket = get_storage_bucket()
        bucket.get_blob("healthcheck") # Teste de acesso
        status["services"]["storage"] = "healthy"
    except Exception as e:
        status["services"]["storage"] = f"unhealthy: {str(e)}"
        status["status"] = "degraded"
    
    return status

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT"))
    uvicorn.run(app, host="0.0.0.0", port=port)