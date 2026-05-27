import json
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib.auth.models import User
from django.db.models import Q
from products.models import Product, ProductImage, ProductVariant, Size, Wishlist, Category
from cart.models import Cart, CartItem
from cart.views import get_or_create_cart
from orders.models import Order, OrderItem, Coupon
import razorpay
from django.conf import settings

def serialize_product(product, request=None):
    images = product.productimage_set.all()
    image_urls = []
    for img in images:
        if img.image:
            url = img.image.url
            if request:
                url = request.build_absolute_uri(url)
            image_urls.append(url)
            
    # Default fallback if no images
    if not image_urls:
        image_urls = ["/static/images/sample1.png"]

    variants = product.productvariant_set.all()
    variant_data = []
    available_sizes = []
    for var in variants:
        variant_data.append({
            "id": var.id,
            "size": var.size.name,
            "stock": var.stock
        })
        if var.stock > 0:
            available_sizes.append(var.size.name)

    return {
        "id": product.id,
        "name": product.name,
        "slug": product.slug,
        "category": product.category.name,
        "description": product.description,
        "price": float(product.price),
        "is_new": product.is_new,
        "is_top_selling": product.is_top_selling,
        "images": image_urls,
        "image": image_urls[0] if image_urls else None,
        "variants": variant_data,
        "available_sizes": available_sizes,
        "rating": product.average_rating()
    }

from core.models import Slide

# ================= HOME ENDPOINT =================
def api_home(request):
    new_arrivals = Product.objects.filter(is_new=True)[:8]
    top_sellers = Product.objects.filter(is_top_selling=True)[:8]
    all_products = Product.objects.all()[:8]

    slides = Slide.objects.filter(active=True)
    slides_data = []
    for s in slides:
        url = s.image.url if s.image else ""
        if url and request:
            url = request.build_absolute_uri(url)
        slides_data.append({
            "id": s.id,
            "title": s.title,
            "subtitle": s.subtitle,
            "button_text": s.button_text,
            "link": s.link,
            "image": url
        })

    data = {
        "slides": slides_data,
        "new_arrivals": [serialize_product(p, request) for p in new_arrivals],
        "top_sellers": [serialize_product(p, request) for p in top_sellers],
        "all_products": [serialize_product(p, request) for p in all_products],
    }
    return JsonResponse(data)

# ================= PRODUCTS ENDPOINT =================
def api_products(request):
    query = request.GET.get('q', '')
    category_slug = request.GET.get('category', '')
    
    products = Product.objects.all()
    if query:
        products = products.filter(
            Q(name__icontains=query) | Q(description__icontains=query)
        )
    if category_slug:
        products = products.filter(category__slug=category_slug)

    categories = Category.objects.all()
    categories_data = [{"name": c.name, "slug": c.slug} for c in categories]

    return JsonResponse({
        "products": [serialize_product(p, request) for p in products],
        "categories": categories_data,
        "search_query": query
    })

# ================= PRODUCT DETAIL ENDPOINT =================
def api_product_detail(request, slug):
    product = get_object_or_404(Product, slug=slug)
    similar_products = Product.objects.exclude(id=product.id)[:4]
    
    # Reviews
    reviews_data = []
    for r in product.review_set.all():
        reviews_data.append({
            "id": r.id,
            "username": r.user.username if r.user else "Anonymous",
            "rating": r.rating,
            "comment": r.comment,
            "created_at": r.created_at.strftime("%Y-%m-%d")
        })

    data = {
        "product": serialize_product(product, request),
        "similar_products": [serialize_product(p, request) for p in similar_products],
        "reviews": reviews_data
    }
    return JsonResponse(data)

