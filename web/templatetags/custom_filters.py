import re
from django import template
from django.utils import timezone
from datetime import datetime

register = template.Library()

@register.filter
def iso_to_datetime(value):
    try:
        return datetime.fromisoformat(value)
    except ValueError:
        return value  # In case of an error, return the original value


@register.filter
def remove_en(url):
    if url.startswith('/en/'):
        return url[4:]  # Remove the first 4 characters
    return url

@register.filter
def filter_blocks(blocks):
    filtered_blocks = []
    for block in blocks:
        content = block.get('data', {}).get('content', '')
        if any(phrase in content for phrase in ["LiveScore 6", "LiveScore Bet"]):
            continue
        if re.search(r'http[s]?://', content):
            continue
        filtered_blocks.append(block)
    return filtered_blocks


@register.filter
def time_ago(value):
    if not value:
        return ""
    now = timezone.now()
    try:
        published_time = datetime.strptime(value, "%Y-%m-%dT%H:%M:%S%z")
    except (ValueError, TypeError):
        return value

    delta = now - published_time

    if delta.days > 1:
        return f"{delta.days} days ago"
    elif delta.days == 1:
        return "1 day ago"
    elif delta.seconds >= 3600:
        hours = delta.seconds // 3600
        return f"{hours} hours ago" if hours > 1 else "1 hour ago"
    elif delta.seconds >= 60:
        minutes = delta.seconds // 60
        return f"{minutes} minutes ago" if minutes > 1 else "1 minute ago"
    else:
        return "just now"
