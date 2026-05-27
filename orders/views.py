import razorpay
from django.conf import settings
from django.shortcuts import render, redirect
from cart.models import Cart, CartItem
from cart.views import get_or_create_cart
from .models import Order, OrderItem, Coupon
from django.core.mail import send_mail

def checkout(request):
    cart = get_or_create_cart(request)
    items = CartItem.objects.filter(cart=cart)

    if not items.exists():
        return redirect('home')

    subtotal = sum(item.total_price() for item in items)
    shipping = 0 if subtotal > 999 else 80
    discount = 0
    coupon_obj = None

    coupon_code = request.POST.get("coupon")
    if coupon_code:
        try:
            coupon_obj = Coupon.objects.get(code=coupon_code, active=True)
            discount = subtotal * coupon_obj.discount_percentage / 100
        except Coupon.DoesNotExist:
            coupon_obj = None

    final_total = subtotal - discount + shipping

    if request.method == "POST":
        email = request.POST.get("email")
        country = request.POST.get("country", "India")
        first_name = request.POST.get("first_name")
        last_name = request.POST.get("last_name")
        address = request.POST.get("address")
        apartment = request.POST.get("apartment", "")
        city = request.POST.get("city")
        state = request.POST.get("state")
        pincode = request.POST.get("pincode")
        phone = request.POST.get("phone")
        payment_method = request.POST.get("payment_method", "razorpay")

        full_address = f"{address}, {apartment}\n{city}, {state} {pincode}\n{country}"

        order = Order.objects.create(
            user=request.user if request.user.is_authenticated else None,
            first_name=first_name,
            last_name=last_name,
            email=email,
            phone=phone,
            total_amount=final_total,
            shipping_address=full_address,
            coupon=coupon_obj,
            status="pending"
        )

        for item in items:
            OrderItem.objects.create(
                order=order,
                product_variant=item.product_variant,
                quantity=item.quantity,
                price=item.product_variant.product.price
            )

        if payment_method == "cod":
            order.payment_id = "COD"
            order.status = "pending"
            order.save()
            return redirect(f"/orders/success/?order_id={order.id}")

        try:
            client = razorpay.Client(
                auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
            )
            razorpay_order = client.order.create({
                "amount": int(final_total * 100),
                "currency": "INR",
            })
            order.payment_id = razorpay_order["id"]
            order.save()
            return render(request, "orders/payment.html", {
                "order": order,
                "razorpay_key": settings.RAZORPAY_KEY_ID,
                "razorpay_order_id": razorpay_order["id"],
                "amount": final_total,
            })
        except Exception as e:
            # Fallback to COD if Razorpay fails
            order.payment_id = "COD_FALLBACK"
            order.status = "pending"
            order.save()
            return redirect(f"/orders/success/?order_id={order.id}")

    return render(request, "cart/checkout.html", {
        "items": items,
        "subtotal": subtotal,
        "shipping": shipping,
    })


def payment_success(request):
    payment_id = request.GET.get("payment_id")
    order_id = request.GET.get("order_id")

    if payment_id:
        order = Order.objects.filter(payment_id=payment_id).first()
    elif order_id:
        order = Order.objects.filter(id=order_id).first()
    else:
        order = None

    if order:
        if payment_id:
            order.status = "paid"
            order.save()

        # Reduce stock
        for item in order.orderitem_set.all():
            variant = item.product_variant
            if variant.stock >= item.quantity:
                variant.stock -= item.quantity
                variant.save()

        # Clear cart
        cart = get_or_create_cart(request)
        CartItem.objects.filter(cart=cart).delete()

        # Send email (gracefully ignore if email is not configured locally)
        try:
            send_mail(
                "Order Confirmed",
                f"Your Order #{order.id} is confirmed! Thank you for shopping at Snazz Wear.",
                settings.EMAIL_HOST_USER,
                [order.email] if order.email else (request.user.email if request.user.is_authenticated else []),
                fail_silently=True
            )
        except Exception:
            pass

        return redirect(f"http://localhost:3000/success/?order_id={order.id}")
    
    return redirect("http://localhost:3000/")