# ================= WISHLIST ENDPOINTS =================
def api_wishlist(request):
    if request.method == "GET":
        if request.user.is_authenticated:
            wishlist_items = Wishlist.objects.filter(user=request.user)
        else:
            session_id = request.session.session_key or ""
            wishlist_items = Wishlist.objects.filter(session_id=session_id)
        
        products = [item.product for item in wishlist_items]
        return JsonResponse({
            "products": [serialize_product(p, request) for p in products]
        })

    elif request.method == "POST":
        try:
            body = json.loads(request.body)
            product_id = body.get("product_id")
        except Exception:
            product_id = request.POST.get("product_id")

        if not product_id:
            return JsonResponse({"success": False, "message": "Product ID required"}, status=400)
            
        product = get_object_or_404(Product, id=product_id)
        
        if request.user.is_authenticated:
            item = Wishlist.objects.filter(user=request.user, product=product).first()
            if item:
                item.delete()
                is_active = False
            else:
                Wishlist.objects.create(user=request.user, product=product)
                is_active = True
        else:
            if not request.session.session_key:
                request.session.create()
            session_id = request.session.session_key
            item = Wishlist.objects.filter(session_id=session_id, product=product).first()
            if item:
                item.delete()
                is_active = False
            else:
                Wishlist.objects.create(session_id=session_id, product=product)
                is_active = True

        return JsonResponse({"success": True, "is_active": is_active})

# ================= CART ENDPOINTS =================
def api_cart(request):
    cart = get_or_create_cart(request)
    items = CartItem.objects.filter(cart=cart)
    
    subtotal = 0
    original_total = 0
    serialized_items = []
    
    for item in items:
        item_total = float(item.total_price())
        subtotal += item_total
        original_total += float(item.product_variant.product.price * item.quantity)
        
        variants = item.product_variant.product.productvariant_set.all()
        variant_data = [{"id": v.id, "size": v.size.name, "stock": v.stock} for v in variants]

        serialized_items.append({
            "id": item.id,
            "product_id": item.product_variant.product.id,
            "name": item.product_variant.product.name,
            "slug": item.product_variant.product.slug,
            "price": float(item.product_variant.product.price),
            "quantity": item.quantity,
            "size": item.product_variant.size.name,
            "variant_id": item.product_variant.id,
            "max_stock": item.product_variant.stock,
            "variants": variant_data,
            "image": request.build_absolute_uri(item.product_variant.product.productimage_set.first().image.url) if item.product_variant.product.productimage_set.exists() else "/static/images/sample1.png"
        })

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
            if "coupon_code" in request.session:
                del request.session["coupon_code"]
                
    shipping = 0 if subtotal > 999 or subtotal == 0 else 80
    final_total = subtotal + shipping

    return JsonResponse({
        "items": serialized_items,
        "subtotal": subtotal,
        "original_total": original_total,
        "saved_amount": saved_amount,
        "shipping": shipping,
        "final_total": final_total,
        "cart_count": cart_count,
        "discount_percentage": discount_percentage,
        "coupon_code": coupon_code or ""
    })

def api_cart_add(request):
    if request.method != "POST":
        return JsonResponse({"success": False, "message": "POST required"}, status=400)
    
    try:
        body = json.loads(request.body)
        variant_id = body.get("variant_id")
        quantity = int(body.get("quantity", 1))
    except Exception:
        variant_id = request.POST.get("variant_id")
        quantity = int(request.POST.get("quantity", 1))

    variant = get_object_or_404(ProductVariant, id=variant_id)
    if variant.stock <= 0:
        return JsonResponse({"success": False, "message": "Out of stock"}, status=400)

    cart = get_or_create_cart(request)
    cart_item, created = CartItem.objects.get_or_create(cart=cart, product_variant=variant)
    
    if not created:
        if cart_item.quantity + quantity <= variant.stock:
            cart_item.quantity += quantity
            cart_item.save()
        else:
            return JsonResponse({"success": False, "message": f"Only {variant.stock} items in stock"}, status=400)
    else:
        cart_item.quantity = quantity
        cart_item.save()

    return JsonResponse({"success": True})

