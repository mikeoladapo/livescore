# sitemaps.py

from django.contrib.sitemaps import Sitemap
from django.urls import reverse

class FootballSitemap(Sitemap):
    changefreq = 'weekly'
    priority = 0.9

    def items(self):
        return ['pc_index', 'pc_policy', 'pc_advertise', 'pc_news', 'pc_tos', 'pc_help', 'pc_live_match']

    def location(self, item):
        return reverse(item)

    def lastmod(self, obj):
        # Implement if you want to provide last modification times
        return None
