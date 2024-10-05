from django.urls import re_path as path
from .views import (
    login_view,
    logout_view,
    get_live_matches,
    get_live_matches2,
    get_recent_updates,
    index,
    LiveMatches,
    SingleMatch,
    newsPage,
    newsDetailPage,
    LeagueInfo,
    Settings,
    generalSettings,
    helpSettings,
    TOsSettings,
    AdvertWithUs,
    PrivacyPolicy
)

urlpatterns = [
    path(r'^$', index, name='pc_index'),

    path(r'^live-matches/', LiveMatches, name='pc_live_match'),
    path(r'^match-detail/(?P<match_id>[\w-]+)/$', SingleMatch, name='pc_single_match'),

    path(r'^league-info/(?P<league_id>[\w-]+)/$', LeagueInfo, name='pc_league_info'),
    
    path(r'^news/$', newsPage, name='pc_news'),
    path(r'^news/(?P<slug>[\w-]+)/$', newsDetailPage, name='pc_news_detail'),


    path(r'^login/$', login_view, name='login'),
    path(r'^logout/$', logout_view, name='logout'),
    

    path(r'^settings/$', Settings, name='pc_settings'),
    path(r'^general-settings/$', generalSettings, name='pc_g_settings'),
    path(r'^help-center/$', helpSettings, name='pc_help'),
    path(r'^terms-and-conditions/$', TOsSettings, name='pc_tos'),
    path(r'^advertise/$', AdvertWithUs, name='pc_advertise'),
    path(r'^privacy-policy/$', PrivacyPolicy, name='pc_policy'),


    path(r'^api/live-matches/$', get_live_matches, name='pc_get_live_matches'),
    path(r'^api/live-matches-all/$', get_live_matches2, name='pc_get_live_matches2'),
    path(r'^api/recent-updates/$', get_recent_updates, name='pc_get_recent_updates'),
]
