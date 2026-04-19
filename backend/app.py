
from flask import Flask
from flask_cors import CORS
from config import Config

#Import routes

from routes.health import health_bp

def create_app():
    app=Flask(__name__)
    app.config.from_object(Config)  #Reads all UPPERCASE attributes from your Config class
    
    CORS(app)
    
    #register blueprints
    app.register_blueprint(health_bp)
    
    return app


if __name__=="__main__":
    app=create_app()
    app.run(port=Config.PORT,debug=Config.DEBUG)