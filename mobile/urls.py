from django.urls import re_path as path
from .views import (
    get_live_matches,
    get_live_matches2,
    get_recent_updates,
    index,
    LiveMatches,
    SingleMatch,
    newsPage,
    LeagueInfo,
    newsDetailPage,
    Settings,
    generalSettings,
    helpSettings,
    TOsSettings,
    AdvertWithUs,
    PrivacyPolicy
)

urlpatterns = [
    path(r'^$', index, name='index'),

    path(r'^live-matches/$', LiveMatches, name='m_live_match'),
    path(r'^match-detail/(?P<match_id>[\w-]+)/$', SingleMatch, name='m_single_match'),

    path(r'^league-info/(?P<league_id>[\w-]+)/$', LeagueInfo, name='m_league_info'),
    
    path(r'^news/$', newsPage, name='m_news'),
    path(r'^news/(?P<slug>[\w-]+)/(?P<news_type>[\w-]+)/$', newsDetailPage, name='m_news_detail'),

    path(r'^settings/$', Settings, name='m_settings'),
    path(r'^general-settings/$', generalSettings, name='g_settings'),
    path(r'^help-center/$', helpSettings, name='m_help'),
    path(r'^terms-and-conditions/$', TOsSettings, name='m_tos'),
    path(r'^advertise/$', AdvertWithUs, name='m_advertise'),
    path(r'^privacy-policy/$', PrivacyPolicy, name='m_policy'),


    path(r'^api/live-matches/$', get_live_matches, name='get_live_matches'),
    path(r'^api/live-matches-all/$', get_live_matches2, name='get_live_matches2'),
    path(r'^api/recent-updates/$', get_recent_updates, name='get_recent_updates'),
]
