from django.db import models

class Slide(models.Model):
    title = models.CharField(max_length=200, blank=True)
    subtitle = models.TextField(blank=True)
    button_text = models.CharField(max_length=50, default='Shop Now', blank=True, help_text="Leave blank to make the entire slide clickable without showing a button.")
    link = models.CharField(max_length=200, default='/shop', blank=True)
    image = models.ImageField(upload_to='slides/')
    order = models.PositiveIntegerField(default=0)
    active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return self.title or f"Slide {self.id}"
