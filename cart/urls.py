from django.urls import path
from . import views

urlpatterns = [
    path("", views.cart_page, name="cart_page"),
    path("add/", views.add_to_cart, name="add_to_cart"),
    path("update/", views.update_quantity, name="update_quantity"),
    path("update-size/", views.update_size, name="update_size"),
    path("remove/", views.remove_item, name="remove_item"),
    path("apply-coupon/", views.apply_coupon, name="apply_coupon"),
    path("checkout/", views.checkout_page, name="checkout_page"),
]