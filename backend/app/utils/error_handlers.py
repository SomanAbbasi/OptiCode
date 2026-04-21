""""
Error Response

{
  "status": "error",
  "code": 404,
  "message": "The requested resource was not found."
}

"""
from flask import jsonify

def error_handlers(app):
    
    # 404 Bad Request
    @app.errorhandler(400)
    def bad_request(e):
        return jsonify(
            {
                "status":"error",
                "code":400,
                "message":"Bad request.The server could not understand the request"
            }),400
        
    # 404 not found
    @app.errorhandler(404)
    def not_found(e):
        return jsonify(
            {
                "status":"error",
                "code":404,
                "message":"The requested resource was not found."
            }),404
    
    
      #  405 Method Not Allowed 
    @app.errorhandler(405)
    def method_not_allowed(e):
        return jsonify({
            "status": "error",
            "code": 405,
            "message": "HTTP method not allowed on this endpoint."
        }), 405

    #  422 Unprocessable Entity 
    @app.errorhandler(422)
    def unprocessable_entity(e):
        return jsonify({
            "status": "error",
            "code": 422,
            "message": "Request was well-formed but contained semantic errors."
        }), 422

    #  429 Too Many Requests 
    @app.errorhandler(429)
    def too_many_requests(e):
        return jsonify({
            "status": "error",
            "code": 429,
            "message": "Too many requests. Please slow down."
        }), 429

    # 500 Internal Server Error
    @app.errorhandler(500)
    def internal_server_error(e):
        return jsonify({
            "status": "error",
            "code": 500,
            "message": "An internal server error occurred. Please try again later."
        }), 500

    #Catch-All for Unhandled Exceptions 
    @app.errorhandler(Exception)
    def unhandled_exception(e):
        return jsonify({
            "status": "error",
            "code": 500,
            "message": f"Unexpected error: {str(e)}"
        }),