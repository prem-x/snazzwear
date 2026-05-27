from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from .models import Product, Wishlist

def product_detail(request, slug):
    product = get_object_or_404(Product, slug=slug)
    images = product.productimage_set.all()
    variants = product.productvariant_set.all()

    similar_products = Product.objects.exclude(id=product.id)[:3]
    related_products = Product.objects.exclude(id=product.id)[:8]

    context = {
        'product': product,
        'images': images,
        'variants': variants,
        'similar_products': similar_products,
        'related_products': related_products,
        'wishlist_product_ids': get_wishlist_ids(request),
    }

    return render(request, 'products/product_detail.html', context)

from django.db.models import Q

def get_wishlist_session(request):
    if not request.session.session_key:
        request.session.create()
    return request.session.session_key

def get_wishlist_ids(request):
    if request.user.is_authenticated:
        return list(Wishlist.objects.filter(user=request.user).values_list('product_id', flat=True))
    else:
        return list(Wishlist.objects.filter(session_id=get_wishlist_session(request)).values_list('product_id', flat=True))

def shop(request):
    query = request.GET.get('q', '')
    if query:
        products = Product.objects.filter(
            Q(name__icontains=query) | Q(description__icontains=query)
        )
    else:
        products = Product.objects.all()
        
    return render(request, 'products/shop.html', {
        'products': products,
        'search_query': query,
        'wishlist_product_ids': get_wishlist_ids(request)
    })

def wishlist_page(request):
    if request.user.is_authenticated:
        wishlist_items = Wishlist.objects.filter(user=request.user).select_related('product')
    else:
        session_id = get_wishlist_session(request)
        wishlist_items = Wishlist.objects.filter(session_id=session_id).select_related('product')
        
    products = [item.product for item in wishlist_items]
    
    return render(request, 'products/wishlist.html', {
        'products': products,
        'wishlist_product_ids': get_wishlist_ids(request)
    })

def toggle_wishlist(request):
    if request.method == "POST":
        product_id = request.POST.get("product_id")
        product = get_object_or_404(Product, id=product_id)
        
        if request.user.is_authenticated:
            wishlist_item = Wishlist.objects.filter(user=request.user, product=product).first()
            if wishlist_item:
                wishlist_item.delete()
                is_active = False
            else:
                Wishlist.objects.create(user=request.user, product=product)
                is_active = True
        else:
            session_id = get_wishlist_session(request)
            wishlist_item = Wishlist.objects.filter(session_id=session_id, product=product).first()
            if wishlist_item:
                wishlist_item.delete()
                is_active = False
            else:
                Wishlist.objects.create(session_id=session_id, product=product)
                is_active = True

        return JsonResponse({"success": True, "is_active": is_active})
        
    return JsonResponse({"success": False})