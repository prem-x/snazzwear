from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from snazzwear import api

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('django.contrib.auth.urls')),
    
    # REST API endpoints
    path('api/home/', api.api_home, name='api_home'),
    path('api/products/', api.api_products, name='api_products'),
    path('api/products/<slug:slug>/', api.api_product_detail, name='api_product_detail'),
    path('api/wishlist/', api.api_wishlist, name='api_wishlist'),
    path('api/cart/', api.api_cart, name='api_cart'),
    path('api/cart/add/', api.api_cart_add, name='api_cart_add'),
    path('api/cart/update-quantity/', api.api_cart_update_quantity, name='api_cart_update_quantity'),
    path('api/cart/update-size/', api.api_cart_update_size, name='api_cart_update_size'),
    path('api/cart/remove/', api.api_cart_remove, name='api_cart_remove'),
    path('api/cart/apply-coupon/', api.api_cart_apply_coupon, name='api_cart_apply_coupon'),
    path('api/checkout/', api.api_checkout, name='api_checkout'),
    path('api/auth/status/', api.api_auth_status, name='api_auth_status'),
    path('api/auth/check-phone/', api.api_auth_check_phone, name='api_auth_check_phone'),
    path('api/auth/login/', api.api_auth_login, name='api_auth_login'),
    path('api/auth/signup/', api.api_auth_signup, name='api_auth_signup'),
    path('api/auth/logout/', api.api_auth_logout, name='api_auth_logout'),

    # Template routes (fallback)
    path('', include('core.urls')),
    path('shop/', include('products.urls')),
    path("cart/", include("cart.urls")),
    path("orders/", include("orders.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)