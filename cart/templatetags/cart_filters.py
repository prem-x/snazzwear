from django import template

register = template.Library()

@register.filter
def sub(value, arg):
    """Subtracts arg from value."""
    try:
        return int(value) - int(arg)
    except (ValueError, TypeError):
        return value
