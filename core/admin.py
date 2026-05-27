from django.contrib import admin
from .models import Slide

@admin.register(Slide)
class SlideAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'order', 'active')
    list_editable = ('order', 'active')
