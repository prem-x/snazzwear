from django.shortcuts import get_object_or_404, render, redirect
from django.http import JsonResponse
from products.models import ProductVariant
from orders.models import Coupon
from .models import Cart, CartItem

def get_or_create_cart(request):
    if request.user.is_authenticated:
        cart, created = Cart.objects.get_or_create(user=request.user)
    else:
        if not request.session.session_key:
            request.session.create()
        session_id = request.session.session_key
        cart, created = Cart.objects.get_or_create(session_id=session_id, user=None)
    return cart


# ================= ADD TO CART =================

def add_to_cart(request):
    if request.method == "POST":
        variant_id = request.POST.get("variant_id")
        variant = get_object_or_404(ProductVariant, id=variant_id)

        # Check stock
        if variant.stock <= 0:
            return JsonResponse({
                "success": False,
                "message": "Out of stock"
            })

        cart = get_or_create_cart(request)

        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product_variant=variant
        )

        if not created:
            if cart_item.quantity < variant.stock:
                cart_item.quantity += 1
                cart_item.save()
            else:
                return JsonResponse({
                    "success": False,
                    "message": "No more stock available"
                })

        return JsonResponse({"success": True})

    return JsonResponse({"success": False})


# ================= CART PAGE =================

def cart_page(request):
    cart = get_or_create_cart(request)
    items = []

    if cart:
        items = CartItem.objects.filter(cart=cart)

    subtotal = 0
    original_total = 0

    for item in items:
        item_total = item.total_price()
        subtotal += item_total
        original_total += item.product_variant.product.price * item.quantity

    saved_amount = original_total - subtotal
    cart_count = sum(item.quantity for item in items)
    
    # Handle Coupon
    discount_percentage = 0
    coupon_code = request.session.get("coupon_code")
    if coupon_code:
        try:
            coupon = Coupon.objects.get(code=coupon_code, active=True)
            discount_percentage = coupon.discount_percentage
            discount_amount = (subtotal * discount_percentage) / 100
            saved_amount += discount_amount
            subtotal -= discount_amount
        except Coupon.DoesNotExist:
            del request.session["coupon_code"]

    return render(request, "cart/cart.html", {
        "items": items,
        "subtotal": subtotal,
        "original_total": original_total,
        "saved_amount": saved_amount,
        "cart_count": cart_count,
        "discount_percentage": discount_percentage,
        "coupon_code": coupon_code,
    })


# ================= UPDATE QUANTITY =================

def update_quantity(request):
    if request.method == "POST":
        item_id = request.POST.get("item_id")
        action = request.POST.get("action")

        cart_item = get_object_or_404(CartItem, id=item_id)

        if action == "increase":
            if cart_item.quantity < cart_item.product_variant.stock:
                cart_item.quantity += 1
                cart_item.save()

        elif action == "decrease":
            if cart_item.quantity > 1:
                cart_item.quantity -= 1
                cart_item.save()
            else:
                cart_item.delete()

        return JsonResponse({"success": True})

    return JsonResponse({"success": False})

# ================= UPDATE SIZE =================

def update_size(request):
    if request.method == "POST":
        item_id = request.POST.get("item_id")
        variant_id = request.POST.get("variant_id")

        cart_item = get_object_or_404(CartItem, id=item_id)
        new_variant = get_object_or_404(ProductVariant, id=variant_id)

        existing_item = CartItem.objects.filter(cart=cart_item.cart, product_variant=new_variant).first()
        
        if existing_item and existing_item.id != cart_item.id:
            existing_item.quantity += cart_item.quantity
            existing_item.save()
            cart_item.delete()
        else:
            cart_item.product_variant = new_variant
            if cart_item.quantity > new_variant.stock:
                cart_item.quantity = new_variant.stock
            cart_item.save()

        return JsonResponse({"success": True})
        
    return JsonResponse({"success": False})


# ================= REMOVE ITEM =================

def remove_item(request):
    if request.method == "POST":
        item_id = request.POST.get("item_id")
        cart_item = get_object_or_404(CartItem, id=item_id)
        cart_item.delete()

        return JsonResponse({"success": True})

    return JsonResponse({"success": False})

# ================= APPLY COUPON =================

def apply_coupon(request):
    if request.method == "POST":
        code = request.POST.get("code")
        try:
            coupon = Coupon.objects.get(code=code, active=True)
            request.session["coupon_code"] = coupon.code
            return JsonResponse({"success": True, "discount_percentage": coupon.discount_percentage})
        except Coupon.DoesNotExist:
            return JsonResponse({"success": False, "message": "Invalid or expired coupon"})
            
    return JsonResponse({"success": False})

# ================= CHECKOUT PAGE =================
def checkout_page(request):
    cart = get_or_create_cart(request)
    items = []

    if cart:
        items = CartItem.objects.filter(cart=cart)

    subtotal = sum(item.total_price() for item in items)

    return render(request, "cart/checkout.html", {
        "items": items,
        "subtotal": subtotal
    })