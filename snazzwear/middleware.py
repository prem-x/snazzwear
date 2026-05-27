from django.http import HttpResponse

class ApiCorsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Exempt all API calls from CSRF checks to simplify decoupled development
        if request.path.startswith('/api/'):
            request._dont_enforce_csrf_checks = True

        if request.method == "OPTIONS":
            response = HttpResponse()
            self._set_headers(response)
            return response

        response = self.get_response(request)
        self._set_headers(response)
        return response

    def _set_headers(self, response):
        response["Access-Control-Allow-Origin"] = "http://localhost:3000"
        response["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type, X-CSRFToken, Authorization, X-Requested-With"
        response["Access-Control-Allow-Credentials"] = "true"