def api_cart_update_quantity(request):
    if request.method != "POST":
        return JsonResponse({"success": False, "message": "POST required"}, status=400)

    try:
        body = json.loads(request.body)
        item_id = body.get("item_id")
        action = body.get("action")  # 'increase' or 'decrease'
    except Exception:
        item_id = request.POST.get("item_id")
        action = request.POST.get("action")

    cart_item = get_object_or_404(CartItem, id=item_id)
    if action == "increase":
        if cart_item.quantity < cart_item.product_variant.stock:
            cart_item.quantity += 1
            cart_item.save()
        else:
            return JsonResponse({"success": False, "message": "Insufficient stock"}, status=400)
    elif action == "decrease":
        if cart_item.quantity > 1:
            cart_item.quantity -= 1
            cart_item.save()
        else:
            cart_item.delete()
            
    return JsonResponse({"success": True})

def api_cart_update_size(request):
    if request.method != "POST":
        return JsonResponse({"success": False, "message": "POST required"}, status=400)

    try:
        body = json.loads(request.body)
        item_id = body.get("item_id")
        variant_id = body.get("variant_id")
    except Exception:
        item_id = request.POST.get("item_id")
        variant_id = request.POST.get("variant_id")

    cart_item = get_object_or_404(CartItem, id=item_id)
    new_variant = get_object_or_404(ProductVariant, id=variant_id)
    
    # Merge duplicate items in cart
    existing_item = CartItem.objects.filter(cart=cart_item.cart, product_variant=new_variant).first()
    if existing_item and existing_item.id != cart_item.id:
        existing_item.quantity += cart_item.quantity
        if existing_item.quantity > new_variant.stock:
            existing_item.quantity = new_variant.stock
        existing_item.save()
        cart_item.delete()
    else:
        cart_item.product_variant = new_variant
        if cart_item.quantity > new_variant.stock:
            cart_item.quantity = new_variant.stock
        cart_item.save()

    return JsonResponse({"success": True})

def api_cart_remove(request):
    if request.method != "POST":
        return JsonResponse({"success": False, "message": "POST required"}, status=400)

    try:
        body = json.loads(request.body)
        item_id = body.get("item_id")
    except Exception:
        item_id = request.POST.get("item_id")

    cart_item = get_object_or_404(CartItem, id=item_id)
    cart_item.delete()
    return JsonResponse({"success": True})

def api_cart_apply_coupon(request):
    if request.method != "POST":
        return JsonResponse({"success": False, "message": "POST required"}, status=400)

    try:
        body = json.loads(request.body)
        code = body.get("code")
    except Exception:
        code = request.POST.get("code")

    try:
        coupon = Coupon.objects.get(code=code, active=True)
        request.session["coupon_code"] = coupon.code
        return JsonResponse({"success": True, "discount_percentage": coupon.discount_percentage})
    except Coupon.DoesNotExist:
        if "coupon_code" in request.session:
            del request.session["coupon_code"]
        return JsonResponse({"success": False, "message": "Invalid or expired coupon"}, status=400)

