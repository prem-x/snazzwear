from django.db import models
from django.contrib.auth.models import User
from products.models import ProductVariant


class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    session_id = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return f"Cart {self.id} for {self.user.username if self.user else self.session_id}"

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    product_variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)

    def total_price(self):
        return self.product_variant.product.price * self.quantity