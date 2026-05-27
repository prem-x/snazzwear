from django.urls import path
from . import views

urlpatterns = [
    path('', views.shop, name='shop'),
    path('wishlist/', views.wishlist_page, name='wishlist_page'),
    path('wishlist/toggle/', views.toggle_wishlist, name='toggle_wishlist'),
    path('<slug:slug>/', views.product_detail, name='product_detail'),
]