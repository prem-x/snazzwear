from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login
from django.views.generic import TemplateView
from products.models import Product

class HomeView(TemplateView):
    template_name = "core/home.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        context['new_arrivals'] = Product.objects.filter(is_new=True)
        context['top_selling'] = Product.objects.filter(is_top_selling=True)
        from products.views import get_wishlist_ids
        context['wishlist_product_ids'] = get_wishlist_ids(self.request)

        return context

def signup(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('home')
    else:
        form = UserCreationForm()
    return render(request, 'registration/signup.html', {'form': form})