# ================= CHECKOUT ENDPOINT =================
def api_checkout(request):
    if request.method != "POST":
        return JsonResponse({"success": False, "message": "POST required"}, status=400)

    cart = get_or_create_cart(request)
    items = CartItem.objects.filter(cart=cart)
    if not items.exists():
        return JsonResponse({"success": False, "message": "Cart is empty"}, status=400)

    try:
        body = json.loads(request.body)
    except Exception:
        body = request.POST

    email = body.get("email")
    first_name = body.get("first_name")
    last_name = body.get("last_name")
    address = body.get("address")
    apartment = body.get("apartment", "")
    city = body.get("city")
    state = body.get("state")
    pincode = body.get("pincode")
    phone = body.get("phone")
    payment_method = body.get("payment_method", "razorpay")
    coupon_code = body.get("coupon")

    if not all([email, first_name, last_name, address, city, state, pincode, phone]):
        return JsonResponse({"success": False, "message": "Missing required shipping fields"}, status=400)

    # Subtotal and discounts
    subtotal = sum(item.total_price() for item in items)
    shipping = 0 if subtotal > 999 else 80
    discount = 0
    coupon_obj = None

    if coupon_code:
        try:
            coupon_obj = Coupon.objects.get(code=coupon_code, active=True)
            discount = subtotal * coupon_obj.discount_percentage / 100
        except Coupon.DoesNotExist:
            pass

    final_total = float(subtotal - discount + shipping)
    full_address = f"{address}, {apartment}\n{city}, {state} {pincode}"

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
        
        # Reduce Stock
        for item in items:
            variant = item.product_variant
            if variant.stock >= item.quantity:
                variant.stock -= item.quantity
                variant.save()

        # Clear Cart
        items.delete()
        if "coupon_code" in request.session:
            del request.session["coupon_code"]

        return JsonResponse({"success": True, "payment_method": "cod", "order_id": order.id})

    # Razorpay payment
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

        return JsonResponse({
            "success": True,
            "payment_method": "razorpay",
            "order_id": order.id,
            "razorpay_order_id": razorpay_order["id"],
            "amount": final_total,
            "razorpay_key": settings.RAZORPAY_KEY_ID
        })
    except Exception as e:
        # Fallback to COD if Razorpay fails
        order.payment_id = "COD_FALLBACK"
        order.save()
        
        # Reduce Stock
        for item in items:
            variant = item.product_variant
            if variant.stock >= item.quantity:
                variant.stock -= item.quantity
                variant.save()
        items.delete()
        
        return JsonResponse({
            "success": True,
            "payment_method": "cod",
            "order_id": order.id,
            "message": "Razorpay initialization failed, fell back to Cash on Delivery"
        })

# ================= AUTH ENDPOINTS =================
def api_auth_status(request):
    if request.user.is_authenticated:
        return JsonResponse({
            "is_authenticated": True,
            "username": request.user.username,
            "email": request.user.email
        })
    return JsonResponse({"is_authenticated": False})

def api_auth_login(request):
    if request.method != "POST":
        return JsonResponse({"success": False, "message": "POST required"}, status=400)

    try:
        body = json.loads(request.body)
        username = body.get("username")
        password = body.get("password")
    except Exception:
        username = request.POST.get("username")
        password = request.POST.get("password")

    user = authenticate(request, username=username, password=password)
    if user is not None:
        auth_login(request, user)
        # Migrate anonymous cart if it exists
        session_id = request.session.session_key
        if session_id:
            anon_cart = Cart.objects.filter(session_id=session_id).first()
            if anon_cart:
                user_cart, created = Cart.objects.get_or_create(user=user)
                # Transfer items
                for item in CartItem.objects.filter(cart=anon_cart):
                    existing = CartItem.objects.filter(cart=user_cart, product_variant=item.product_variant).first()
                    if existing:
                        existing.quantity += item.quantity
                        existing.save()
                        item.delete()
                    else:
                        item.cart = user_cart
                        item.save()
                anon_cart.delete()

        return JsonResponse({"success": True, "username": user.username})
    return JsonResponse({"success": False, "message": "Invalid username or password"}, status=400)

def api_auth_signup(request):
    if request.method != "POST":
        return JsonResponse({"success": False, "message": "POST required"}, status=400)

    try:
        body = json.loads(request.body)
        username = body.get("username")
        email = body.get("email")
        password = body.get("password")
    except Exception:
        username = request.POST.get("username")
        email = request.POST.get("email")
        password = request.POST.get("password")

    if not all([username, email, password]):
        return JsonResponse({"success": False, "message": "Missing fields"}, status=400)

    if User.objects.filter(username=username).exists():
        return JsonResponse({"success": False, "message": "Username already exists"}, status=400)

    if User.objects.filter(email=email).exists():
        return JsonResponse({"success": False, "message": "Email already exists"}, status=400)

    user = User.objects.create_user(username=username, email=email, password=password)
    auth_login(request, user)
    return JsonResponse({"success": True, "username": user.username})

def api_auth_logout(request):
    auth_logout(request)
    return JsonResponse({"success": True})
